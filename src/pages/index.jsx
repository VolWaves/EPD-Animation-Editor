import React, { PureComponent, useEffect, useState, useRef } from "react"
import { Image, ConfigProvider, Button, Form, message } from "antd"
import ElementListModal from "@/components/elementListModal"
import FrameLine from "@/components/frameLine"
import store from "@/utils/store"
import imgHolder from "../assets/holder.png"
import styles from "./index.module.scss"
import clipboardy from "clipboardy"

const HomePage = (props) => {
	const [form] = Form.useForm()
	const [messageApi, contextHolder] = message.useMessage()
	const [layerShow, setLayerShow] = useState(false)
	const [codeResult, setCodeResult] = useState("")
	const textAreaRef = useRef(null)
	const [currentSelectedElementItems, setCurrentSelectedElementItems] =
		useState([])
	useEffect(() => {
		initData()
	}, [])
	const initData = () => {
		const selectedElementItems = store.get("selectedElementItems")
		if (
			Array.isArray(selectedElementItems) &&
			selectedElementItems.length > 0
		) {
			setCurrentSelectedElementItems(selectedElementItems)
		} else {
			showModal()
		}
	}

	const showModal = () => {
		setLayerShow(true)
	}

	const handleOk = (selectedItems) => {
		setLayerShow(false)
		setCurrentSelectedElementItems(selectedItems)
	}

	const resetAll = () => {
		store.remove("selectedElementItems")
		store.remove("curFrames")
		location.reload()
	}

	const handleStart = () => {
		form.validateFields()
			.then((values) => {
				const frames = form.getFieldValue("frames")
				const frame2base64 = function (frames) {
					// console.log("--------", frames)
					let size = 0
					frames.forEach((element) => {
						if (
							element.state == "black" ||
							element.state == "white"
						) {
							size += 18
						}
						if (element.state == "wait") {
							size += 4
						}
					})
					const buf = new ArrayBuffer(size)
					const dataView = new Uint8Array(buf)
					const stateMap = {
						white: 0xe0,
						black: 0xe1,
						wait: 0xa1,
					}
					let currentIdx = 0
					let isErr = 0
					frames.forEach((element) => {
						dataView[currentIdx] = stateMap[element.state]
						if (
							dataView[currentIdx] == 0xe0 ||
							dataView[currentIdx] == 0xe1
						) {
							dataView[currentIdx + 1] = Math.round(
								element.time / 10
							)
							for (let index = 2; index < 18; index++) {
								dataView[currentIdx + index] = 0x00
							}
							element.element.forEach((item) => {
								dataView[
									currentIdx + 2 + Math.floor(item / 8)
								] |= 0x80 >> item % 8
							})
							currentIdx += 18
						} else if (dataView[currentIdx] == 0xa1) {
							dataView[currentIdx + 1] = element.time & 0xff
							dataView[currentIdx + 2] =
								(element.time >> 8) & 0xff
							dataView[currentIdx + 3] = 0xa0
							currentIdx += 4
						} else {
							isErr += 1
						}
					})
					if (isErr) {
						messageApi.open({
							type: "error",
							content: "未知的帧类型",
						})
						return
					}
					// console.log("Size:", size)
					let binary = ""
					for (var i = 0; i < size; i++) {
						binary += String.fromCharCode(dataView[i])
					}
					return window.btoa(binary) + "=="
				}
				const result = frame2base64(frames)
				setCodeResult(result)
			})
			.catch((errorInfo) => {
				console.log(errorInfo)
				if (errorInfo) {
					messageApi.open({
						type: "error",
						content: "请检查未填写的项目",
					})
				}
			})
	}

	const copy = () => {
		if (!codeResult) return
		clipboardy.write(textAreaRef.current.value)
		messageApi.open({
			type: "success",
			content: "复制成功",
		})
	}

	return (
		<div className={styles.page}>
			{contextHolder}
			<ElementListModal open={layerShow} onConfirm={handleOk} />
			{Array.isArray(currentSelectedElementItems) &&
			currentSelectedElementItems.length ? (
				<div className="container flex-sub">
					<div className="top-area flex-sub flex">
						<div className="left flex-sub flex align-center justify-center">
							<Image
								src={imgHolder}
								preview={false}
								fallback="data:image/png;base64,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"
							/>
						</div>
						<div className="right flex-sub">
							<div className="flex justify-between btn-area">
								<Button
									type="primary"
									danger
									onClick={resetAll}
								>
									内容重置
								</Button>
								<Button type="primary" onClick={handleStart}>
									生成代码
								</Button>
							</div>
							<textarea
								className="textArea"
								value={codeResult}
								readOnly
								ref={textAreaRef}
								onClick={copy}
							/>
						</div>
					</div>
					<div className="bottom-area flex-twice">
						<FrameLine form={form} />
					</div>
				</div>
			) : null}
		</div>
	)
}

export default HomePage

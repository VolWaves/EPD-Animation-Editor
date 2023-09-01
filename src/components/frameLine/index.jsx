import React, {useEffect, useState} from 'react';
import { Button, Modal, Select, Form, Input, Divider, InputNumber, Table } from 'antd';
import { PlusOutlined, MinusCircleOutlined, CopyOutlined } from '@ant-design/icons';
import {statusList} from "../../constant/data";
import store from "@/utils/store";
import styles from './index.module.scss'
const FrameLine = props => {
  const {form} = props
  let { frames = [] } = form.getFieldsValue()
  const { Option } = Select;
  const [list,setList] = useState([])
  const [loading, setLoading] = useState(false)
  const selectedItems = store.get('selectedElementItems')
  const curFrames = store.get('curFrames')
  const [elementOptions , setElementOptions ] = useState([])
  useEffect(()=>{
    if(Array.isArray(selectedItems)){
      let result = selectedItems.map(i=>{
        return {
          value: i,
          label: `SEG${i}`,
        }
      })
      setElementOptions(result)
    }
    let framesData = []
    if(Array.isArray(curFrames)){
      framesData = curFrames
    }
    form.setFieldsValue({frames: framesData})
    setList(framesData)
  },[])

  const saveCurList = (data) => {
    store.set('curFrames', data)
  }

  const handleAddFrame = () => {
    const newItem = {
      id: `created${new Date().getTime()}`, // 表格rowKey
      state: 'wait',
      time: 10,
      element: []
    }
    const newList = [...list,newItem]
    setList(newList)
    form.setFieldsValue({frames: newList})
    saveCurList(newList)
  }

  const handleDelete = (idx) => {
    const { setFieldsValue } = props.form
    const frames = form.getFieldValue('frames')
    frames.splice(idx, 1)
    setFieldsValue({ frames })
    // 显示条数要更新
    const newData = list.slice()
    newData.splice(idx, 1)
    setList(newData)
    saveCurList(newData)
  }

  const handleCopy = (idx) => {
    const { setFieldsValue } = props.form
    const frames = form.getFieldValue('frames')
    const copyItem = {...frames[idx],id: `created${new Date().getTime()}`,}
    frames.push(copyItem)
    setFieldsValue({ frames })
    const newData = [...list,copyItem]
    setList(newData)
    saveCurList(newData)
  }

  const onFormChange = (value,idx,name) => {
    const { setFieldsValue } = props.form
    const frames = form.getFieldValue('frames')
    const newItem = frames[idx] || {}
    newItem[name] = value
    frames[idx] = newItem
    setFieldsValue({frames})
    list[idx][name] = value
    setList(list)
    saveCurList(list)
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'order',
      width: 100,
      key: 'order',
      render: (text, record, idx) => {
        return (<div className="bold">第{idx+1}帧</div>)
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 150,
      render:  (text, record, idx) => {
        return (<Form.Item
          name={`frames[${idx}].state`}
          initialValue={text}
        >
          <Select
            placeholder="请选择状态"
            value={record.state}
            onChange={(value)=>{onFormChange(value,idx,'state')}}
          >
            {
              statusList.map((item,index)=>{
                return <Option value={item.value} key={index}>{item.label}</Option>
              })
            }
          </Select>
        </Form.Item>)
      }
    },
    {
      title: '持续时间',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      render:  (text, record, idx) => {
        return (
          <Form.Item noStyle shouldUpdate>
            {
              ({getFieldValue}) => {
                const frames = getFieldValue('frames') || []
                const {state} = frames[idx] || {}
                const minTime = 10
                const maxTime = state === 'wait' ? 100000 : 500
                return (<Form.Item
                  name={`frames[${idx}].time`}
                  rules={[
                    {
                      required: true,
                      message: '时间必填',
                    },
                  ]}
                  initialValue={text}
                >
                  <InputNumber min={minTime} max={maxTime} step={10} value={text} onChange={(e)=>onFormChange(e,idx,'time')}/>
                </Form.Item>)
              }
            }
          </Form.Item>
        )
      }
    },
    {
      title: 'SEG线',
      dataIndex: 'element',
      key: 'element',
      width: 500,
      render:  (text, record, idx) => {
        return (<Form.Item noStyle shouldUpdate>
          {
            ({getFieldValue}) => {
              const frames = getFieldValue('frames') || []
              const {state} = frames[idx] || {}
              return (
                <Form.Item
                  name={`frames[${idx}].element`}
                  rules={[
                    {
                      required: state !== 'wait',
                      message: '非等待帧必须选择SEG线',
                    },
                  ]}
                  initialValue={text}
                  shouldUpdate
                >
                <Select
                  mode="multiple"
                  placeholder="Please select"
                  style={{
                    width: '100%',
                  }}
                  disabled={state === 'wait'}
                  options={elementOptions}
                  onChange={(value)=>{onFormChange(value,idx,'element')}}
                />
                </Form.Item>
              )
            }
          }
        </Form.Item>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, idx) => {
        return (
          <>
            <Button
              onClick={() => handleDelete(idx)}
              icon={<MinusCircleOutlined />}
            >
              删除
            </Button>
            <Divider type="vertical" />
            <Button
              onClick={() => handleCopy(idx)}
              icon={<CopyOutlined />}
            >
              复制
            </Button>
          </>
        )
      }
    }
  ];

  return (
    <div className={styles.wrap}>
      <div>
        <Form form={form}>
          <Table
            columns={columns}
            rowKey="id"
            dataSource={list}
            pagination={false}
            loading={loading}
            scroll={{
              y: 240,
            }}
          />
        </Form>
        <div className="flex align-center justify-center mt20">
          <Button
            onClick={() => handleAddFrame()}
            icon={<PlusOutlined />}
          >
            新增关键帧
          </Button>
        </div>
      </div>

    </div>
  )

}

export default FrameLine

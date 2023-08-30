import React, {useEffect, useState, useRef, useCallback} from 'react';
import { Button, Modal, Select, Form, Input, Space, InputNumber   } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {statusList} from "../../constant/data";
import store from "@/utils/store";
import styles from './index.module.scss'
const { Option } = Select;
const ItemView = props => {
  const { source, order, onStatusChange, elementOptions } = props
  const { state = 'wait', time } = source || {}
  const maxTime = state === 'wait' ? 100000 : 500
  const minTime = 10
  console.log('---------------????state',state)
  return (
    <div className={styles.itemWrap}>
      <Space align="baseline">
        <div className="bold">第{order+1}帧</div>
        <div>
          <Select
            style={{
            width: 130,
          }}
            placeholder="请选择状态"
            defaultValue={state}
            onChange={(e)=>onStatusChange(e,order)}
          >
            {
              statusList.map((item,index)=>{
                return <Option value={item.value} key={index}>{item.label}</Option>
              })
            }
          </Select>
        </div>
        <div>
          <InputNumber min={minTime} max={maxTime} defaultValue={10} step={10} value={time}/>
        </div>
        <div>
          <Select
            mode="multiple"
            placeholder="Please select"
            style={{
              width: '600px',
            }}
            disabled={state==='wait'}
            options={elementOptions}
          />
        </div>

      </Space>
    </div>
    )

}
const FrameLine = props => {
  // const {form} = props
  // const { frames } = form.getFieldsValue()

  const [list,setList] = useState([])
  const listRef = useRef(null)
  const selectedItems = store.get('selectedElementItems')
  const [elementOptions , setElementOptions ] = useState([])
  useEffect(()=>{
    if(Array.isArray(selectedItems)){
      let result = selectedItems.map(i=>{
        return {
          value: i,
          label: `元素${i}`,
        }
      })
      setElementOptions(result)
    }
  },[])

  const scrollBottom = () => {
    const current = listRef.current
    current.scrollTop = current.scrollHeight
  }

  const handleAddFrame = () => {
    const newItem = {
      state: 'wait',
      time: 10,
      selectedElement: []
    }
    const newList = [...list,newItem]
    setList(newList)
    scrollBottom()
  }

  const onStatusChange = (value,index) => {
    const newList = [...list]
    newList[index].state = value
    console.log('------------------->>>>',newList)
    setList(newList)
  }

  return (
    <div className={styles.wrap} ref={listRef}>
      <div>
        {
          list.map((item,index)=>{
            return <ItemView
              key={index}
              order={index}
              elementOptions={elementOptions}
              onStatusChange={onStatusChange}
            />
          })
        }
        <Button
          onClick={() => handleAddFrame()}
          icon={<PlusOutlined />}
        >
          新增关键帧
        </Button>
      </div>

    </div>
  )

}

export default FrameLine
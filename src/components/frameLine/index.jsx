import React, {useEffect, useState} from 'react';
import { Button, Modal, Select, Form, Input, Space, InputNumber, Table } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
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
  const [elementOptions , setElementOptions ] = useState([])
  useEffect(()=>{
    form.setFieldsValue({frames: []})
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
  }

  const handleDelete = (idx) => {
    const { getFieldsValue, setFieldsValue } = props.form
    const { frames = [] } = getFieldsValue()
    frames.splice(idx, 1)
    setFieldsValue({ frames })
    // 显示条数要更新
    const newData = list.slice()
    newData.splice(idx, 1)
    setList(newData)
  }

  const onStatusChange = (value,idx) => {
    const { getFieldsValue, setFieldsValue } = props.form
    const { frames = [] } = getFieldsValue()
    const newItem = frames[idx] || {}
    newItem.state = value
    frames[idx] = newItem
    setFieldsValue({frames})
    list[idx].state = value
    setList(list)
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
          name={`frames[${idx}.state]`}
          initialValue='wait'
        >
          <Select
            placeholder="请选择状态"
            value={record.state}
            onChange={(value)=>{onStatusChange(value,idx)}}
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
        const state = record.state
        const minTime = 10
        const maxTime = state === 'wait' ? 100000 : 500
        return (<Form.Item
          name={`frames[${idx}.time]`}
          rules={[
            {
              required: true,
              message: '时间必填',
            },
          ]}
        >
          <InputNumber min={minTime} max={maxTime} step={10}/>
        </Form.Item>)
      }
    },
    {
      title: '可选元素',
      dataIndex: 'element',
      key: 'element',
      width: 500,
      render:  (text, record, idx) => {
        const state = record.state
        console.log('---------->>>>>',state)
        return (<Form.Item
          name={`frames[${idx}.element]`}
          rules={[
            {
              required: state !== 'wait',
              message: '元素必选',
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Please select"
            style={{
              width: '100%',
            }}
            disabled={state==='wait'}
            options={elementOptions}
          />
        </Form.Item>)
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
        <div>
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
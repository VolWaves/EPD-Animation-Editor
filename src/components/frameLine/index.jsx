import React, {useEffect, useState} from 'react';
import { Button, Modal, Select, Form, Input, Space, InputNumber   } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {statusList} from "../../constant/data";
import store from "@/utils/store";
import styles from './index.module.scss'
const FrameLine = props => {
  const {form} = props
  const { frames } = form.getFieldsValue()
  const { Option } = Select;
  const [list,setList] = useState([])
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

  const handleAddFrame = () => {
    const newItem = {

    }
    const newList = [...list,newItem]
    setList(newList)
  }

  const onStatusChange = e => {

  }

  return (
    <div className={styles.wrap}>
      <Form form={form}>
        <Form.List name="frames">
          {(fields, { add, remove }, { errors }) => (
            <>
            {fields.map((field, index) => {
              const { state } = frames&&frames[index] || {}
              const maxTime = 500
              const minTime = 10
              return  <Form.Item
                label={''}
                required={false}
                key={field.key}
              >
                <Space align="baseline">
                  <Form.Item
                    {...field}
                    label="状态"
                    initialValue="wait"
                    name={[field.name, 'state']}
                    style={{
                      width: 130,
                    }}
                  >
                    <Select placeholder="请选择状态">
                      {
                        statusList.map((item,index)=>{
                          return   <Option value={item.value} key={index}>{item.label}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="持续时间"
                    name={[field.name, 'time']}
                    rules={[
                      {
                        required: true,
                        message: '时间必填',
                      },
                    ]}
                  >
                    <InputNumber min={minTime} max={maxTime} defaultValue={10} step={10}/>
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="可选元素"
                    name={[field.name, 'element']}
                    style={{
                      width: 500
                    }}
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
                  </Form.Item>
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                </Space>
              </Form.Item>
            })}
              <Form.Item>
                <Button
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  新增关键帧
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </div>
  )

}

export default FrameLine
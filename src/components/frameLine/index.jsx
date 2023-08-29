import React, { useState } from 'react';
import { Button, Modal, Select, Form, Input, Space  } from 'antd';
import { elementList } from "@/constant/data";
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import store from "@/utils/store";
import styles from './index.module.scss'
const FrameLine = props => {
  const {form} = props
  const [list,setList] = useState([])

  const handleAddFrame = () => {
    const newItem = {

    }
    const newList = [...list,newItem]
    setList(newList)
  }

  return (
    <div className={styles.wrap}>
      <Form form={form}>
        <Form.List name="frames">
          {(fields, { add, remove }, { errors }) => (
            <>
            {fields.map((field, index) => (

                <Form.Item
                  label={''}
                  required={false}
                  key={field.key}
                >
                  <Space align="baseline">
                    <Form.Item
                      {...field}
                      label="状态"
                      name={[field.name, 'state']}
                      style={{
                        width: 130,
                      }}
                    >
                      <Select>
                        <Select.Option value="demo">Demo</Select.Option>
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
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="可选元素"
                      name={[field.name, 'element']}
                      style={{
                        width: 500
                      }}
                    >
                      <Select>
                        <Select.Option value="demo">Demo</Select.Option>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  </Space>
                </Form.Item>


            ))}
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
import React, {useEffect, useRef, useState, memo} from 'react';
import { Button, Select, Form, Divider, InputNumber, Table , Spin, Popconfirm } from 'antd';
import { PlusOutlined, MinusCircleOutlined, CopyOutlined } from '@ant-design/icons';
import scrollIntoView from 'scroll-into-view';
import {statusList} from "../../constant/data";
import store from "@/utils/store";
import styles from './index.module.scss'
const { Column } = Table;
const { Option } = Select;
const FrameTable = memo((props) => {
  const { frames, form, add, remove, tableHeight, elementOptions } = props;
  const tableRef = useRef();
  const handleCopy = (idx) => {
    const curFrames = form.getFieldValue('frames')
    const copyItem = {...curFrames[idx],id: `created${new Date().getTime()}`,}
    add(copyItem);
    saveCurList()
    setTimeout(()=>{
      scrollIntoView(document.querySelector('.scroll-row'), {
        align: {
          top: 0,
        },
      });
    },100)
  }

  const saveCurList = () => {
    const curFrames = form.getFieldValue('frames')
    store.set('curFrames', curFrames)
  }

  const handleRemove = (idx) => {
    remove(idx)
    saveCurList()
  }

  const onFormChange = (value,idx,name) => {
    saveCurList()
  }

  const handleAddFrame = () => {
    const newItem = {
      id: `created${new Date().getTime()}`, // 表格rowKey
      state: 'wait',
      time: 10,
      element: []
    }
    add(newItem);
    saveCurList()

    setTimeout(()=>{
      scrollIntoView(document.querySelector('.scroll-row'), {
        align: {
          top: 0,
        },
      });
    },100)
  }
  return (
    <Table
      dataSource={frames}
      pagination={false}
      rowKey="id"
      size={'small'}
      ref={tableRef}
      rowClassName={(record, index) => (index === frames.length - 1 ? 'scroll-row' : '')}
      scroll={{
        y: tableHeight,
      }}
      footer={() => (
        <div className="flex align-center justify-center">
          <Button
            onClick={() => handleAddFrame()}
            icon={<PlusOutlined />}
          >
            新增关键帧
          </Button>
        </div>

      )}
    >
      <Column
        dataIndex={"order"}
        title={"序号"}
        width={100}
        render={(text, record, idx) => {
          return (<div className="bold">第{idx+1}帧</div>)
        }}
      />
      <Column
        dataIndex={"state"}
        title={"状态"}
        width={150}
        render={(text, record, idx) => {
          return (<Form.Item
            name={[idx,'state']}
          >
            <Select
              placeholder="请选择状态"
              onChange={(value)=>{onFormChange(value,idx,'state')}}
            >
              {
                statusList.map((item,index)=>{
                  return <Option value={item.value} key={index}>{item.label}</Option>
                })
              }
            </Select>
          </Form.Item>)
        }}
      />
      <Column
        dataIndex={'time'}
        title={"持续时间"}
        width={150}
        render={(text, record, idx) => {
          return (
            <Form.Item noStyle shouldUpdate>
              {
                ({getFieldValue}) => {
                  const frames = getFieldValue('frames') || []
                  const {state} = frames[idx] || {}
                  const minTime = 10
                  const maxTime = state === 'wait' ? 100000 : 500
                  return (<Form.Item
                    name={[idx,'time']}
                    rules={[
                      {
                        required: true,
                        message: '时间必填',
                      },
                    ]}
                  >
                    <InputNumber
                      min={minTime}
                      max={maxTime}
                      step={10}
                      addonAfter="ms"
                      onChange={(value)=>{onFormChange(value,idx,'time')}}
                    />
                  </Form.Item>)
                }
              }
            </Form.Item>
          )
        }}
      />
      <Column
        dataIndex={'element'}
        title={"SEG线"}
        render={(text, record, idx) => {
          return (<Form.Item noStyle shouldUpdate>
              {
                ({getFieldValue}) => {
                  const frames = getFieldValue('frames') || []
                  const {state} = frames[idx] || {}
                  return (
                    <Form.Item
                      name={[idx,'element']}
                      rules={[
                        {
                          required: state !== 'wait',
                          message: '非等待帧必须选择SEG线',
                        },
                      ]}
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
        }}
      />
      <Column
        dataIndex={"action"}
        title={"操作"}
        width={200}
        render={(text, record, idx) => {
          return ( <>
            <Button
              onClick={() => handleCopy(idx)}
              icon={<CopyOutlined  style={{
                color: '#88c99d'
              }}/>}
              style={{
                color: '#88c99d'
              }}
            >
              复制
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除吗？"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleRemove(idx)}
            >
              <Button
                icon={<MinusCircleOutlined />}
                type="primary"
                danger
              >
                删除
              </Button>
            </Popconfirm>

          </>)
        }}
      />
    </Table>
  )
})

const FrameLine = memo(props => {
  const {form} = props
  const [loading, setLoading] = useState(true)
  const [tableHeight, setTableHeight] = useState(240)
  const [initFormValues, setInitFormValues] = useState({})
  const pageRef = useRef(null)

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
    setInitFormValues({frames: framesData})
    form.resetFields();
    setLoading(false)
    const height = pageRef.current.clientHeight;
    setTableHeight(height - 110)
  },[])


  return (
    <div className={styles.wrap} ref={pageRef} >
      <Spin spinning={loading}>
        {
          !loading && ( <Form form={form} initialValues={initFormValues}>
            <Form.List name="frames">
              {
                (frames,{add,remove}) => {
                  return  <FrameTable
                    form={form}
                    frames={frames}
                    add={add}
                    remove={remove}
                    tableHeight={tableHeight}
                    elementOptions={elementOptions}
                  />
                }
              }
            </Form.List>
          </Form>)
        }
      </Spin>
    </div>
  )

})


export default FrameLine

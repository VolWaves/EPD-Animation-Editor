import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { elementList } from "@/constant/data";
import './index.module.scss'
const ElementListModal = props => {
  const { open, onConfirm } = props

  const handleOk = () => {
    onConfirm && onConfirm()
  }

  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  return (
    <>
      <Modal
        title="请选择"
        open={open}
        closable={false}
        footer={<Button type="primary" onClick={handleOk}>
               确定
             </Button>}>
        <Select
          mode="multiple"
          size="large"
          placeholder="Please select"
          defaultValue={[]}
          onChange={handleChange}
          style={{
            width: '100%',
          }}
          options={elementList}
        />
      </Modal>
    </>
  );
}
export default ElementListModal
import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { elementList } from "@/constant/data";
import store from "@/utils/store";
import './index.module.scss'
const ElementListModal = props => {
  const { open, onConfirm } = props
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmAble, setConfirmAble] = useState(false);

  const handleOk = () => {
    onConfirm && onConfirm(selectedItems)
    store.set('selectedElementItems',selectedItems)
  }

  const handleChange = (value) => {
    setSelectedItems(value)
    setConfirmAble(value.length > 0)
  };

  return (
    <>
      <Modal
        title="请选择"
        open={open}
        closable={false}
        footer={<Button type="primary" onClick={handleOk} disabled={!confirmAble}>
               确定
             </Button>}>
        <Select
          mode="multiple"
          size="large"
          placeholder="Please select"
          value={selectedItems}
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
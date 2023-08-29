import React, {PureComponent} from 'react';
import { Modal, Button, Select } from 'antd';
import ElementListModal from "@/components/elementListModal";
import styles from './index.module.scss'

class HomePage extends PureComponent {

  state = { layerShow: false };

  componentDidMount(){
    this.initData()
  }

  initData = () => {
    this.showModal()
  }

  showModal = () => {
    this.setState({
      layerShow: true,
    });
  };

  handleOk = e => {
    this.setState({
      layerShow: false,
    });
  };


  render() {
    return <div className={styles.page}>
      <ElementListModal open={this.state.layerShow} onConfirm={this.handleOk}/>
    </div>
  }
}

export default HomePage
import React from 'react';
import {Layout, Typography, Button, Row, Col, message } from 'antd';
import {
  LogoutOutlined,
  RedoOutlined
} from '@ant-design/icons'
import './design/SiteHeader.css';
import {useNavigate} from "react-router-dom";

import axios from 'axios';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const { Title } = Typography;
const { Header} = Layout;


export function SiteHeader(){

  const navigate = useNavigate();

  const forceRefresh = async () => {
    try {
      await axios({
          url: `api/dev/force`,
          method: "post",
          headers: {
              "x-access-token": cookies.get('access_token')
          },
      });
      window.location.reload();
    }
    catch (ex) {
        message.error("Can't refresh state");
        return;
    }
  };

  return(
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <Row>
        <Col span={8} offset={8}>
          <Title level={2} className="site-title">Crowler</Title>
        </Col>
        <Col offset={5}>
          <Button type="primary" shape='circle' icon={<RedoOutlined />} onClick={()=>forceRefresh()}/>
        </Col>
        <Col offset={1}>
          <Button type="primary" shape='circle' icon={<LogoutOutlined/>} danger onClick={()=>navigate("/")}/>
        </Col>
      </Row>
    </Header>
  );
  }

  export default SiteHeader;
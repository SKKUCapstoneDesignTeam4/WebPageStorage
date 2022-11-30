import React from 'react';
import {Layout, Typography, Button, Row, Col } from 'antd';
import {
  LogoutOutlined,
} from '@ant-design/icons'
import './design/SiteHeader.css';
import {useNavigate} from "react-router-dom";

const { Title } = Typography;
const { Header} = Layout;


export function SiteHeader(){

  const navigate = useNavigate();

  return(
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <Row>
        <Col span={8} offset={8}>
          <Title level={2} className="site-title">Crowler</Title>
        </Col>
        <Col offset={7}>
          <Button type="primary" shape='circle' icon={<LogoutOutlined/>} danger onClick={()=>navigate("/")}/>
        </Col>
      </Row>
    </Header>
  );
  }

  export default SiteHeader;
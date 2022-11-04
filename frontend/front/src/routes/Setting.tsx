import React, { useState } from 'react';
import './Setting.css';


import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { Breadcrumb, Row, Col, Layout } from 'antd';

import SideMenu from '../components/SideMenu';
const { Header, Content, Footer, Sider } = Layout;

export default function MainPage() {

    const [collapsed, setCollapsed] = useState(false);


    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="site-layout-background" style={{ padding: 0 }}>
                <Row>
                    <Col>
                        <Button className="Menu-Button" onClick={()=>setCollapsed((prev)=>!prev)} style={{ marginBottom: 16 }}>
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                    </Col>
                    <Col>
                        <div><h1 className="title">Web Page Storage</h1></div>
                    </Col>
                </Row>
            </Header>
            <Layout className="site-layout">
                <Sider collapsible collapsed={collapsed} trigger={null} onCollapse={value => setCollapsed(value)} collapsedWidth="0">
                    <SideMenu />
                </Sider>
                <Content style={{ margin: '0 16px' }}>
                    <h3>Something else...</h3>
                    <input type="text" className="somethingelse" />
                    <h3>Exclude keyword</h3>
                    <input type="text" className="exclusion" />
                </Content>
            </Layout>
        </Layout>
    );
}
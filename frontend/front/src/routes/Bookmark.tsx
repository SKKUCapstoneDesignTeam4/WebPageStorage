import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb,Button,Card, Layout, Row, Col,} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import SideMenu from '../components/SideMenu';
import './Bookmark.css';

const { Header, Content, Sider, } = Layout;


export default function Bookmark(){

    const [collapsed, setCollapsed] = useState(false);
    const cols_new = [];
    const colCount = 6;

    for (let i = 0; i < colCount; i++) {
      cols_new.push(
        <Col key={i.toString()} span={24 / colCount}>
          <div>
            <Card title="Card title" bordered={false} style={{ width: 350 }}>
                <p>New WebPage</p>
                <p>Will</p>
                <p>show</p>
            </Card>
          </div>
        </Col>,
      );
    }

    return(
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
                    <SideMenu/>
                </Sider>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item className='Category-title'>
                            Bookmark
                        </Breadcrumb.Item>
                        
                    </Breadcrumb>
                    <Row gutter={[0, 24]} style={{minHeight:520}}>
                        {cols_new}
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}
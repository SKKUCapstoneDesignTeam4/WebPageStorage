import React, { useState } from 'react';
import { Breadcrumb,Button,Card, Layout, Row, Col,} from 'antd';
import SideMenu from '../components/SideMenu';
import SiteHeader from '../components/SiteHeader';

const { Header, Content, Sider, } = Layout;


export default function Bookmark(){
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
            <SideMenu/>
            <Layout className="site-layout">
                <SiteHeader/>
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
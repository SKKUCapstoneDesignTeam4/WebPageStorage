import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Button, Card, Layout, Row, Col, message } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import SideMenu from '../components/SideMenu';
import './MainPage.css';

import axios from 'axios';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const { Header, Content, Sider, } = Layout;
const {Meta} = Card;
interface DataType {
    desc: string;
    id: string;
    isRead: string;
    ownerUserId: string;
    siteId: string;
    thumbnailUrl: string;
    time: string;
    title: string;
    url: string;
}

export default function MainPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [datas, setDatas] = useState<DataType[]>([]);


    const getPages = async () => {
        try {
            const response = await axios({
                url: "http://localhost:4000/api/pages",
                method: "get",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
            setDatas(response.data);
            console.log(datas);
        }
        catch (ex) {
            message.error("Can't get ages")
            return;
        }
    }


    getPages();

    
    const cols_new = [];
    for (let i = 0; i < datas.length; i++) {
        cols_new.push(
            <Col key={i.toString()}>
                <div>
                    <Card title={datas[i].title} hoverable style={{ width: 350 }} cover={<img alt="thumnail" src="http://localhost:4000/static_data/4/thumbnails/5.png"/>}>
                        <Meta title={datas[i].title} description={datas[i].url} />
                    </Card>
                </div>
            </Col>,
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="site-layout-background" style={{ padding: 0 }}>
                <Row>
                    <Col>
                        <Button className="Menu-Button" onClick={() => setCollapsed((prev) => !prev)} style={{ marginBottom: 16 }}>
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
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item className='Category-title'>
                            <Link to="/NewPages">
                                <span>New</span>
                            </Link>
                        </Breadcrumb.Item>

                    </Breadcrumb>
                    <Row gutter={[0, 24]} style={{ minHeight: 520 }}>
                        {cols_new}
                    </Row>

                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item className='Category-title'>
                            <Link to="/StoredPages">
                                <span>Bookmark</span>
                            </Link>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Row gutter={[0, 24]} style={{ minHeight: 520 }}>

                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}
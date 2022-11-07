import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Button, Card, Layout, Row, Col, } from 'antd';
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


export default function MainPage() {

    const [name, SetName] = React.useState("");
    const [address, SetAddress] = React.useState("");
    const [description, SetDescription] = React.useState("");
    const [css, SetCSS] = React.useState("");
    const [iserror, SetError] = React.useState(false);
    const [errorstring, SetErrorString] = React.useState("");

    const [thumbnailUrl, SetthumbnailUrl] = React.useState("");




    const [datas, setDatas] = useState<DataType[]>([]);

    function toggleError() {
        SetError(!iserror);
    }

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
            SetErrorString("Can't get sites");
            toggleError();
            return;
        }
    }


    getPages();


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


    const [collapsed, setCollapsed] = useState(false);
    const cols_new = [];
    const colCount = 6;
    for (let i = 0; i < colCount; i++) {
        cols_new.push(
            <Col key={i.toString()} span={24 / colCount}>
                <div>
                    <Card title="Card title" bordered={false} style={{ width: 350 }}>
                        <p>New webpage</p>
                        <p>{datas[1].id}</p>
                        <p>show</p>
                    </Card>
                </div>
            </Col>,
        );
    }

    const cols_Bookmark = [];
    for (let i = 0; i < colCount; i++) {
        cols_Bookmark.push(
            <Col key={i.toString()} span={24 / colCount}>
                <div>
                    <Card title="Card title" bordered={false} style={{ width: 350 }}>
                        <p>Bookmark</p>
                        <p>Will</p>
                        <p>Show</p>
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
                        {cols_Bookmark}
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}
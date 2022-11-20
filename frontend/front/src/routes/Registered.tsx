import React, { useState } from 'react';
import './Registered.css';
import axios from 'axios';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

import { Button, Breadcrumb, Input, Layout, Col, Row, Table, Typography, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import SideMenu from '../components/SideMenu';

import Cookies from "universal-cookie";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const cookies = new Cookies();


export default function Registered() {

    const [name, SetName] = React.useState("");
    const [address, SetAddress] = React.useState("");
    const [description, SetDescription] = React.useState("");
    const [css, SetCSS] = React.useState("");
    const [iserror, SetError] = React.useState(false);
    const [errorstring, SetErrorString] = React.useState("");

    const [collapsed, setCollapsed] = useState(false);


    const [datas, setDatas] = useState([]);

    function toggleError() {
        SetError(!iserror);
    }

    const getSites = async () => {
        try {
            const response = await axios({
                url: "http://localhost:4000/api/sites",
                method: "get",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
            setDatas(response.data);

        }
        catch (ex) {
            SetErrorString("Can't get sites");
            toggleError();
            return;
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await axios({
                url: `http://localhost:4000/api/site/${id}`,
                method: "delete",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
            getSites();

        }
        catch (ex) {
            SetErrorString("Can't remove sites");
            toggleError();
            return;
        }
    };

    const handleModify = async (id: string) => {
        try {
            const response = await axios({
                url: `http://localhost:4000/api/site/${id}`,
                method: "put",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
                data: {
                    title: name,
                    url: address,
                    crawlUrl: address,
                    cssSelector: css
                }
            });
            getSites();
        }
        catch (ex) {
            SetErrorString("Can't modify sites");
            toggleError();
            return;
        }
    };



    interface DataType {
        key: string;
        name: string;
        address: string;
        Description: string;
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'title',
            key: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'url',
            key: 'address',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'operation',
            dataIndex: 'id',
            render: (text) => (
                <Button onClick={() => handleDelete(text)}>delete</Button>
            )

        },
        {
            title: 'operation2',
            dataIndex: 'id',
            render: (text) => (
                <Button onClick={() => handleModify(text)}>modify</Button>
            )

        }
    ];


    const addSite = async () => {
        if (name === "") {
            SetErrorString("Please type name");
            toggleError();
            return;
        }
        if (address === "") {
            SetErrorString("Please type address");
            toggleError();
            return;
        }
        try {
            const response = await axios({
                url: "http://localhost:4000/api/site",
                method: "post",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
                data: {
                    title: name,
                    url: address,
                    crawlUrl: address,
                    cssSelector: css
                }
            });
            console.log(response.status)
            getSites()
        }
        catch (ex) {
            SetErrorString("Can't add site");
            toggleError();
            return;
        }
    }



    getSites()
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
                            Registered Sites
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Table columns={columns} dataSource={datas} />
                    <Row justify='center'>
                        <Col >
                            <Text strong>New Site</Text>
                        </Col>
                        <Col offset={1}>
                            <Input
                                id="Name"
                                placeholder="Name"
                                value={name}
                                onChange={({ target: { value } }) => SetName(value)}
                            />
                        </Col>
                        <Col>
                            <Input
                                id="Address"
                                placeholder="Address"
                                value={address}
                                onChange={({ target: { value } }) => SetAddress(value)}
                            />
                        </Col>
                        <Col>
                            <Input
                                id="Description"
                                placeholder="Description"
                                value={description}
                                onChange={({ target: { value } }) => SetDescription(value)}
                            />
                        </Col>
                        <Col>
                            <Input
                                id="CSS"
                                placeholder="CSS"
                                value={css}
                                onChange={({ target: { value } }) => SetCSS(value)}
                            />
                        </Col>
                        <Col>
                            <Button onClick={addSite}>Add</Button>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}
import React, { useState } from 'react';
import './Registered.css';
import axios from 'axios'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

import {Button, Breadcrumb, Input, Layout, Col, Row, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import SideMenu from '../components/SideMenu';
import ErrorMessage from '../components/ErrorMessage';

import Cookies from "universal-cookie";

const { Header, Content, Sider } = Layout;
const {Text } = Typography;

interface DataType {
    key: string;
    name: string;
    address: string;
    Description: string;
}

const columns: ColumnsType<DataType> = [
{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
},
{
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
},
{
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
},
];

const cookies = new Cookies();


export default function Registered() {

    const [name, SetName] = React.useState("");
    const [address, SetAddress] = React.useState("");
    const [description, SetDescription] = React.useState("");
    const [css, SetCSS] = React.useState("");
    const [iserror, SetError]= React.useState(false);
    const [errorstring, SetErrorString]= React.useState("");

    const [collapsed, setCollapsed] = useState(false);

    const [datas, setData] = useState([]);



    function toggleError(){
        SetError(!iserror);
    }

    const addSite = async () => {
        if (name===""){
            SetErrorString("Please type name");
            toggleError();
            return;
        }
        if (address===""){
            SetErrorString("Please type address");
            toggleError();
            return;
        }

        try {
            const response = await axios({
                url: "http://localhost:4000/api/site",
                method: "post",
                headers: {
                    "x-access-token" : cookies.get('access_token')
                },
                data: {
                    title: name,
                    url: address,
                    crawlUrl: address,
                    cssSelector: css
                }
            });
            if(response.status === 200){
                console.log(response.status)
            }
        }
        catch(ex){
            SetErrorString("Can't add site");
            toggleError();
            return;
        }
    }

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
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item className='Category-title'>
                            Registered Sites
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Table columns={columns} dataSource={datas}/>
                    <Row justify='center'>
                        <Col >
                            <Text strong>New Site</Text> 
                        </Col>
                        <Col offset={1}>
                            <Input
                                id="Name"
                                placeholder="Name"
                                value={name} 
                                onChange={({ target: {value} }) => SetName(value)} 
                            />
                        </Col>
                        <Col>
                            <Input
                                id="Address"
                                placeholder="Address"
                                value={address} 
                                onChange={({ target: {value} }) => SetAddress(value)} 
                            />
                        </Col>
                        <Col>
                            <Input
                                id="Description"
                                placeholder="Description"
                                value={description} 
                                onChange={({ target: {value} }) => SetDescription(value)} 
                            />
                        </Col>
                        <Col>
                            <Input
                                id="CSS"
                                placeholder="CSS"
                                value={css} 
                                onChange={({ target: {value} }) => SetCSS(value)} 
                            />
                        </Col>
                        <Col>
                            <Button onClick={addSite}>Add</Button>
                            {iserror ? <ErrorMessage title="Registration Error" message={errorstring} func={toggleError}/> : ""}
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}
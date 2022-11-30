import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { Button, Input,Typography, message, Modal, Space, Layout, Card, Form, Divider } from 'antd';
import './Login.css';

import axios from 'axios'
import Cookies from "universal-cookie";

export const cookies = new Cookies();

const {Title}=Typography;


/**
 * Login area
 * @returns Render to login
 */


export function Login(){
    const navigate = useNavigate();
    
    const [isResister, setResister]=useState(false);

    const onFinish = async (values: any) => {
        try{
            const response = await axios({
                url: "api/auth",
                method: "post",
                data: {
                    id: values['username'], password: values['password']
                }
            });
            if(response.status === 200){
                const token = response.data.token;
                cookies.set('access_token', token, {sameSite: 'strict'});
                navigate('/StoredPages');
            }
            } catch(ex){
                message.error('Wrong ID or PW');
        }
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onResisterFinish = async (values: any) => {
        if (values["password"]!==values["confirmpassword"]){
            message.error('Please check PW');
            return;
        }
        try {
            const response = await axios({
                url: "api/register",
                method: "post",
                data: {
                    id: values["username"], password: values["password"]
                }
            });
            setResister(false);
        }
        catch(ex){
            message.error('Can not resister');
            return;
        }
    };

    const showModal = () => {
        setResister(true);
    };
    
    const handleCancel = () => {
        setResister(false);
    };

    return(
        <Layout style={{ minHeight: '100vh', alignItems:'center', justifyContent:'center', backgroundColor:"white"}}>
            <Space direction='horizontal'>
                <Space direction='vertical' style={{"marginRight":200}}>
                    <Title style={{"color": 'rgb(0,21,41)'}}>Crowler</Title>
                    <Title level={4} style={{"color": 'rgb(0,21,41)'}}>Gather the interesting pages in one place!</Title>
                </Space>
                <Space>
                    <Card style={{ width: 400, borderColor:"black"}} bordered={true}>
                        <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button  type="primary" block htmlType="submit" style={{"width":"100%" , backgroundColor:'rgb(0,21,41)', borderColor:'rgb(0,21,41)'}}>
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                        <Divider />
                        Don't you have an account?
                        <Button type="link" onClick={showModal}>Resister</Button>
                        <Modal title="User Registration" open={isResister} footer={null} onCancel={handleCancel}>
                            <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onResisterFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            >
                                <Form.Item
                                    label="Username"
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item
                                    label="Confirm Password"
                                    name="confirmpassword"
                                    rules={[{ required: true, message: 'Please input your password again!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button  type="primary" block htmlType="submit" style={{"width":"100%" , backgroundColor:'rgb(0,21,41)', borderColor:'rgb(0,21,41)'}}>
                                        Resister
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Card>
                </Space>
            </Space>
        </Layout> 
    );

    /*
    return(
        
        <Row>
            <Col flex={3}>
                <div className="Title-area">
                        <Title>Crowler</Title>
                </div>
            </Col>
            <Col flex={1}>
                <div className="Login-area">
                    <Row align='middle' justify='center'>
                        <Col>
                            <Input
                                id="id"
                                placeholder="ID"
                                value={id} 
                                onChange={({ target: { value } }) => SetId(value)} 
                            />
                        </Col>
                    </Row>

                    <Row align='middle' justify='center'>
                        <Col>
                            <Input.Password
                                id="password"
                                placeholder="Password"
                                value={password} 
                                onChange={({ target: { value } }) => SetPassword(value)} 
                            /> 
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            <Button type='primary' onClick={login}>Login</Button>
                        </Col> 
                    
                        <Col span={4} offset={8}>
                            <Button type='primary' onClick={showModal}>Resister</Button>
                            <Modal title="User Resister" open={isResister} onOk={handleOk} onCancel={handleCancel}>
                                <Row align='middle' justify='center' >
                                    <Col>
                                        <Input
                                            id="id"
                                            placeholder="ID"
                                            value={res_id} 
                                            onChange={({ target: { value } }) => SetResId(value)} 
                                        />
                                    </Col>
                                </Row>
                                <Row align='middle' justify='center'>
                                    <Col>
                                        <Input.Password
                                            id="password"
                                            placeholder="Password"
                                            value={res_password} 
                                            onChange={({ target: { value } }) => SetResPassword(value)} 
                                        /> 
                                    </Col>
                                </Row>
                                <Row align='middle' justify='center'>
                                    <Col>
                                        <Input.Password
                                            id="password_confirm"
                                            placeholder="Password Confirm"
                                            value={password_confirm} 
                                            onChange={({ target: { value } }) => SetPasswordConfirm(value)} 
                                        /> 
                                    </Col>
                                </Row>
                            </Modal>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
    */
}

export default Login;
import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Input, Col, Row, Typography, message, Modal} from 'antd';
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
    const [id, SetId] = React.useState("");
    const [password, SetPassword] = React.useState("");
    
    const navigate = useNavigate();
    
    const [isResister, setResister]=useState(false);
    const [res_id, SetResId] = React.useState("");
    const [res_password, SetResPassword] = React.useState("");
    const [password_confirm, SetPasswordConfirm] = React.useState("");


    const register = async () => {
        if (res_id===""){
            message.error('Please type ID');
            return;
        }
        if (res_password===""){
            message.error('Please type PW');
            return;
        }
        if (res_password!==password_confirm){
            message.error('Please check PW');
            return;
        }
        try {
            const response = await axios({
                url: "api/register",
                method: "post",
                data: {
                    id: res_id, password: res_password
                }
            });
        }
        catch(ex){
            message.error('Can not resister');
            return;
        }
    }

    const showModal = () => {
        setResister(true);
    };
    
    const handleOk = () => {
        register();
        setResister(false);
    };
    
    const handleCancel = () => {
        setResister(false);
    };

    const login = async () => {
        
        try{
        const response = await axios({
            url: "api/auth",
            method: "post",
            data: {
                id: id, password: password
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
        //token있을시 token저장
    }
    
    return(
        <Row>
            <Col flex={3}>
                <div className="Title-area">
                        <Title>Web Pages Storage</Title>
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
}

export default Login;
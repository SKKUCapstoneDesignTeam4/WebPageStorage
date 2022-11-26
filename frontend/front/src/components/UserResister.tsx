import React, { useState } from 'react';
import { Button, Input, Col, Row, Typography, message, Modal } from 'antd';

import axios from 'axios'
import './design/UserResister.css'

const { Title, Text } = Typography;

export function UserResister() {

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

    return (
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
      )
} 

export default UserResister;
import React, { useState } from 'react';
import { Button, Input, Col, Row, Typography, message } from 'antd';

import axios from 'axios'
import './design/UserResister.css'

const { Title, Text } = Typography;

export function UserResister() {

    const [id, SetId] = React.useState("");
    const [password, SetPassword] = React.useState("");
    const [password_confirm, SetPasswordConfirm] = React.useState("");


    const register = async () => {
        if (id===""){
            message.error('Please type ID');
            return;
        }
        if (password===""){
            message.error('Please type PW');
            return;
        }
        if (password!==password_confirm){
            message.error('Please check PW');
            return;
        }
        try {
            const response = await axios({
                url: "api/register",
                method: "post",
                data: {
                    id: id, password: password
                }
            });
        }
        catch(ex){
            message.error('Can not resister');
            return;
        }
    }

    return (
        <>
            <Row align='middle' justify='center' >
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
            <Row align='bottom' justify='end'>                  
                <Col span={2} offset={16}>
                    <Button size='small' onClick={register}>Resister</Button>
                </Col>
            </Row>            
        </>
      )
} 

export default UserResister;
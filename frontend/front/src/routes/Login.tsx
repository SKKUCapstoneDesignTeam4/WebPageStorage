import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Input, Col, Row, Typography} from 'antd';
import './Login.css';

import axios from 'axios'
import Cookies from "universal-cookie";


import ErrorMessage from '../components/ErrorMessage';
import UserResister from '../components/UserResister';

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
    
    const [isLoginError, setLoginError]=useState(false);
    const [isResister, setResister]=useState(false);

    const  toggleError = () => {
        setLoginError(!isLoginError);
    }

    const  toggleResister = () => {
        setResister(!isResister);
    }

    const login = async () => {
        
        try{
        const response = await axios({
            url: "http://localhost:4000/api/auth",
            method: "post",
            data: {
                id: id, password: password
            }
        });
        if(response.status === 200){
            const token = response.data.token;
            cookies.set('access_token', token, {sameSite: 'strict'});
            navigate('/Main');
        }
        } catch(ex){
            toggleError();
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
                            {isLoginError ? <ErrorMessage title="Login Error" message="Incorrect username or password" func={toggleError}/> : ""}
                        </Col> 
                    
                        <Col span={4} offset={8}>
                            <Button type='primary' onClick={toggleResister}>Resister</Button>
                            {isResister ? <UserResister func={toggleResister}/> : ""}
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
}

export default Login;
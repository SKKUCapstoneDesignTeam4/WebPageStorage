import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, Input, Col, Row, Typography } from 'antd';

import axios from 'axios'
import './design/UserResister.css'
import ErrorMessage from './ErrorMessage';

const { Title, Text } = Typography;
type ResisterProps ={
    func(): void;
}

export function UserResister({func}:ResisterProps) {

    const [id, SetId] = React.useState("");
    const [password, SetPassword] = React.useState("");
    const [password_confirm, SetPasswordConfirm] = React.useState("");
    const [iserror, SetIsError] = React.useState(false);
    const [errString, SetString] =React.useState("");

    const  toggleError = () => {
        SetIsError(!iserror);
    }

    const register = async () => {
        if (id===""){
            SetString("Please type ID");
            toggleError();
            return;
        }else if (password!==password_confirm){
            SetString("Please confirm password correctly");
            toggleError();
            return;
        }
        try {
            const response = await axios({
                url: "http://localhost:4000/api/register",
                method: "post",
                data: {
                    id: id, password: password
                }
            });
            if(response.status == 200){
                func();
            }
        }
        catch(ex){
            SetString("ID is already used");
            toggleError();
            return;
        }
    }

    return (
        <>
          <Modal className='UserResister' isOpen={true}
          ariaHideApp={false}>
                    <Row align='middle' justify='center'>
                            <Col >
                                <Title level={2}>Create Account</Title>
                            </Col>
                    </Row>
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
                            {iserror ? <ErrorMessage title="Registration Error" message={errString} func={toggleError}/> : ""}
                        </Col>
                    </Row>
                    
          </Modal>
        </>
      )
} 

export default UserResister;
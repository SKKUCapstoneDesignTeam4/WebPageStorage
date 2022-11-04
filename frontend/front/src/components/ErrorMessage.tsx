import { useState } from 'react';
import Modal from 'react-modal';
import { Button, Col, Row, Typography } from 'antd';

import './design/ErrorMessage.css'
const { Title, Text } = Typography;

type MessageProps ={
    title: string;
    message: string;
    func(): void;
}

export function ErrorMessage({title, message, func} : MessageProps) {
    const [modalOpen, setModalOpen] = useState(true);

    function close(){
        setModalOpen(false);
        func();
    }


    return (
        <>
        <Modal className='ErrorMessage' isOpen={modalOpen}>
            
                <Row>
                    <Col>
                        <Title level={3}>{title}</Title>
                    </Col>
                </Row>
                <Row >
                    <Col>
                        <Text strong>{message}</Text>
                    </Col>
                </Row>
                <Row >
                    <Col>
                        <Button size="small" onClick={close}>Close</Button>
                    </Col>
                </Row>
        </Modal>
        </>
    )
} 

export default ErrorMessage;
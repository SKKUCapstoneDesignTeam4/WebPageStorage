import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment'
import { Breadcrumb, Button, Card, Layout, Row, Col, message, Tag } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import SideMenu from '../components/SideMenu';
import './StoredPages.css';

import axios from 'axios';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const { Header, Content, Sider, } = Layout;
const {Meta} = Card;
interface DataType {
    desc: string;
    id: string;
    isRead: number;
    ownerUserId: string;
    siteId: string;
    thumbnailUrl: string;
    time: string;
    title: string;
    url: string;
}

const PAGE_BLOCK_SIZE = 5;


export default function StoredPages() {
    const [collapsed, setCollapsed] = useState(false);
    const [datas, setDatas] = useState<DataType[]>([]);
    //const datas = useRef<DataType[]>();
    const countPageLoaded = useRef(PAGE_BLOCK_SIZE);


    const [bottom, setBottom] = useState<HTMLDivElement | null>(null);
    const bottomObserver = useRef<IntersectionObserver>();

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting){
                    console.log(countPageLoaded.current);
                    countPageLoaded.current +=  PAGE_BLOCK_SIZE;
                    getPages(countPageLoaded.current);
                }
            },
            { threshold: 0.25, rootMargin: '80px' }
        );
        bottomObserver.current = observer;
    }, []);

    useEffect(() => {
        const observer = bottomObserver.current;
        if(observer == undefined)
            return;
        if(bottom){
            observer.observe(bottom);
            return () => {
                if(bottom) {
                    observer.unobserve(bottom);
                }
            };
        }
    },[bottom]);

    const getPages = async (count : number) => {
        try {
            const response = await axios({
                url: "api/pages",
                method: "get",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
                params : {
                    count: count,
                }
            });

            setDatas(response.data);
        }
        catch (ex) {
            message.error("Can't get pages")
            return;
        }
    }

    useEffect(() => {
        getPages(PAGE_BLOCK_SIZE);
    },[]);


    const deletePage = async (id:string) => {
        try {
            const response = await axios({
                url: `api/page/${id}`,
                method: "delete",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
            getPages(PAGE_BLOCK_SIZE);
        }
        catch (ex) {
            message.error("Can't delete page")
            return;
        }
    }

    const openPage = async (id:string, url:string) => {
        window.open(url);
        
        try {
            const response = await axios({
                url: `api/page/read/${id}`,
                method: "put",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
        }
        catch (ex) {
            message.error("Can't read page")
            return;
        }
    }

    const cols_new = [];
    var yesterday = moment().subtract(1,'days').format('YYYY-MM-DD');
    for (let i = 0; i < datas.length; i++) {
        cols_new.push(
            <div key={i.toString()}>
                <Row>
                    <Col offset={18}>
                        <Button type='default'>★</Button>
                    </Col>
                    <Col>
                        <Button type='default' onClick={()=>deletePage(datas[i].id)}>X</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <Card title={datas[i].title} 
                            hoverable 
                            cover={ datas[i].thumbnailUrl === "" ? <img alt="thumnail" src={axios.defaults.baseURL + datas[i].thumbnailUrl}/> : ""} 
                            style={ datas[i].isRead===0 ? {borderColor: "red", width: 350 } : {width: 350}} 
                            onClick={()=>openPage(datas[i].id, datas[i].url)}
                            extra={moment(datas[i].time).isAfter(yesterday) ? <Tag color="red">New!</Tag> : ""}>
                                <Meta description={datas[i].url}></Meta> 
                            </Card>
                        </div>
                    </Col>,
                </Row>
            </div>
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
                                <span>New</span>
                        </Breadcrumb.Item>

                    </Breadcrumb>
                    <Row gutter={[0, 24]} style={{ minHeight: 520 }}>
                        {cols_new}
                    </Row>
                </Content>
            </Layout>
            <div ref={setBottom} />

        </Layout>
    );
}
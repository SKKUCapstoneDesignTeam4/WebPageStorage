import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment'
import { Breadcrumb, Button, Card, Layout, Row, Col, message, Tag, Typography } from 'antd';

import SideMenu from '../components/SideMenu';
import SideHeader from '../components/SiteHeader';


import axios from 'axios';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const { Title } = Typography;
const { Header, Content, } = Layout;
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

const PAGE_BLOCK_SIZE = 10;


export default function StoredPages() {
    const [collapsed, setCollapsed] = useState(false);
    const [datas, setDatas] = useState<DataType[]>([]);
    //const datas = useRef<DataType[]>();
    const countPageLoaded = useRef(0);


    const [bottom, setBottom] = useState<HTMLDivElement | null>(null);
    const bottomObserver = useRef<IntersectionObserver>();

    const isPageLoading = useRef<boolean>(false);

    useEffect(()=>{

        getPages(PAGE_BLOCK_SIZE);
    },[])

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (!isPageLoading.current && entries[0].isIntersecting){
                    isPageLoading.current = true;
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
        finally{
            isPageLoading.current = false;
        }
    }


    
    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleScroll); //clean up
        };
    }, []);
    
    const handleScroll = () => {
        // 스크롤바가 없을 시 휠을 하면 새 페이지 생성
        if(!isPageLoading.current && document.body.scrollHeight == document.body.clientHeight)
        {
            isPageLoading.current = true;
            countPageLoaded.current +=  PAGE_BLOCK_SIZE;
            getPages(countPageLoaded.current);
        }
    };

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

    const openPage = async (event: React.MouseEvent<HTMLElement>, id:string, url:string) => {
        window.open(url);
        event.currentTarget.style.borderColor = "white";
        // event.target
        try {
            const response = await axios({
                url: `api/page/read/${id}`,
                method: "put",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            }).then(()=>{
                console.log(document.getElementById(id));
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
                            cover={ datas[i].thumbnailUrl === "" ? "" : <img alt="thumnail" src={axios.defaults.baseURL + datas[i].thumbnailUrl}/> } 
                            style={ datas[i].isRead===0 ? {borderColor: "red", width: 350 } : {width: 350}} 
                            onClick={(event: React.MouseEvent<HTMLElement>)=>openPage(event, datas[i].id, datas[i].url)}
                            extra={moment(datas[i].time).isAfter(yesterday) ? <Tag color="red">New🚀</Tag> : ""}>
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
            <SideMenu/>
            <Layout className="site-layout">
                <SideHeader/>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item className='Category-title'>
                                <span>Stored Pages</span>
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

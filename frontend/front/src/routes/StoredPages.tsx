import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment'
import { Badge, Breadcrumb, Card, Layout, Space, message, Popconfirm } from 'antd';
import {
    StarOutlined,
    StarFilled,
    DeleteOutlined
} from '@ant-design/icons';
import SideMenu from '../components/SideMenu';
import SideHeader from '../components/SiteHeader';

import './StoredPages.css';

import axios from 'axios';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const {Content, } = Layout;
const {Meta} = Card;
interface DataType {
    desc: string;
    id: string;
    isRead: number;
    isBookmarked: number;
    ownerUserId: string;
    siteId: string;
    thumbnailUrl: string;
    time: string;
    title: string;
    url: string;
    isUpdated: number;
    isDeleted: number;
}

const PAGE_BLOCK_SIZE = 10;


export default function StoredPages() {
    const [datas, setDatas] = useState<DataType[]>([]);
    //const datas = useRef<DataType[]>();
    const countPageLoaded = useRef(0);
    const contentHeight = useRef<HTMLElement>(null);

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
        if(observer === undefined)
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
    });
    
    const handleScroll = () => {
        // ??????????????? ?????? ??? ?????? ?????? ??? ????????? ??????
        const { scrollTop } = document.documentElement
        const offsetHeight = contentHeight.current!.offsetHeight;
        if(!isPageLoading.current && window.innerHeight + scrollTop + 500 >= offsetHeight)
        {
            isPageLoading.current = true;
            countPageLoaded.current +=  PAGE_BLOCK_SIZE;
            getPages(countPageLoaded.current);
        }
    };

    const deletePage = async (id:string) => {
        try {
            await axios({
                url: `api/page/${id}`,
                method: "delete",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
            getPages(countPageLoaded.current);
        }
        catch (ex) {
            message.error("Can't delete page")
            return;
        }
    }

    const bookmarkPage = async (id:string) => {
        try {
            await axios({
                url: `api/page/bookmark/${id}`,
                method: "put",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
            getPages(countPageLoaded.current);
        }
        catch (ex) {
            message.error("Can't delete page")
            return;
        }
    }

    const removeBookmarkOnPage = async (id:string) => {
        try {
            await axios({
                url: `api/page/bookmark/${id}`,
                method: "delete",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
            getPages(countPageLoaded.current);
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
            await axios({
                url: `api/page/read/${id}`,
                method: "put",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });

            getPages(countPageLoaded.current);
        }
        catch (ex) {
            message.error("Can't read page")
            return;
        }
    }

    const cols_new = [];
    var yesterday = moment().subtract(1,'days').format('YYYY-MM-DD');
    for (let i = 0; i < datas.length; i++) {
        const card = (<div key={i.toString()}>
            <Card  
                hoverable
                cover={ datas[i].thumbnailUrl === "" ? "" : <img alt="thumnail" src={axios.defaults.baseURL + datas[i].thumbnailUrl}/> }
                actions={[
                    (datas[i].isBookmarked 
                        ? <StarFilled style={ {color:"#fadb14"}} onClick={()=>removeBookmarkOnPage(datas[i].id)} />  
                        : <StarOutlined onClick={()=>bookmarkPage(datas[i].id)} /> ),

                    <Popconfirm
                        title="Are you sure to delete this page?"
                        onConfirm={()=>deletePage(datas[i].id)}>
                        <DeleteOutlined /* onClick={()=>deletePage(datas[i].id)} */ />
                    </Popconfirm>
                ]}
                
                style={ {width: 250} }
                className={ datas[i].isRead === 0 ? "isUnRead" : undefined }
                onClick={
                    (event: React.MouseEvent<HTMLElement>)=>{
                        // Open page except clicking action buttons (star, delete) and popover
                        if((event.target as Element).closest(".ant-card-actions") === null && 
                            (event.target as Element).closest(".ant-popover") === null) {
                            openPage(event, datas[i].id, datas[i].url)
                        }
                    }
                }>

                <Meta title={datas[i].title} description={datas[i].url}></Meta>
            </Card>
        </div>);

        let cardWithBadge: JSX.Element;
        if(datas[i].isDeleted === 1) {
            cardWithBadge = (
                <Badge.Ribbon text="Deleted" color="red">
                    {card}
                </Badge.Ribbon>
            );
        } else if(moment(datas[i].time).isAfter(yesterday)) {
            cardWithBadge = (
                <Badge.Ribbon text="New" color="volcano">
                    {card}
                </Badge.Ribbon>
            );
        } else if(datas[i].isUpdated === 1) {
            cardWithBadge = (
                <Badge.Ribbon text="Updated">
                    {card}
                </Badge.Ribbon>
            );
        } else {
            cardWithBadge = card;
        }
        
        cols_new.push(cardWithBadge);
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideMenu/>
            <Layout className="site-layout">
                <SideHeader/>
                <Content ref={contentHeight} style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item className='Category-title'>
                                <span>Stored Pages</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Space size={[10,18]} wrap align="start">
                        {cols_new}
                    </Space>
                </Content>
            </Layout>
            <div ref={setBottom} />
        </Layout>
    );
}

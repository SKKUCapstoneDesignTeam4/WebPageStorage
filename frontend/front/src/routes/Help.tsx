import React, { useState, useEffect, useRef } from 'react';
import { Badge, Breadcrumb, Layout, Space, } from 'antd';

import SideMenu from '../components/SideMenu';
import SideHeader from '../components/SiteHeader';

import './Help.css';

import ReactMarkdown from 'react-markdown';
import { Header } from 'antd/lib/layout/layout';

const {Content, } = Layout;

const markdown = require("../markdown/help.md");



export default function Help() {
    const [content, setContent]=useState("");

    fetch(markdown).then((response) => response.text()).then((text) => {
        setContent(text)
    });
    
    function flatten(text : any, child : any) : any {
        return typeof child === 'string'
          ? text + child
          : React.Children.toArray(child.props.children).reduce(flatten, text)
      }
      
    function HeadingRenderer(props : any) {
        var children = React.Children.toArray(props.children)
        var text = children.reduce(flatten, '')
        var slug = text.toLowerCase().replace(/\W/g, '-')
        return React.createElement('h' + props.level, {id: slug}, props.children)
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideMenu/>
            <Layout className="site-layout">
                <SideHeader/>
                <Content  style={{ margin: '30px 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item className='Category-title'>
                                <span>Help</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Space size={[10,18]} wrap align="start">
                        <ReactMarkdown 
                            components={{h2: HeadingRenderer}}
                            children={content}/>
                    </Space>
                </Content>
            </Layout>
        </Layout>
    );
}

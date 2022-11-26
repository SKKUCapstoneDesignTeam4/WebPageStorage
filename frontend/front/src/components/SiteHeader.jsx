import React from 'react';
import {Layout, Typography } from 'antd';

import './design/SiteHeader.css';


const { Title } = Typography;
const { Header} = Layout;


export function SiteHeader(){
    return(
      <Header className="site-layout-background" style={{ padding: 0 }}>
          <Title level={2} className="site-title">Web Page Storage</Title>
      </Header>
    );
  }

  export default SiteHeader;
import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {
  HddFilled,
  StarFilled,
  ToolFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import {Layout, Menu } from 'antd';
const {Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];


function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export function SideMenu(){
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  const items: MenuItem[] = [
    getItem('Stored Pages', '1', <HddFilled />),
    getItem('Bookmark', '2', <StarFilled />),
    getItem('Register', '3', <ToolFilled />),
    getItem('Help', '4', <QuestionCircleOutlined />)
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key==='1'){
      navigate('/StoredPages');
    }
    else if (e.key === '2'){
      navigate('/Bookmark');
    }else if (e.key === '3'){
      navigate('/Registered');
    }else if (e.key == '4'){
      navigate('/Help');
    }
  };

  return(
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <Menu theme="dark" mode="inline" items={items} onClick={onClick}/>
    </Sider>
  );
}

export default SideMenu;
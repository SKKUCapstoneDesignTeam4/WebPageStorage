import { Menu,} from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import Bookmark from '../routes/Bookmark';


export function SideMenu(){
    return(
        <Menu
                mode="inline"
                theme="dark"
                >
                <Menu.Item key="1">
                  <Link to="/StoredPages">
                    <span>Stored Pages</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/Bookmark">
                    <span>Bookmark</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/Registered">
                    <span>Registerd Sites</span>
                  </Link>
                </Menu.Item>
        </Menu>
    );
}

export default SideMenu;
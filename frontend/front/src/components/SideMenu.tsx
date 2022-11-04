import { Menu,} from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';


export function SideMenu(){
    return(
        <Menu
                mode="inline"
                theme="dark"
                >
                <Menu.Item key="1">
                  <Link to="/Main">
                    <span>Main</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/NewPages">
                    <span>New Pages</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/StoredPages">
                    <span>Stored Pages</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/Registered">
                    <span>Registerd Sites</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link to="/Setting">
                    <span>Settings</span>
                  </Link>
                </Menu.Item>
        </Menu>
    );
}

export default SideMenu;
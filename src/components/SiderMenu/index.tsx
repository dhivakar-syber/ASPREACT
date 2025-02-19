import './index.less';

import { useEffect } from 'react';
import * as React from 'react';

import { Avatar, Col, Layout, Menu } from 'antd';
import { L, isGranted } from '../../lib/abpUtility';

import AbpLogo from '../../images/Payretronewlogo.png';
import { appRouters } from '../../components/Router/router.config';
import utils from '../../utils/utils';

const { Sider } = Layout;

export interface ISiderMenuProps {
  path: any;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void; 
  history: any;
}

const SiderMenu = (props: ISiderMenuProps) => {
  const { collapsed, history, onCollapse } = props;
  const currentRoute = utils.getRoute(history.location.pathname);

  // Expand sidebar on menu item click
  const handleMenuItemClick = (path: string) => {
    history.push(path);
    if (collapsed) {
      onCollapse(false); 
    }
  };

  useEffect(() => {

    if (!collapsed) {
      onCollapse(true); 
    }
  }, []);
  return (
    <Sider
      trigger={null}
      className={'sidebar'}
      width={256}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
     
      {collapsed ? (
        <Col style={{ textAlign: 'center', marginTop: 26, marginBottom: 10 }}>
          <Avatar shape="square" style={{ height: 27, width: 64,paddingBottom:10 }} src={AbpLogo} />
        </Col>
      ) : (
        <Col style={{ textAlign: 'center', marginTop: 14, marginBottom: 10 }}>
          <Avatar shape="square" style={{ height: 40, width: 160 }} src={AbpLogo} />
        </Col>
      )}  <div className=""></div>

      <Menu theme="dark" style={{fontSize: '12px'}} mode="inline" selectedKeys={[currentRoute ? currentRoute.path : '']}>
        {appRouters
          .filter((item: any) => !item.isLayout && item.showInMenu)
          .map((route: any, index: number) => {
            if (route.permission && !isGranted(route.permission)) return null;

            return (
              <Menu.Item
                key={route.path}
                onClick={() => handleMenuItemClick(route.path)} // Handle item click
              >
                <route.icon />
                <span>{L(route.title)}</span>
              </Menu.Item>
            );
          })}
      </Menu>
    </Sider>
  );
};

export default SiderMenu;

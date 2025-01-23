import './index.less';

import * as React from 'react';

import { Avatar, Badge, Col, Dropdown, Menu, Row } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import payretrolog from '../../images/Payretro.png'

import { L } from '../../lib/abpUtility';
// import LanguageSelect from '../LanguageSelect';
import { Link } from 'react-router-dom';

import profilePicture from '../../images/user.png';
import SessionStore from '../../stores/sessionStore';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';

//declare var abp: any;
export interface IHeaderProps {
  sessionStore?: SessionStore;
  collapsed?: any;
  toggle?: any;
}

const userDropdownMenu = (
  <Menu>
    <Menu.Item key="2">
      <Link to="/logout">
        <LogoutOutlined />
        <span> {L('Logout')}</span>
      </Link>
    </Menu.Item>
  </Menu>
);

@inject(Stores.SessionStore)
@observer
export class Header extends React.Component<IHeaderProps> {
  render() {
    const { sessionStore } = this.props;
    const userName =
      sessionStore?.currentLogin?.user?.userName || L('Guest');
    return (  
      <Row className={'header-container'}>
        <Col style={{ textAlign: 'left' }} span={12}>
          {/* {this.props.collapsed ? (
            <MenuUnfoldOutlined className="trigger" onClick={this.props.toggle} />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={this.props.toggle} />
          )} */}
          <img style={{ width: '75px', margin: '10px'}} src={payretrolog}></img>
        </Col>
        <Col style={{ padding: '0px 15px 0px 15px', textAlign: 'right' }} span={12}>
          {/* <LanguageSelect /> {'   '} */}
          {/* {this.props.sessionStore!.currentLogin.user!.name!} */}
          <span style={{ marginRight: 10 }}>Welcome</span><span style={{ marginRight: 10 }}>{userName}</span>
          <Dropdown overlay={userDropdownMenu} trigger={['click']}>
            <Badge style={{}} >
              <Avatar style={{ height: 24, width: 24 }} shape="circle" alt={'profile'} src={profilePicture} />
            </Badge>
          </Dropdown>
        </Col>
      </Row>
    );
  }
}

export default Header;

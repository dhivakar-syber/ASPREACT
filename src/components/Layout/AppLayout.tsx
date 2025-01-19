import './AppLayout.less';

import * as React from 'react';

import { Redirect, Switch, Route } from 'react-router-dom';

import DocumentTitle from 'react-document-title';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Layout } from 'antd';
import ProtectedRoute from '../../components/Router/ProtectedRoute';
import SiderMenu from '../../components/SiderMenu';
import { appRouters } from '../Router/router.config';
import utils from '../../utils/utils';
import NotFoundRoute from '../Router/NotFoundRoute';

const { Content } = Layout;

class AppLayout extends React.Component<any> {
  state = {
    collapsed: true, 
    hovering: false, 
  };

  
  onHoverStart = () => {
    this.setState({ collapsed: false, hovering: true });
  };

  onHoverEnd = () => {
    this.setState({ collapsed: true, hovering: false });
  };

  onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
  };

  render() {
    const {
      history,
      location: { pathname },
    } = this.props;

    const { path } = this.props.match;
    const { collapsed } = this.state;

    const layout = (
      <Layout style={{ minHeight: '100vh' }}>
        <div
          onMouseEnter={this.onHoverStart}
          onMouseLeave={this.onHoverEnd}
          style={{
            transition: 'width 0.2s ease', 
          }}
        >
          <SiderMenu path={path} onCollapse={this.onCollapse} history={history} collapsed={collapsed} />
        </div>
        <Layout>
          <Layout.Header style={{ background: '#fff', minHeight: 52, padding: 0 }}>
            <Header collapsed={collapsed}  />
          </Layout.Header>
          <Content style={{ margin: 6 }}>
            <Switch>
              {pathname === '/' && <Redirect from="/" to="/dashboard" />}
              {appRouters
                .filter((item: any) => !item.isLayout)
                .map((route: any, index: any) => (
                  <Route
                    exact
                    key={index}
                    path={route.path}
                    render={(props) => <ProtectedRoute component={route.component} permission={route.permission} />}
                  />
                ))}
              {pathname !== '/' && <NotFoundRoute />}
            </Switch>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;
  }
}

export default AppLayout;

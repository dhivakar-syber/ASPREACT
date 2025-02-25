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
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import sessionService from '../../services/session/sessionService';

const { Content } = Layout;

export interface ILoginProps {
  sessionStore?: SessionStore;
  history: any;
  location: any;
  match:any;
}

@inject(Stores.SessionStore)
@observer
class AppLayout extends React.Component<ILoginProps> {
  state = {
    collapsed: true, 
    hovering: false, 
    hasRole:false
  };

  componentDidMount() {
    this.updateStateBasedOnRoles();
  }

  componentDidUpdate(prevProps: ILoginProps) {
    if (prevProps.sessionStore !== this.props.sessionStore) {
      this.updateStateBasedOnRoles();
    }
  }

  updateStateBasedOnRoles = async () => {
    try {
      const currentLoginInfo = await sessionService.getCurrentLoginInformations();
      //console.log('User', currentLoginInfo);
  
      const permissions: string[] = currentLoginInfo?.user?.roles || [];
      //console.log('permissions', permissions);
  
      const requiredRoles = ["admin", "PayRetroAdmin", "Admin", "payretroadmin"];
      const hasRole = permissions.some((role: string) => requiredRoles.includes(role));
  
      //console.log('HasRole:', hasRole);
  
      // Update the state based on the presence of the required role
      this.setState({ hasRole }, () => {
        // Callback function executed after state update and re-render
        //console.log('State has been updated:', this.state.hasRole);
      });
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      // Handle the error appropriately
    }
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

    const roles = this.props.sessionStore?.currentLogin?.user?.roles;
    // const requiredroles = ["admin","Admin","PayRetroAdmin"]
    //console.log('Roles',roles);
    
    let redirectPath = '';
    if (roles?.includes('admin')) {
      redirectPath = '/dashboard';
    } else if (roles?.includes('Supplier')) {
      redirectPath = '/dashboard';
    } else if (roles?.includes('Buyer')) {
      redirectPath = '/buyerdashboard';
    } else if (roles?.includes('Accountant')) {
      redirectPath = '/accountsdashboard';
    }

    if ((pathname === '/' || pathname === '/exception' || pathname === '/exception?type=404') && redirectPath) {
      return <Redirect to={redirectPath} />;
    }

    const { path } = this.props.match;
    const { collapsed } = this.state;

    const layout = (
<Layout style={{ minHeight: '100vh' }}>
  <div
    onMouseEnter={this.state.hasRole ? this.onHoverStart : () => this.setState({ collapsed: true, hovering: false })}
    onMouseLeave={this.state.hasRole ? this.onHoverEnd : () => this.setState({ collapsed: true, hovering: false })}
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
              {pathname === '/' && !redirectPath && <Redirect from="/" to="/dashboard" />}
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

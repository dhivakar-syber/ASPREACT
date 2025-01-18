import './index.less';

import * as React from 'react';

import { Button, Checkbox, Col, Form, Input, Modal, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';

import AccountStore from '../../stores/accountStore';
import AuthenticationStore from '../../stores/authenticationStore';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../lib/abpUtility';
import { Redirect } from 'react-router-dom';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import TenantAvailabilityState from '../../services/account/dto/tenantAvailabilityState';
import rules from './index.validation';

import logo from '../../images/abp-logo-long.png';

const FormItem = Form.Item;
declare var abp: any;

export interface ILoginProps {
  authenticationStore?: AuthenticationStore;
  sessionStore?: SessionStore;
  accountStore?: AccountStore;
  history: any;
  location: any;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends React.Component<ILoginProps> {
  formRef = React.createRef<FormInstance>();
  changeTenant = async () => {
    let tenancyName = this.formRef.current?.getFieldValue('tenancyName');
    const { loginModel } = this.props.authenticationStore!;

    if (!tenancyName) {
      abp.multiTenancy.setTenantIdCookie(undefined);
      window.location.href = '/';
      return;
    } else {
      await this.props.accountStore!.isTenantAvailable(tenancyName);
      const { tenant } = this.props.accountStore!;
      switch (tenant.state) {
        case TenantAvailabilityState.Available:
          abp.multiTenancy.setTenantIdCookie(tenant.tenantId);
          loginModel.tenancyName = tenancyName;
          loginModel.toggleShowModal();
          window.location.href = '/';
          return;
        case TenantAvailabilityState.InActive:
          Modal.error({ title: L('Error'), content: L('TenantIsNotActive') });
          break;
        case TenantAvailabilityState.NotFound:
          Modal.error({ title: L('Error'), content: L('ThereIsNoTenantDefinedWithName{0}', tenancyName) });
          break;
      }
    }
  };

  handleSubmit = async (values: any) => {
    const { loginModel } = this.props.authenticationStore!;
    await this.props.authenticationStore!.login(values);
    sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
   const { state } = this.props.location;
    window.location = state ? state.from.pathname : '/';
    console.log('Window',window.location)
  };

  public render() {
    let { from } = this.props.location.state || { from: { pathname: '/' } };
    if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;

    const { loginModel } = this.props.authenticationStore!;
    return (
      <Form className="" onFinish={this.handleSubmit} ref={this.formRef} >
 

          {/* <Row>
            <Modal
              visible={loginModel.showModal}
              onCancel={loginModel.toggleShowModal}
              onOk={this.changeTenant}
              title={L('ChangeTenant')}
              okText={L('OK')}
              cancelText={L('Cancel')}
            >
              <Row>
                <Col span={8} offset={8}>
                  <h3>{L('TenancyName')}</h3>
                </Col>
                <Col>
                  <FormItem name={'tenancyName'}>
                    <Input placeholder={L('TenancyName')} prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} size="large" />
                  </FormItem>
                  {!this.formRef.current?.getFieldValue('tenancyName') ? <div>{L('LeaveEmptyToSwitchToHost')}</div> : ''}
                </Col>
              </Row>
            </Modal>
          </Row> */}

             
<div className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-column-fluid bg-white" style={{ paddingRight: '20%' }}>
  <div className="login-content flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
    <div className="d-flex flex-column-fluid flex-center" style={{ height: '100vh' }}>
      <div className="login-form-container" style={{
        maxWidth: '400px',
        width: '100%',
        position: 'absolute', // Position the form absolutely
        top: '50%',
        right: '50px',
        transform: 'translateY(-50%)', // Center vertically
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: 'transparent', // Transparent background for the form
        borderRadius: '4px', // Rounded corners
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
      }}>

        {/* Begin::Logo (Placed above Tenant Info Box) */}
        <div style={{ textAlign: 'center' }}>
          <img 
            src={logo} 
            alt="Account Logo" 
            style={{ 
              maxWidth: '400px', // Increased maximum width
              width: '90%',     // Adjusts to container width
              height: 'auto'     // Maintains aspect ratio
            }} 
          />
        </div>
        {/* End::Logo */}

        {/* Begin::Tenant Info Box */}
        {/* <Row style={{
          position: 'absolute',
          top: '-70px', // Adjust as needed to position relative to the logo
          width: 'calc(100% - 40px)', // Account for padding
          paddingRight: '20px',
          marginRight: '20px', // Add space to the right side of the info box
        }}>
          <Col span={24} style={{ textAlign: 'center', paddingBottom: '20px' }}>
            <Card style={{ paddingRight: '20px' }}> 
              <Row>
                {!!this.props.sessionStore!.currentLogin.tenant ? (
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={loginModel.toggleShowModal}>
                      {L('CurrentTenant')} : {this.props.sessionStore!.currentLogin.tenant.tenancyName}
                    </Button>
                  </Col>
                ) : (
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Button type="link" onClick={loginModel.toggleShowModal}>
                      {L('NotSelected')}
                    </Button>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row> */}
        {/* End::Tenant Info Box */}

        {/* Begin::Aside Title */}
        <span className="font-weight-bolder text-center font-size-h5-md" style={{ color: '#5097AB', display: 'block', marginBottom: '30px' ,textAlign: 'center'}}>
          PAY RETRO
        </span>
        {/* End::Aside Title */}

        {/* Begin::Form */}
        <FormItem name="userNameOrEmailAddress" rules={rules.userNameOrEmailAddress}>
          <div style={{
            display: 'flex',           // Use flexbox to center the content
            justifyContent: 'center',  // Centers horizontally
            alignItems: 'center',      // Centers vertically
            height: '100%',            // Ensure the container takes up full height
            margin: '0',               // Remove any default margin
          }}>
            <Input
              placeholder={L('UserNameOrEmail')}
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              size="large"
              style={{
                width: '90%',               // Input takes 90% of the container's width
                backgroundColor: '#fff',    // White background for the input
                maxWidth: '400px',          // Optionally limit the width of the input
              }}
            />
          </div>
        </FormItem>


        <FormItem name="password" rules={rules.password}>
        <div style={{
            display: 'flex',           // Use flexbox to center the content
            justifyContent: 'center',  // Centers horizontally
            alignItems: 'center',      // Centers vertically
            height: '100%',            // Ensure the container takes up full height
            margin: '0',               // Remove any default margin
          }}>
          <Input
            placeholder={L('Password')}
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            size="large"
            style={{
              width: '90%',  // Ensure the input takes full width within the container
              backgroundColor: '#fff', // White background for the input
              
            }}
          />
          </div>
        </FormItem>

        <Row style={{ margin: '0px 0 10px 15px', alignItems: 'center' }}>
            <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox 
                checked={loginModel.rememberMe} 
                onChange={loginModel.toggleRememberMe} 
                style={{ paddingRight: 8 }}
              />
              <span style={{ color: '#1ca47c' }}>
                {L('Remember Me')}
              </span>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <a href="#" style={{ color: '#1c916c', textDecoration: 'none' }}>
                {L('ForgotPassword')}
              </a>
            </Col>
          </Row>
          <br></br>
          <Row style={{ textAlign: 'center', marginTop: '10px' }}>
            <Col span={24}>
              <Button 
                style={{ 
                  backgroundColor: '#1c916c', 
                  color: 'white', 
                  display: 'block', 
                  margin: '0 auto' // Center the button
                }} 
                htmlType="submit" 
                
              >

                {L('LogIn')}
              </Button>
            </Col>
          </Row>

        {/* End::Form */}
      </div>
    </div>
  </div>
</div>

        </Form>
    );
  }
}

export default Login;

import * as React from 'react';

import { Checkbox, Input, Modal, Tabs, Form } from 'antd';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateUser.validation';
import { FormInstance } from 'antd/lib/form';

const TabPane = Tabs.TabPane;

export interface ICreateOrUpdateUserProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  roles: GetRoles[]; // Ensure roles is passed as a valid array
  formRef: React.RefObject<FormInstance>;
}

class CreateOrUpdateUser extends React.Component<ICreateOrUpdateUserProps> {
  state = {
    confirmDirty: false,
  };

  compareToFirstPassword = (rule: any, value: any) => {
    const form = this.props.formRef.current;

    if (value && value !== form?.getFieldValue('password')) {
      return Promise.reject('Two passwords that you enter are inconsistent!');
    }
    return Promise.resolve();
  };

  validateToNextPassword = (rule: any, value: any) => {
    const form = this.props.formRef.current;

    if (value && this.state.confirmDirty && form?.getFieldValue('confirm')) {
      form.validateFields(['confirm']);
    }

    return Promise.resolve();
  };

  render() {
    const roles = this.props.roles || []; // Use default empty array if roles is undefined

    console.log("Roles Data:", roles);

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const tailFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { visible, onCancel, onCreate } = this.props;

    // Filter and map roles to prevent undefined/null issues
    const options = roles
  ?.map((item: any) => {
    if (item) {
      const { name, displayName } = item;
      return {
        name,
        displayName,
      };
    }
    return null; // Return null if the item is falsy to prevent undefined values
  })
  .filter((role): role is { name:any,displayName: any; } => 
    role !== null && role.name && role.displayName // Filter out nulls and invalid roles
  )
  .map((x) => ({
    label: x?.displayName,
    value: x?.name,
  }));


    return (
      <Modal
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('OK')}
        onCancel={onCancel}
        onOk={onCreate}
        title={L('User')}
        destroyOnClose
      >
        <Form ref={this.props.formRef}>
          <Tabs defaultActiveKey="userInfo" size="small" tabBarGutter={64}>
            <TabPane tab={L('User')} key="userInfo">
              <Form.Item label={L('Name')} {...formItemLayout} name="name" rules={rules.name}>
                <Input />
              </Form.Item>
              <Form.Item label={L('Surname')} {...formItemLayout} name="surname" rules={rules.surname}>
                <Input />
              </Form.Item>
              <Form.Item label={L('UserName')} {...formItemLayout} name="userName" rules={rules.userName}>
                <Input />
              </Form.Item>
              <Form.Item label={L('Email')} {...formItemLayout} name="emailAddress" rules={rules.emailAddress as []}>
                <Input />
              </Form.Item>
              {this.props.modalType === 'edit' && (
                <>
                  <Form.Item
                    label={L('Password')}
                    {...formItemLayout}
                    name="password"
                    rules={[
                      { required: true, message: 'Please input your password!' },
                      { validator: this.validateToNextPassword },
                    ]}
                  >
                    <Input type="password" />
                  </Form.Item>
                  <Form.Item
                    label={L('ConfirmPassword')}
                    {...formItemLayout}
                    name="confirm"
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      { validator: this.compareToFirstPassword },
                    ]}
                  >
                    <Input type="password" />
                  </Form.Item>
                </>
              )}
              <Form.Item label={L('IsActive')} {...tailFormItemLayout} name="isActive" valuePropName="checked">
                <Checkbox>{L('IsActive')}</Checkbox>
              </Form.Item>
            </TabPane>
            <TabPane tab={L('Roles')} key="roles" forceRender>
              <Form.Item {...tailFormItemLayout} name="roleNames">
                <Checkbox.Group options={options} />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateUser;
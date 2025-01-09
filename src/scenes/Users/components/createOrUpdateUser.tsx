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
  onRoleSelection: (selectedRoles: string[]) => void;
  roles: GetRoles[]; // Ensure roles is passed as a valid array
  formRef: React.RefObject<FormInstance>;
  editRole: any;
}

class CreateOrUpdateUser extends React.Component<ICreateOrUpdateUserProps> {
  state = {
    confirmDirty: false,
    selectedRoles: [] as string[], // Add state for selected roles
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

  componentDidUpdate(prevProps: ICreateOrUpdateUserProps) {
    if (this.props.editRole !== prevProps.editRole) {
      const { formRef, editRole } = this.props;
      // If the form is available, set the field values
      if (formRef?.current) {
        formRef.current.setFieldsValue({
          ...editRole, // Assuming editRole is an object with the fields matching your form's field names
        });
      }
      const roles = this.props.roles || [];
      // Set the selected roles if editRole has changed
      const selectedRoles = (editRole?.length > 0 ? editRole : roles)
        ?.filter((role: any) => role.isAssigned)
        .map((role: any) => role.roleName) || [];
      this.setState({ selectedRoles });
    }
  }

  handleRoleChange = (roleValue: string, checked: boolean) => {
    this.setState((prevState: any) => {
      const selectedRoles = prevState.selectedRoles.slice();
  
      if (checked) {
        selectedRoles.push(roleValue);
      } else {
        const index = selectedRoles.indexOf(roleValue);
        if (index > -1) {
          selectedRoles.splice(index, 1);
        }
      }
  
      this.setState({ selectedRoles });
      const returnedRoles = this.props.onRoleSelection(selectedRoles);
    console.log('Returned roles:', returnedRoles); // You can log t
    });
  };

  render() {
    const { visible, onCancel, onCreate, editRole } = this.props;
    const { selectedRoles } = this.state;
    const roles = this.props.roles || [];
    console.log("Roles Data:", roles);
    // Handle default selected roles based on 'isAssigned' property
    const options = (editRole?.length > 0 ? editRole : roles)
      ?.map((role: any) => ({
        label: role.roleDisplayName || role.displayName, // Access `displayName` if `roleDisplayName` is not present
        value: role.roleName || role.name, // Use `roleName` or fallback to `name`
        className: selectedRoles.includes(role.roleName || role.name) ? 'ant-checkbox-checked' : '',
      }))
      .filter((role: any) => role.label && role.value);

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
              <Form.Item label={L('Name')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="name" rules={rules.name}>
                <Input />
              </Form.Item>
              <Form.Item label={L('Surname')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="surname" rules={rules.surname}>
                <Input />
              </Form.Item>
              <Form.Item label={L('UserName')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="userName" rules={rules.userName}>
                <Input />
              </Form.Item>
              <Form.Item label={L('Email')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="emailAddress" rules={rules.emailAddress as []}>
                <Input />
              </Form.Item>
              {this.props.modalType === 'edit' && (
                <>
                  <Form.Item
                    label={L('Password')}
                    {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }}
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }, { validator: this.validateToNextPassword }]}
                  >
                    <Input type="password" />
                  </Form.Item>
                  <Form.Item
                    label={L('ConfirmPassword')}
                    {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }}
                    name="confirm"
                    rules={[{ required: true, message: 'Please confirm your password!' }, { validator: this.compareToFirstPassword }]}
                  >
                    <Input type="password" />
                  </Form.Item>
                </>
              )}
              <Form.Item label={L('IsActive')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="isActive" valuePropName="checked">
                <Checkbox>{L('IsActive')}</Checkbox>
              </Form.Item>
            </TabPane>
            <TabPane tab={L('Roles')} key="roles" forceRender>
              <Form.Item {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="roleNames">
                {options?.map((role: any) => (
                  <Checkbox
                    key={role.value}
                    value={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onChange={(e) => this.handleRoleChange(role.value, e.target.checked)}
                  >
                    {role.label}
                  </Checkbox>
                ))}
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateUser;
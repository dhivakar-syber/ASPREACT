import * as React from 'react';
import { Checkbox, Input, Modal, Tabs, Form, Space, Select } from 'antd';
import { GetRoles } from '../../../services/user/dto/getRolesOuput';
import { L } from '../../../lib/abpUtility';
import rules from './createOrUpdateUser.validation';
import { FormInstance } from 'antd/lib/form';
import {EnumRoleType} from '../../../enum';

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
  editUser:any
}

class CreateOrUpdateUser extends React.Component<ICreateOrUpdateUserProps> {
  state = {
    confirmDirty: false,
    selectedRoles: ['User'] as string[], // Add state for selected roles
    selectedRoleType: 0,
    vendorvisible:false
  };



  // Now filter the roles based on selection
  filterRoles = () => {
    const { selectedRoleType } = this.state;
    // console.log(selectedRole)
    const {editRole} = this.props;
    // const { options } = this;
    const roles = this.props.roles || [];

    const options = (editRole?.length > 0 ? editRole : roles)
    ?.map((role: any) => ({
      label: role.roleDisplayName || role.displayName, // Access `displayName` if `role,DisplayName` is not present
      value: role.roleName || role.name, // Use `roleName` or fallback to `name`
      isAssigned:role.isAssigned,
      className: this.state.selectedRoles.includes(role.roleName || role.name|| role.isAssigned) ? 'ant-checkbox-checked' : '',
    }))
    .filter((role: any) => role.label && role.value);
    if (selectedRoleType === 1) {
      return options?.filter((role: any) => role.value !== "Supplier");
    }
    if (selectedRoleType === 2) {
      return options?.filter((role: any) => role.value === "Supplier" || role.value === "User");
    }
    // console.log(options)
    return options;
    
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
      const { formRef, editRole,editUser } = this.props;
      // If the form is available, set the field values
      if (formRef?.current) {
        formRef.current.setFieldsValue({
          ...editRole, // Assuming editRole is an object with the fields matching your form's field names
          ...editUser
        });
      }
      if(editUser.roleType==2){
        this.setState({vendorvisible:true})
      }else{this.setState({vendorvisible:false})}

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
  // console.log(selectedRoles)
  this.props.onRoleSelection(selectedRoles);
      this.setState({ selectedRoles });
      
    });
  };


  handleTypeRoleChange = (value: number) => {
    let updatedRoles = this.state.selectedRoles;
  
    if (value === 2) {
      updatedRoles = ['User','Supplier']; // Ensure 'Supplier' is selected
      this.setState({vendorvisible:true})
    } else {
      updatedRoles = ['User']; // Reset selected roles if switching back
      this.setState({vendorvisible:false})
    }
  
    this.setState({ selectedRoleType: value, selectedRoles: updatedRoles }, () => {
      this.props.onRoleSelection(updatedRoles); // Ensure parent component is updated
    });
  };
  
options = (this.props.editRole?.length > 0 ? this.props.editRole : this.props.roles)
  ?.map((role: any) => ({
    label: role.roleDisplayName || role.displayName, 
    value: role.roleName || role.name, 
    isAssigned:role.isAssigned
  }))
  .filter((role: any) => role.label && role.value);


  render() {
    const { visible, onCancel, onCreate } = this.props;
    const { selectedRoles } = this.state;
    // console.log("selectedRoles",selectedRoles)
    const filteredRoles = this.filterRoles();
    //console.log("Roles Data:", roles);
    // Handle default selected roles based on 'isAssigned' property
 

      
// Now filter the roles based on selection
//     const filteredRoles = options?.filter((role: any) => {
//   if (this.state.selectedRole === "internal") return role.value !== "Supplier"; 
//   if (this.state.selectedRole === "external") return role.value === "Supplier"; 
//   return true;
// });


    return (
      <Modal
        visible={visible}
        cancelText={L('Cancel')}
        okText={L('Save')}
        onCancel={onCancel}
        onOk={onCreate}
        title={L('User')}
        destroyOnClose
      >
        <Form ref={this.props.formRef}>
          <Tabs defaultActiveKey="userInfo" size="small" tabBarGutter={64}>
            <TabPane tab={L('User')} key="userInfo">
            <Form.Item
                label="User Type"
                name="roleType"
                {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }}
                rules={[{ required: true, message: 'Please select a role!' }]}
              >
                <Select placeholder="Choose a user type"
                onChange={this.handleTypeRoleChange}>
                  <Select.Option key="internal" value={EnumRoleType.Internal}>
                    Internal
                  </Select.Option>
                  <Select.Option key="external" value={EnumRoleType.External}>
                    External
                  </Select.Option>
                </Select>
              </Form.Item>

            <Form.Item label={L('UserName')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="userName" rules={rules.userName}>
                <Input />
              </Form.Item>
              <Form.Item label={L('Name')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="name" rules={rules.name}>
                <Input />
              </Form.Item>
              {/* <Form.Item label={L('Surname')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="surname" rules={rules.surname}>
                <Input />
              </Form.Item> */}

              <Form.Item label={L('Email')} {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }} name="emailAddress" rules={rules.emailAddress as []}>
                <Input />
              </Form.Item>
              {this.state.vendorvisible ? (
  <Form.Item
    label={L('VendorCode')}
    labelCol={{ span: 6 }}
    wrapperCol={{ span: 18 }}
    name="vendorcode"
    rules={rules.userName}
  >
    <Input />
  </Form.Item>
) : null}
              {/* {this.props.modalType === 'edit' && (
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
              )} */}
              <Form.Item
  label={L('IsActive')}
  {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }}
  name="isActive"
  valuePropName="checked"
  initialValue={this.props.modalType === 'create' ? true : undefined} // Default true when creating
>
  <Checkbox>{L('IsActive')}</Checkbox>
</Form.Item>

            </TabPane>
            <TabPane tab={L('Roles')} key="roles" forceRender>
            <Form.Item>
          <Space direction="vertical">
            {filteredRoles.map((role:any) => (
              <Checkbox
                key={role.value}
                value={role.value}
                checked={selectedRoles.includes(role.value)}
                onChange={(e) => this.handleRoleChange(role.value,  e.target.checked)}
              >
                {role.label}
              </Checkbox>
            ))}
          </Space>
        </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateUser;
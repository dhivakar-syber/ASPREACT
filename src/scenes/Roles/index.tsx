import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, message, Modal, Row, Table } from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateRole from './components/createOrUpdateRole';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import RoleStore from '../../stores/roleStore';
import SessionStore from '../../stores/sessionStore';
import Stores from '../../stores/storeIdentifier';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import sessionService from '../../services/session/sessionService';

// const userPermissions = ["Pages.Administration.Roles.Create", "Pages.Administration.Roles.Edit","Pages.Administration.Roles.Delete"];
// const hasPermission = (permission: string): boolean => userPermissions.includes(permission);

export interface IRoleProps {
  roleStore: RoleStore;
  sessionStore: SessionStore;
}

export interface IRoleState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  roleId: number;
  filter: string;
  role: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.RoleStore,Stores.SessionStore)
@observer
class Role extends AppComponentBase<IRoleProps, IRoleState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    roleId: 0,
    filter: '',
    role:''
  };

  async componentDidMount() {
    await this.getAll();
    sessionService.getCurrentLoginInformations().then(currentLoginInfo => {
      //console.log("Current User Role:", currentLoginInfo);
      this.setState({ role: currentLoginInfo?.user?.userName || "No role found" }, () => {
        //console.log("Updated User Role:", this.state.role); // Logs updated state
      });
    });
  }

  async getAll() {
    const filters={
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount, 
      Filter:this.state.filter
    }

    await this.props.roleStore.getAll(filters,this.state.role);
  }

  
  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };


  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.roleStore.createRole();
      await this.props.roleStore.getAllPermissions(this.state.role);
      await this.props.sessionStore.currentLogin;
    } else {
      await this.props.roleStore.getRoleForEdit(entityDto,this.state.role);
      await this.props.roleStore.getAllPermissions(this.state.role);
      await this.props.sessionStore.currentLogin;
    }

    this.setState({ roleId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({
        ...this.props.roleStore.roleEdit.role,
        grantedPermissionNames: this.props.roleStore.roleEdit.grantedPermissionNames,
      });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.roleStore.delete(input);
      },
      onCancel() {},
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;
  
    form!.validateFields().then(async (values: any) => {
      // Destructure values for better clarity
      const { displayName, name, grantedPermissionNames, ...otherValues } = values;
  
      // Construct the input object
      const roleInput = {
        ...otherValues,
        role: {
          id: this.state.roleId === 0 ? null : this.state.roleId,
          displayName:name, // Add displayName to the role object
          name,        // Add name to the role object
        },
        grantedPermissionNames, // Place grantedPermissionNames outside the role object
      };
  
      if (this.state.roleId === 0) {
        await this.props.roleStore.create(roleInput);
        message.success("Successfully Created!")
      } else {
        await this.props.roleStore.update({ id: this.state.roleId, ...roleInput });
        message.success("Successfully Updated!")
      }
  
      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };
  

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  public render() {
    const { allPermissions, roles } = this.props.roleStore;
    const {currentLogin} = this.props.sessionStore
    const isAdmin = currentLogin?.user?.roles?.includes('Admin');
    //console.log(allPermissions);
    //console.log(currentLogin);
    const specificPermissionsToShow = ["Pages", "Administration", "Disputes","Create new Query","Edit dispute","Delete dispute","Roles","Creating new role",
      "Editing role","Supplier Dashboard","Buyer Dashboard","Accounts Dashboard","Users","Creating new user","Editing user","Deleting user","Annexure details"
    ,"Create new annexure detail","Delete annexure detail","Edit annexure detail","SectionHead Dashboard"];
    const permissionsToDisplay = isAdmin
    ? allPermissions
  : allPermissions.filter(permission =>
      specificPermissionsToShow.includes(permission.displayName)
    );
    console.log(permissionsToDisplay);
    const columns = [
      { title: L('RoleName'), dataIndex: 'displayName', key: 'displayName', width: 150, render: (text: string) => <div>{text}</div> },
      // { title: L('DisplayName'), dataIndex: 'displayName', key: 'displayName', width: 150, render: (text: string) => <div>{text}</div> },
      {
        title: L('Actions'),
        width: 150,
        render: (text: string, item: any) => (
          <div>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu>
                  <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.id })}>{L('Edit')}</Menu.Item>
                  <Menu.Item onClick={() => this.delete({ id: item.id })}>{L('Delete')}</Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button type="primary" icon={<SettingOutlined />}>
                {L('Actions')}
              </Button>
            </Dropdown>
          </div>
        ),
      },
    ];

    return (
      <Card>
        <Row>
          <Col
            xs={{ span: 4, offset: 0 }}
            sm={{ span: 4, offset: 0 }}
            md={{ span: 4, offset: 0 }}
            lg={{ span: 2, offset: 0 }}
            xl={{ span: 2, offset: 0 }}
            xxl={{ span: 2, offset: 0 }}
          >
            <h2>{L('Roles')}</h2>
          </Col>
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} />
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >
            <Table
              rowKey="id"
              bordered={true}
              pagination={{ pageSize: this.state.maxResultCount, total: roles === undefined ? 0 : roles.totalCount, defaultCurrent: 1 }}
              columns={columns}
              loading={roles === undefined ? true : false}
              dataSource={roles === undefined ? [] : roles.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>

        <CreateOrUpdateRole
          visible={this.state.modalVisible}
          onCancel={() =>
            this.setState({
              modalVisible: false,
            })
          }
          modalType={this.state.roleId === 0 ? 'edit' : 'create'}
          onOk={this.handleCreate}
          permissions={allPermissions}
          roleStore={this.props.roleStore}
          formRef={this.formRef}
        />
      </Card>
    );
  }
}

export default Role;

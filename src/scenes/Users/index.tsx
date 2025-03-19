import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, message, Modal, Row, Table, Tag } from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateUser from './components/createOrUpdateUser';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import UserStore from '../../stores/userStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import sessionService from '../../services/session/sessionService';

export interface IUserProps {
  userStore: UserStore;
}

export interface IUserState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  role: string;
  selectedRoles: string[];
  currentpage : number;
}

const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.UserStore)
@observer
class User extends AppComponentBase<IUserProps, IUserState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    role: '',
    selectedRoles:[] as string[],
    currentpage:1
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
    const filters = {
        maxResultCount: this.state.maxResultCount,
        skipCount: this.state.filter? 0 : this.state.skipCount, // Fixed condition
        keyword: this.state.filter,
        Filter: this.state.filter
    };

    await this.props.userStore.getAll(filters);
}

handleTableChange = (pagination: any) => {
  this.setState(
    {
      currentpage: pagination.current,
      skipCount: (pagination.current - 1) * this.state.maxResultCount!,
    },
    async () => await this.getAll()
  );
};

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.userStore.createUser();
      await this.props.userStore.getRoles();
    } else {
      await this.props.userStore.get(entityDto,this.state.role);
      await this.props.userStore.getRoles();
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.userStore.editUser,...this.props.userStore.editRole });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.userStore.delete(input);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }
  handleRoleSelection = (selectedRoles: string[]) => {
    // Check if selectedRoles is different from the current state
    if (JSON.stringify(selectedRoles) !== JSON.stringify(this.state.selectedRoles)) {
      this.setState({ selectedRoles }); // Update state if roles have changed
    }
  
    // Always return the selectedRoles (whether changed or not)
    return selectedRoles;
  };
  handleCreate = () => {
    const form = this.formRef.current;
  
    form!.validateFields().then(async (values: any) => {
      // Destructure values for better clarity
      const { name, surname, userName, emailAddress, isActive, roleNames,phoneNumber,password,roleType,vendorcode, ...otherValues } = values;
      const { selectedRoles } = this.state;
      // Construct the input object
      const userInput = {
        ...otherValues,
        user: {
          id: this.state.userId === 0 ? null : this.state.userId,
          name,             
          surname: "--",  // Hardcoded surname
          userName,        
          emailAddress,    
          isActive,
          phoneNumber:"--", 
          password:"Daimler@123",
          roleType,
          vendorcode
        },
        assignedRoleNames: selectedRoles, 
      };
      
      if (this.state.userId === 0) {
        await this.props.userStore.create(userInput);
         message.success("Successfully Created!")
      } else {
        await this.props.userStore.update({ id: this.state.userId, ...userInput });
         message.success("Successfully Updated!")
      }
  
      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value ,currentpage: 1, skipCount: 0}, async () => await this.getAll());
    // this.setState({ filter: value}, async () => await this.getAll());
  };

  public render() {
    const { users } = this.props.userStore;
    const columns = [
      { title: L('UserName'), dataIndex: 'userName', key: 'userName', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('FullName'), dataIndex: 'name', key: 'name', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('Vendor Code'), dataIndex: 'vendorCode', key: 'vendorCode', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('EmailAddress'), dataIndex: 'emailAddress', key: 'emailAddress', width: 150, render: (text: string) => <div>{text}</div> },
      {
        title: L('IsActive'),
        dataIndex: 'isActive',
        key: 'isActive',
        width: 150,
        render: (text: boolean) => (text === true ? <Tag color="#2db7f5">{L('Yes')}</Tag> : <Tag color="red">{L('No')}</Tag>),
      },
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
            {' '}
            <h2>{L('Users')}</h2>
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
              rowKey={(record) => record?.id?.toString()}
              bordered={true}
              columns={columns}
               pagination={{ pageSize: 10, total: users === undefined ? 0 : users.totalCount, defaultCurrent:1,
                current: this.state.currentpage, // Controlled pagination
               }}
              // pagination={false}
              loading={users === undefined ? true : false}
              dataSource={users === undefined ? [] : users.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        <CreateOrUpdateUser
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.userId === 0 ? 'create' : 'edit'}
          onCreate={this.handleCreate}
          roles={this.props.userStore.roles}
          editRole={this.props.userStore.editRole}
          editUser={this.props.userStore.editUser}
          onRoleSelection={this.handleRoleSelection}
        />
      </Card>
    );
  }
}

export default User;

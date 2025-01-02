import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateApprovalWorkflows from './components/createOrUpdateApprovalWorkflows';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import approvalWorkflowStore from '../../stores/approvalWorkflowStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';

const userPermissions = ["Pages.Administration.ApprovalWorkflows.Create", "Pages.Administration.ApprovalWorkflows.Edit","Pages.Administration.ApprovalWorkflows.Delete"];
const hasPermission = (permission: string): boolean => userPermissions.includes(permission);

export interface IApprovalWorkflowsProps {
  approvalWorkflowStore: approvalWorkflowStore;
}

export interface IApprovalWorkflowsState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
}
type BuyerLookupItem = {
  id: number;
  displayName: string;
};
type SupplierLookupItem = {
  id: number;
  displayName: string;
};
type UserLookupItem = {
  id: number;
  displayName: string;
};
type User2LookupItem = {
  id: number;
  displayName: string;
};
type User3LookupItem = {
  id: number;
  displayName: string;
};
const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.ApprovalWorkflowStore)
@observer
class ApprovalWorkflows extends AppComponentBase<IApprovalWorkflowsProps, IApprovalWorkflowsState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    selectedUserLookupItem: null as UserLookupItem | null,
    selectedUser2LookupItem: null as User2LookupItem | null,
    selectedUser3LookupItem: null as User3LookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    if (!this.props.approvalWorkflowStore) {
        console.error('approvalWorkflowStore is undefined');
        return;
    }
    await this.props.approvalWorkflowStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
      await this.props.approvalWorkflowStore.createApprovalWorkflow();
    } else {
      await this.props.approvalWorkflowStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.approvalWorkflowStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.approvalWorkflowStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
editdata:any = null;
  handleCreate = () => {
    const form = this.formRef.current;
    const { selectedUserLookupItem } = this.state;
    if (selectedUserLookupItem?.id) { 
      form?.setFieldsValue({ approvalBuyer: selectedUserLookupItem.id });
    }
    const { selectedUser2LookupItem } = this.state;
    if (selectedUser2LookupItem?.id) { 
      form?.setFieldsValue({ accountsApprover: selectedUser2LookupItem.id });
    }
    const { selectedUser3LookupItem } = this.state;
    if (selectedUser3LookupItem?.id) { 
      form?.setFieldsValue({ paymentApprover: selectedUser3LookupItem.id });
    }
    const { selectedSupplierLookupItem } = this.state;
    if (selectedSupplierLookupItem?.id) { 
      form?.setFieldsValue({ supplierId: selectedSupplierLookupItem.id });
    }
    const { selectedBuyerLookupItem } = this.state;
    if (selectedBuyerLookupItem?.id) { 
      form?.setFieldsValue({ buyerId: selectedBuyerLookupItem.id });
    }
    form!.validateFields().then(async (values: any) => {
      if (this.state.userId === 0) {
        await this.props.approvalWorkflowStore.create(values);
      } else {
        await this.props.approvalWorkflowStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  // handleexcelexport = () =>{
  //   this.props.cbfcdataStore.getExcelExport();
  // }
  
  
  //  handleFileUpload = (event:any) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       this.props.annexureDetailsStore.importExcel(file);
  //     }
  //   };

  public render() {
    console.log(this.props.approvalWorkflowStore);
    const { approvalWorkflow } = this.props.approvalWorkflowStore;
    const columns = [
        {
            title: L('Actions'),
            width: 150,
            render: (text: string, item: any) => (
              <div>
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu>
                      {hasPermission("Pages.Administration.ApprovalWorkflows.Edit") && (
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.approvalWorkflow?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasPermission("Pages.Administration.ApprovalWorkflows.Delete") && (
                      <Menu.Item onClick={() => this.delete({ id: item.approvalWorkflow?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('BuyerShortId'), dataIndex: 'buyerShortId', key: 'buyerShortId', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('SupplierCode'), dataIndex: 'supplierCode', key: 'supplierCode', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('buyermailaddress'), dataIndex: 'userName', key: 'userName', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('accountmailaddress'), dataIndex: 'userName2', key: 'userName2', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('paymentmailaddress'), dataIndex: 'userName3', key: 'userName3', width: 150, render: (text: string) => <div>{text}</div> },
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
            <h2>{L('ApprovalWorkflows')}</h2>
          </Col>
             {/* <Col
                      xs={{ span: 14, offset: 0 }}
                      sm={{ span: 15, offset: 0 }}
                      md={{ span: 15, offset: 0 }}
                      lg={{ span: 1, offset: 21 }}
                      xl={{ span: 1, offset: 21 }}
                      xxl={{ span: 1, offset: 19 }}
                    >  <div>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                          <Menu>
                          <Menu.Item>
                            <label style={{ cursor: 'pointer' }}>
                              <input type="file" accept=".xlsx, .xls"  style={{ display: 'none' }}  onChange={this.handleFileUpload} />
                              {L('ImportExcel')}
                            </label>
                          </Menu.Item>
                          <Menu.Item onClick={this.handleexcelexport}>
                            {L('ExportExcel')}
                          </Menu.Item>
                        </Menu>
                        
                        }
                          placement="bottomLeft">            
                        <Button type="primary" icon={<SettingOutlined />} style={{marginLeft: '-150px'}}>
                          {L('Excel Operation')}
                        </Button>
                    </Dropdown>
                  </div>
          
                    </Col>
                    <br />
                    <br />
                    <br /> */}
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            <Button type="primary"  icon={<PlusOutlined/>} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-50px'}}>Create Approval Workflows</Button>
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
              rowKey={(record) => record.ApprovalWorkflow?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: approvalWorkflow === undefined ? 0 : approvalWorkflow.totalCount, defaultCurrent: 1 }}
              loading={approvalWorkflow === undefined ? true : false}
              dataSource={approvalWorkflow === undefined ? [] : approvalWorkflow.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateApprovalWorkflows
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.userId === 0 ? 'edit' : 'create'}
          onCreate={this.handleCreate}
          initialData={{
            deliveryNote: '',
            deliveryNoteDate: '',
            transaction: 0,
            paidAmount: 0,
            year: 0,
          }}
          approvalWorkflowStore={this.props.approvalWorkflowStore}
        />
      </Card>
    );
  }
}

export default ApprovalWorkflows;
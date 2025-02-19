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
import sessionService from '../../services/session/sessionService';

// const userPermissions = ["Pages.Administration.ApprovalWorkflows.Create", "Pages.Administration.ApprovalWorkflows.Edit","Pages.Administration.ApprovalWorkflows.Delete"];
// const hasPermission = (permission: string): boolean => userPermissions.includes(permission);

const getUserPermissions = async (): Promise<string[]> => {
  try {
    // Fetch the current login information asynchronously
    const currentLoginInfo = await sessionService.getCurrentLoginInformations();
    console.log('User',currentLoginInfo);
    // Assuming permissions are inside the 'permissions' field of the object
    const permissions: string[] = currentLoginInfo?.user?.permissions || [];
    console.log('permissions',permissions)
    return permissions;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];  // Return an empty array if there's an error
  }
};

const hasPermission = async (permission: string): Promise<boolean> => {
  const userPermissions = await getUserPermissions();
  return userPermissions.includes(permission);
};

hasPermission("Pages.Administration.ApprovalWorkflows").then(hasPerm => {
  console.log('is',hasPerm);  // true or false based on the session data
});

export interface IApprovalWorkflowsProps {
  approvalWorkflowStore: approvalWorkflowStore;
}

export interface IApprovalWorkflowsState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  buyerShortIdFilter:string,
  supplierCodeFilter:string,
  userNameFilter:string,
  userName2Filter:string,
  userName3Filter:string,
  buyerid:number,
  supplierid:number,
  filterVisible: boolean;
  hasCreatePermission: boolean;
  hasDeletePermission: boolean;
  hasEditPermission: boolean;
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
    buyerShortIdFilter:'',
    supplierCodeFilter:'',
    userNameFilter:'',
    userName2Filter:'',
    userName3Filter:'',
    buyerid:0,
    supplierid:0,
    hasCreatePermission: false,
    hasDeletePermission: false,
    hasEditPermission: false,
    selectedUserLookupItem: null as UserLookupItem | null,
    selectedUser2LookupItem: null as User2LookupItem | null,
    selectedUser3LookupItem: null as User3LookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
    filterVisible:false,
  };

  async componentDidMount() {
    await this.getAll();
    await this.checkPermissions();
  }

  checkPermissions = async () => {
    const hasPermissionCreate = await hasPermission("Pages.Administration.ApprovalWorkflows.Create");
    this.setState({ hasCreatePermission: hasPermissionCreate });
    const hasPermissionDelete = await hasPermission("Pages.Administration.ApprovalWorkflows.Delete");
    this.setState({ hasDeletePermission: hasPermissionDelete });
    const hasPermissionEdit = await hasPermission("Pages.Administration.ApprovalWorkflows.Edit");
    this.setState({ hasEditPermission: hasPermissionEdit });
  };

  async getAll() {
    if (!this.props.approvalWorkflowStore) {
        console.error('approvalWorkflowStore is undefined');
        return;
    }
    const filter ={
      buyerShortIdFilter:this.state.buyerShortIdFilter,
      supplierCodeFilter:this.state.supplierCodeFilter,
      userNameFilter:this.state.userNameFilter,
      userName2Filter:this.state.userName2Filter,
      userName3Filter:this.state.userName3Filter,
      buyerid:this.state.buyerid,
      supplierid:this.state.supplierid,
      maxResultCount:this.state.maxResultCount,
      skipCount:this.state.skipCount,
      keyword:this.state.filter,
    }
    await this.props.approvalWorkflowStore.getAll( filter);

  }

  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };
  handleBuyerChange = (value: string) => {
    this.setState({buyerShortIdFilter:value}, async () => await this.getAll());
};
handleCodeChange = (value: string) => {
  this.setState({supplierCodeFilter:value}, async () => await this.getAll());
};
handleNameChange = (value: string) => {
  this.setState({userNameFilter:value}, async () => await this.getAll());
};
handleName2Change = (value: string) => {
  this.setState({userName2Filter:value}, async () => await this.getAll());
};
handleName3Change = (value: string) => {
  this.setState({userName3Filter:value}, async () => await this.getAll());
};
toggleFilterBox = () => {
  this.setState({ filterVisible: !this.state.filterVisible });
};
  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  resetFilters = async () => {
    this.setState(
      {
        buyerShortIdFilter: '', // Reset filter values
        supplierCodeFilter: '',
        userNameFilter: '',
        userName2Filter: '',
        userName3Filter: '',
        filter: '', // Reset other filters as needed
      },
      async () => {
        await this.getAll(); // Fetch data with no filters applied
      }
    );
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
    const { hasCreatePermission,hasEditPermission,hasDeletePermission } = this.state;

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
                      {hasEditPermission && (
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.approvalWorkflow?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasDeletePermission && (
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
            {hasCreatePermission && (
            <Button type="primary"  icon={<PlusOutlined/>} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-50px'}}>Create Approval Workflows</Button>)}
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
          </Col>
        </Row>
        <Col>
          <span
            style={{ cursor: 'pointer'}}
            onClick={() => this.setState({ filterVisible: !this.state.filterVisible })}
          >
            <span
             style={{ cursor: 'pointer', marginBottom: '10px', display: 'inline-block' }}
              onClick={this.toggleFilterBox}
            >
              {this.state.filterVisible ? 'Hide Advance Filters' : 'Show Advance Filters'}
            </span>

          </span>
        </Col>
        
        {/* Filter */}

        {this.state.filterVisible && (
       <Row gutter={16} style={{ marginTop: '10px' }}>

        <Col xs={{span:5,offset:0}}>
          <label className="form-label">{L('Buyer')}</label>
          <input 
              value={this.state.buyerShortIdFilter} // Correctly bind the value to the state
              onChange={(e) =>this.handleBuyerChange ( e.target.value ) // Update the state on change
            }
          />
          
        </Col>

           <Col xs={{span:5,offset:0}}>
              <label className="form-label">{L('Code')}</label>
              <input 
              value={this.state.supplierCodeFilter} // Correctly bind the value to the state
              onChange={(e) =>this.handleCodeChange ( e.target.value ) // Update the state on change
              }
            />
          </Col>

          <Col xs={{span:5,offset:0}}>
            <label className="form-label">{L('Buyer Email Address')}</label>
            <input 
                  value={this.state.userNameFilter} // Correctly bind the value to the state
                  onChange={(e) => this.handleNameChange ( e.target.value ) // Update the state on change
                }
              />
            </Col>

                 
           <Col xs={{span:5,offset:0}}>
            <label className="form-label">{L('F&C Email Address')}</label>
            <input 
                    value={this.state.userName2Filter} // Correctly bind the value to the state
                    onChange={(e) =>this.handleName2Change ( e.target.value ) // Update the state on change
                  }
                />
            </Col>

           <Col xs={{span:5,offset:0}}>
            <label className="form-label">{L('CBFC Email Address')}</label>
            <input 
                    value={this.state.userName3Filter} // Correctly bind the value to the state
                    onChange={(e) =>this.handleName3Change ( e.target.value ) // Update the state on change
                  }
                />
            </Col>

            <Col xs={{ span: 4 }} style={{
                position: 'absolute',
                top: '150px',
                right: '24px',
                width: '10%',
              }}>
                <Button
                  type="default"
                  onClick={this.resetFilters}
                  style={{ marginTop: '24px', width: '50%' }}
                >
                  Reset
                </Button>
              </Col>
        </Row>
            )}
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

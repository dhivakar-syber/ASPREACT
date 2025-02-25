import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateSupplierRejections from './components/createOrUpdateSupplierRejections';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import supplierRejectionStore from '../../stores/supplierRejectionStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import sessionService from '../../services/session/sessionService';

// const userPermissions = ["Pages.Administration.SupplierRejections.Create", "Pages.Administration.SupplierRejections.Edit","Pages.Administration.SupplierRejections.Delete"];
// const hasPermission = (permission: string): boolean => userPermissions.includes(permission);
const getUserPermissions = async (): Promise<string[]> => {
  try {
    // Fetch the current login information asynchronously
    const currentLoginInfo = await sessionService.getCurrentLoginInformations();
    //console.log('User',currentLoginInfo);
    // Assuming permissions are inside the 'permissions' field of the object
    const permissions: string[] = currentLoginInfo?.user?.permissions || [];
    //console.log('permissions',permissions)
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

hasPermission("Pages.Administration.SupplierRejections").then(hasPerm => {
  //console.log('is',hasPerm);  // true or false based on the session data
});

export interface ISupplierRejectionProps {
  supplierRejectionStore: supplierRejectionStore;
}

export interface ISupplierRejectionState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  codeFilter:string;
  descriptionFilter:string;
  showAdvancedFilters: boolean;
  hasCreatePermission: boolean;
  hasDeletePermission: boolean;
  hasEditPermission: boolean;
}
const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.SupplierRejectionStore)
@observer
class SupplierRejection extends AppComponentBase<ISupplierRejectionProps, ISupplierRejectionState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    codeFilter:'',
    descriptionFilter:'',
    showAdvancedFilters: false,
    hasCreatePermission: false,
    hasDeletePermission: false,
    hasEditPermission: false,
  };

  async componentDidMount() {
    await this.getAll();
    await this.checkPermissions();
  }
  checkPermissions = async () => {
    const hasPermissionCreate = await hasPermission("Pages.Administration.SupplierRejections.Create");
    this.setState({ hasCreatePermission: hasPermissionCreate });
    const hasPermissionDelete = await hasPermission("Pages.Administration.SupplierRejections.Delete");
    this.setState({ hasDeletePermission: hasPermissionDelete });
    const hasPermissionEdit = await hasPermission("Pages.Administration.SupplierRejections.Edit");
    this.setState({ hasEditPermission: hasPermissionEdit });
  };


  async getAll() {
    if (!this.props.supplierRejectionStore) {
        console.error('supplierRejectionStore is undefined');
        return;
    }
    const filters = {
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter, // global filter (if any)
      filter: this.state.filter,
      codeFilter:this.state.codeFilter,
      descriptionFilter:this.state.descriptionFilter,
    }
    await this.props.supplierRejectionStore.getAll(filters);
    //await this.props.supplierRejectionStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
  }

  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  toggleAdvancedFilters = () => {
    this.setState((prevState) => ({
      showAdvancedFilters: !prevState.showAdvancedFilters,
    }));
  };
  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.supplierRejectionStore.createSupplierRejections();
    } else {
      await this.props.supplierRejectionStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.supplierRejectionStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.supplierRejectionStore.delete(input);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }

  resetFilters = () => {
    this.setState({
      codeFilter:'',
      descriptionFilter:'',
},
  
    () => {
      this.getAll(); // Call the data-refresh function after resetting the filters
    }
  );
};
editdata:any = null;
  handleCreate = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.userId === 0) {
        await this.props.supplierRejectionStore.create(values);
      } else {
        await this.props.supplierRejectionStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  handleCodeSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ codeFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.codeFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleDescriptionSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ descriptionFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.descriptionFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
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
    //console.log(this.props.supplierRejectionStore);
    const { supplierRejections } = this.props.supplierRejectionStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.supplierRejection?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasDeletePermission && (
                      <Menu.Item onClick={() => this.delete({ id: item.supplierRejection?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('Code'), dataIndex: 'supplierRejection.Code', key: 'code', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRejection?.code || ''}</div> },
      { title: L('Description'), dataIndex: 'supplierRejection.description', key: 'description', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRejection?.description || ''}</div> },
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
            <h2>{L('Supplier Rejections')}</h2>
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
            {hasCreatePermission  && (
            <Button type="primary"  icon={<PlusOutlined/>} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-50px'}}>Create Rejections</Button>)}
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
          </Col>
        </Row>
         <Row style={{ marginTop: 20 }}>
                            <Col sm={{ span: 24 }}>
                              <span
                                className="text-muted clickable-item"
                                onClick={this.toggleAdvancedFilters}
                              >
                                {this.state.showAdvancedFilters ? (
                                  <>
                                    <i className="fa fa-angle-up"></i> {L('HideAdvancedFilters')}
                                  </>
                                ) : (
                                  <>
                                    <i className="fa fa-angle-down"></i> {L('ShowAdvancedFilters')}
                                  </>
                                )}
                              </span>
                            </Col>
                  {this.state.showAdvancedFilters && (
                     <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                         <Col md={{ span: 12 }}>
                            <label className="form-label">{L("Code")}</label>
                            <Input
                            //placeholder={L('Buyer Name Filter')}
                            value = {this.state.codeFilter}
                            onChange={(e) => this.handleCodeSearch(e.target.value)}
                            />
                          </Col>
                          <Col md={{ span: 12 }}>
                           <label className="form-label">{L("Description")}</label>
                           <Input
                            //placeholder={L('Buyer Name Filter')}
                            value = {this.state.descriptionFilter}
                            onChange={(e) => this.handleDescriptionSearch(e.target.value)}
                            />
                          </Col>
                             {/* Reset Button */}
                              <Col md={24} style={{ textAlign: "right", marginTop: 20 }}>
                                <Button type="default" onClick={this.resetFilters}>
                                  {L("Reset")}
                                </Button>
                              </Col>                       
    </Row>
  )}
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
              rowKey={(record) => record.SupplierRejection?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: supplierRejections === undefined ? 0 : supplierRejections.totalCount, defaultCurrent: 1 }}
              loading={supplierRejections === undefined ? true : false}
              dataSource={supplierRejections === undefined ? [] : supplierRejections.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateSupplierRejections
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
          supplierRejectionStore={this.props.supplierRejectionStore}
        />
      </Card>
    );
  }
}

export default SupplierRejection;

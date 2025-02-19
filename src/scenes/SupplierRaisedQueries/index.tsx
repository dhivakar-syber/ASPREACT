import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateSupplierRaisedQueries from './components/createOrUpdateSupplierRaisedQueries';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import supplierRaisedQueryStore from '../../stores/supplierRaisedQueryStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import sessionService from '../../services/session/sessionService';

// const userPermissions = ["Pages.Administration.SupplierRaisedQueries.Create", "Pages.Administration.SupplierRaisedQueries.Edit","Pages.Administration.SupplierRaisedQueries.Delete"];
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

hasPermission("Pages.Administration.SupplierRaisedQueries").then(hasPerm => {
  console.log('is',hasPerm);  // true or false based on the session data
});


export interface ISupplierRaisedQueryProps {
    supplierRaisedQueryStore: supplierRaisedQueryStore;
}

export interface ISupplierRaisedQueryState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  buyerRemarksFilter:string;
  statusFilter:string;
  attachementFilter:string;
  partPartNoFilter:string;
  buyerNameFilter:string;
  supplierNameFilter:string;
  showAdvancedFilters: boolean;
  hasCreatePermission: boolean;
  hasDeletePermission: boolean;
  hasEditPermission: boolean;
}
type LookupItem = {
  id: number;
  displayName: string;
};
type SupplierLookupItem = {
  id: number;
  displayName: string;
};
type BuyerLookupItem = {
  id: number;
  displayName: string;
};
const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.SupplierRaisedQueryStore)
@observer
class SupplierRaisedQuery extends AppComponentBase<ISupplierRaisedQueryProps, ISupplierRaisedQueryState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    buyerRemarksFilter:'',
    statusFilter:'',
    attachementFilter:'',
    partPartNoFilter:'',
    buyerNameFilter:'',
    supplierNameFilter:'',
    showAdvancedFilters: false,
    hasCreatePermission: false,
    hasDeletePermission: false,
    hasEditPermission: false,
    selectedLookupItem: null as LookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
  };

  async componentDidMount() {
    await this.getAll();
    await this.checkPermissions();
  }

  checkPermissions = async () => {
    const hasPermissionCreate = await hasPermission("Pages.Administration.SupplierRaisedQueries.Create");
    this.setState({ hasCreatePermission: hasPermissionCreate });
    const hasPermissionDelete = await hasPermission("Pages.Administration.SupplierRaisedQueries.Delete");
    this.setState({ hasDeletePermission: hasPermissionDelete });
    const hasPermissionEdit = await hasPermission("Pages.Administration.SupplierRaisedQueries.Edit");
    this.setState({ hasEditPermission: hasPermissionEdit });
  };
  async getAll() {
    if (!this.props.supplierRaisedQueryStore) {
        console.error('supplierRaisedQueryStore is undefined');
        return;
    }

        const filters = {
          maxResultCount: this.state.maxResultCount,
          skipCount: this.state.skipCount,
          keyword: this.state.filter, // global filter (if any)
          filter: this.state.filter,
          buyerRemarksFilter:this.state.buyerRemarksFilter,
          statusFilter:this.state.statusFilter,
          attachementFilter:this.state.attachementFilter,
          partPartNoFilter:this.state.partPartNoFilter,
          buyerNameFilter:this.state.buyerNameFilter,
          supplierNameFilter:this.state.supplierNameFilter,
          
        }
        await this.props.supplierRaisedQueryStore.getAll(filters);
    //await this.props.supplierRaisedQueryStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
      await this.props.supplierRaisedQueryStore.createSupplierRaisedQuery();
    } else {
      await this.props.supplierRaisedQueryStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.supplierRaisedQueryStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.supplierRaisedQueryStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  
  resetFilters = () => {
    this.setState({
      buyerRemarksFilter:'',
      statusFilter:'',
      attachementFilter:'',
      partPartNoFilter:'',
      buyerNameFilter:'',
      supplierNameFilter:'',      

},
  
    () => {
      this.getAll(); // Call the data-refresh function after resetting the filters
    }
  );
};
editdata:any = null;
  handleCreate = () => {
    const form = this.formRef.current;
    const { selectedLookupItem } = this.state;
    if (selectedLookupItem?.id) { 
      form?.setFieldsValue({ partId: selectedLookupItem.id });
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
        await this.props.supplierRaisedQueryStore.create(values);
      } else {
        await this.props.supplierRaisedQueryStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };
  handleBuyerRemarksSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ buyerRemarksFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.buyerRemarksFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleStatusSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ statusFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.statusFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleAttachmentSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ attachementFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.attachementFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handlePartNoSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ partPartNoFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.partPartNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleBuyerNameSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ buyerNameFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.buyerNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleSupplierNameSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ supplierNameFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.supplierNameFilter); // Verify the state update
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
    console.log(this.props.supplierRaisedQueryStore);
    const { supplierRaisedQuery } = this.props.supplierRaisedQueryStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.supplierRaisedQuery?.id })}>{L('Edit')}</Menu.Item>)}
                        {hasDeletePermission && (
                      <Menu.Item onClick={() => this.delete({ id: item.supplierRaisedQuery?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('ContractValidFrom'), dataIndex: 'supplierRaisedQuery.contractValidFrom', key: 'contractValidFrom', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRaisedQuery?.contractValidFrom || ''}</div> },
      { title: L('ContractValidTo'), dataIndex: 'supplierRaisedQuery.contractValidTo', key: 'contractValidTo', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRaisedQuery?.contractValidTo || ''}</div> },
        { title: L('TotalGRNQty'), dataIndex: 'supplierRaisedQuery.totalGRNQty', key: 'totalGRNQty', width: 150, render: (text: string, record: any) =>
            <div>{record.supplierRaisedQuery?.totalGRNQty || ''}</div> },
      { title: L('TotalCBFCPaindAmount'), dataIndex: 'supplierRaisedQuery.totalCBFCPaindAmount', key: 'totalCBFCPaindAmount', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRaisedQuery?.totalCBFCPaindAmount || ''}</div> },
      { title: L('RejectionReason'), dataIndex: 'supplierRaisedQuery.rejectionReason', key: 'rejectionReason', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRaisedQuery?.rejectionReason || ''}</div> },
      { title: L('BuyerRemarks'), dataIndex: 'supplierRaisedQuery.buyerRemarks', key: 'buyerRemarks', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRaisedQuery?.buyerRemarks || ''}</div> },
      { title: L('Status'), dataIndex: 'supplierRaisedQuery.status', key: 'status', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRaisedQuery?.status || ''}</div> },
      { title: L('Attachment'), dataIndex: 'supplierRaisedQuery.attachment', key: 'attachment', width: 150, render: (text: string, record: any) =>
        <div>{record.supplierRaisedQuery?.attachment || ''}</div> },
      { title: L('PartNo'), dataIndex: 'partPartNo', key: 'partFk.partNo', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('BuyerName'), dataIndex: 'buyerName', key: 'buyerFk.name', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('SupplierName'), dataIndex: 'supplierName', key: 'supplierFk.name', width: 150, render: (text: string) => <div>{text}</div> },
      
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
            <h2>{L('SupplierRaisedQuery')}</h2>
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
            <Button type="primary"  icon={<PlusOutlined/>} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-50px'}}>Create Query</Button>)}
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
                         <Col md={{ span: 4 }}>
                            <label className="form-label">{L("Buyer Remarks")}</label>
                            <Input
                            //placeholder={L('Buyer Name Filter')}
                            value = {this.state.buyerRemarksFilter}
                            onChange={(e) => this.handleBuyerRemarksSearch(e.target.value)}
                            />
                          </Col>
                          <Col md={{ span: 4 }}>
                           <label className="form-label">{L("Buyer Name")}</label>
                           <Input
                            //placeholder={L('Buyer Name Filter')}
                            value = {this.state.buyerNameFilter}
                            onChange={(e) => this.handleBuyerNameSearch(e.target.value)}
                            />
                          </Col>
                             <Col md={{ span: 4 }}>
                                <label className="form-label">{L("Status")}</label>
                                <Input
                                //placeholder={L('Buyer Name Filter')}
                                value = {this.state.statusFilter}
                                onChange={(e) => this.handleStatusSearch(e.target.value)}
                                />
                            </Col>
                            <Col md={{ span: 4 }}>
                               <label className="form-label">{L("Attachment")}</label>
                               <Input
                                //placeholder={L('Buyer Name Filter')}
                                value = {this.state.attachementFilter}
                                onChange={(e) => this.handleAttachmentSearch(e.target.value)}
                                />
                              </Col>
                           <Col md={{ span: 4 }}>
                              <label className="form-label">{L("Part No")}</label>
                              <Input
                              //placeholder={L('Buyer Name Filter')}
                              value = {this.state.partPartNoFilter}
                              onChange={(e) => this.handlePartNoSearch(e.target.value)}
                              />
                            </Col>
                            <Col md={{ span: 4 }}>
                            
                             <label className="form-label">{L("Buyer Name")}</label>
                             <Input
                              //placeholder={L('Buyer Name Filter')}
                              value = {this.state.buyerNameFilter}
                              onChange={(e) => this.handleBuyerNameSearch(e.target.value)}
                              />
                            </Col>                              
                            <Col md={{ span: 4 }}>
                             <label className="form-label">{L("Supplier Name")}</label>
                             <Input
                              //placeholder={L('Buyer Name Filter')}
                              value = {this.state.supplierNameFilter}
                              onChange={(e) => this.handleSupplierNameSearch(e.target.value)}
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
              rowKey={(record) => record.SupplierRaisedQuery?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: supplierRaisedQuery === undefined ? 0 : supplierRaisedQuery.totalCount, defaultCurrent: 1 }}
              loading={supplierRaisedQuery === undefined ? true : false}
              dataSource={supplierRaisedQuery === undefined ? [] : supplierRaisedQuery.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateSupplierRaisedQueries
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
          supplierRaisedQueryStore={this.props.supplierRaisedQueryStore}
        />
      </Card>
    );
  }
}

export default SupplierRaisedQuery;

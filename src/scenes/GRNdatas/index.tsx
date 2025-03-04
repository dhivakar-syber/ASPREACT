
import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, message, Modal, Row, Select, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateGRNData from './components/createOrUpdateGRNData';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import grndataStore from '../../stores/grndataStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { EnumMovementType } from '../../enum'
import sessionService from '../../services/session/sessionService';

// const userPermissions = ["Pages.Administration.GRNMasters.Create", "Pages.Administration.GRNMasters.Edit","Pages.Administration.GRNMasters.Delete"];
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

hasPermission("Pages.Administration.GRNMasters").then(hasPerm => {
  //console.log('is',hasPerm);  // true or false based on the session data
});

export interface IGRNdataProps {
  grndataStore: grndataStore;
}

export interface IGRNdataState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  descriptionFilter:string;
  movementTypeFilter:number| null;
  invoiceNoFilter:string;
  partPartNoFilter:string;
  supplierNameFilter:string;
  buyerNameFilter:string;
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

@inject(Stores.GRNdataStore)
@observer
class GRNDatas extends AppComponentBase<IGRNdataProps, IGRNdataState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    descriptionFilter:'',
    movementTypeFilter:null as number | null,
    invoiceNoFilter:'',
    partPartNoFilter:'',
    supplierNameFilter:'',
    buyerNameFilter:'',
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
    const hasPermissionCreate = await hasPermission("Pages.Administration.GRNMasters.Create");
    this.setState({ hasCreatePermission: hasPermissionCreate });
    const hasPermissionDelete = await hasPermission("Pages.Administration.GRNMasters.Delete");
    this.setState({ hasDeletePermission: hasPermissionDelete });
    const hasPermissionEdit = await hasPermission("Pages.Administration.GRNMasters.Edit");
    this.setState({ hasEditPermission: hasPermissionEdit });
  };

  async getAll() {
    if (!this.props.grndataStore) {
        console.error('grndatastore is undefined');
        return;
    }
            const filters = {
              maxResultCount: this.state.maxResultCount,
              skipCount: this.state.skipCount,
              keyword: this.state.filter, // global filter (if any)
              filter:this.state.filter,
                descriptionFilter: this.state.descriptionFilter, 
                movementTypeFilter: this.state.movementTypeFilter, 
                invoiceNoFilter: this.state.invoiceNoFilter, 
                partPartNoFilter: this.state.partPartNoFilter, 
                supplierNameFilter: this.state.supplierNameFilter, 
                buyerNameFilter: this.state.buyerNameFilter,
            };
            await this.props.grndataStore.getAll(filters);
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
      await this.props.grndataStore.createGRNData();
    } else {
      await this.props.grndataStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.grndataStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.grndataStore.delete(input);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }

  resetFilters = () => {
    this.setState({
      descriptionFilter: '',
      movementTypeFilter: null,
      invoiceNoFilter: '',
      partPartNoFilter: '',
      buyerNameFilter: '',
      supplierNameFilter: '',
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
        await this.props.grndataStore.create(values);
        message.success("Successfully Created!")
      } else {
        await this.props.grndataStore.update({ ...values, id: this.state.userId });
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

  handleDescriptionSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ descriptionFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.descriptionFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleMovementTypeSearch = (value: number) => {
    this.setState({ movementTypeFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.movementTypeFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleInvoiceNoSearch = (value: string) => {
    this.setState({ invoiceNoFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.invoiceNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handlePartPartNoSearch = (value: string) => {
    this.setState({ partPartNoFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.partPartNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleSupplierNameSearch = (value: string) => {
    this.setState({ supplierNameFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.supplierNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleBuyerNameSearch = (value: string) => {
    this.setState({ buyerNameFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.buyerNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleFileUpload = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      this.props.grndataStore.importExcel(file);
    }
  };

  public render() {
    //console.log(this.props.grndataStore);
    const { grndata } = this.props.grndataStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.grnMaster?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasDeletePermission && (
                      <Menu.Item onClick={() => this.delete({ id: item.grnMaster?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('Description'), dataIndex: 'grnMaster.description', key: 'description', width: 150, render: (text: string, record: any) =>
        <div>{record.grnMaster?.description || ''}</div> },
      { title: L('InvoiceNo'), dataIndex: 'grnMaster.invoiceNo', key: 'invoiceNo', width: 150, render: (text: string, record: any) =>
        <div>{record.grnMaster?.invoiceNo || ''}</div> },
      { title: L('InvoiceDate'), dataIndex: 'grnMaster.invoiceDate', key: 'invoiceDate', width: 150, render: (text: string, record: any) =>
        <div>{record.grnMaster?.invoiceDate || ''}</div> },
      { title: L('Quantity'), dataIndex: 'grnMaster.quantity', key: 'quantity', width: 150, render: (text: string, record: any) =>
        <div>{record.grnMaster?.quantity || ''}</div> },
      { title: L('MovementType'), dataIndex: 'grnMaster.movementType', key: 'movementType', width: 150, render: (text: string, record: any) => {
        const movementTypevalue = record.grnMaster?.movementType;
        const movementTypeText = EnumMovementType[movementTypevalue] || '';
        return <div>{movementTypeText}</div>;
    } },
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
            <h2>{L('GRNdata')}</h2>
          </Col>
              <Col
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
                          {/* <Menu.Item onClick={this.handleexcelexport}>
                            {L('ExportExcel')}
                          </Menu.Item> */}
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
                    <br />
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >

            {hasCreatePermission && (
            <Button type="primary"  icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-50px'}}>Create GRNDatas</Button>)}
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
                    <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
                      <Col md={{ span: 4 }}>
                          <label className="form-label">{L("Description")}</label>
                        <Input
                          //placeholder={L('Description Filter')}
                          value={this.state.descriptionFilter}
                          onChange={(e) => this.handleDescriptionSearch(e.target.value)}
                        />
                      </Col>
                      <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Movement Type")}</label>
                      <Select
                          //placeholder={L("Transaction Filter")}
                          value={this.state.movementTypeFilter?.toString()}
                        onChange={(value) => this.handleMovementTypeSearch(Number(value))}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="0">{L("Inward")}</Select.Option>
                        <Select.Option value="1">{L("Return")}</Select.Option>
                      </Select>
                      </Col>
                      <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Invoice No")}</label>
                        <Input
                          //placeholder={L('Department Filter')}
                          value={this.state.invoiceNoFilter}
                          onChange={(e) => this.handleInvoiceNoSearch(e.target.value)}
                        />
                      </Col>
                      <Col md={{ span: 4 }}>
                      <label className="form-label">{L("part No")}</label>
                        <Input
                          //placeholder={L('Part No Filter')}
                          value={this.state.partPartNoFilter}
                          onChange={(e) => this.handlePartPartNoSearch(e.target.value)}
                        />
                      </Col>
                      <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Supplier Name")}</label>
                        <Input
                          value={this.state.supplierNameFilter}
                          //placeholder={L('Supplier Name Filter')}
                          onChange={(e) => this.handleSupplierNameSearch(e.target.value)}
                        />
                      </Col>
                      <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Buyer Name")}</label>
                        <Input
                           value={this.state.buyerNameFilter}
                          //placeholder={L('Buyer Name Filter')}
                          onChange={(e) => this.handleBuyerNameSearch(e.target.value)}
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
              rowKey={(record) => record.GRNdata?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: grndata === undefined ? 0 : grndata.totalCount, defaultCurrent: 1 }}
              loading={grndata === undefined ? true : false}
              dataSource={grndata === undefined ? [] : grndata.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateGRNData
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
          grndataStore={this.props.grndataStore}
        />
        </Card>
      );
    }
  }

export default GRNDatas;



 


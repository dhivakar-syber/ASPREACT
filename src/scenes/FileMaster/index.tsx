
import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, InputNumber, Menu, message, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateGRNData from './Components/createOrUpdateFileMaster';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import fileMasterStore from '../../stores/fileMasterStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import sessionService from '../../services/session/sessionService';
//import { EnumMovementType } from '../../enum'

// const userPermissions = ["Pages.Administration.FileMasters.Create", "Pages.Administration.FileMasters.Edit","Pages.Administration.FileMasters.Delete"];
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

hasPermission("Pages.Administration.FileMasters").then(hasPerm => {
  //console.log('is',hasPerm);  // true or false based on the session data
});


export interface IFileMasterdataProps {
  filemasterStore: fileMasterStore;
}

export interface IfileMasterState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  MaxAnnexureIdFilter: number | null;
  MinAnnexureIdFilter: number | null;
  MaxSupplementaryIdFilter: number | null;
  MinSupplementaryIdFilter: number | null;
  FileNameFilter: number | null; // Updated to string since it's a file name
  TokenFilter: string;
  SupplementaryInvoicePathFilter: string;
  AnnecurePathFilter: string;
  PartPartNoFilter: string;
  BuyerNameFilter: string;
  SupplierNameFilter: string;
  showAdvancedFilters: boolean;
  hasCreatePermission: boolean;
  hasDeletePermission: boolean;
  hasEditPermission: boolean;
  selectedLookupItem: LookupItem | null;
  selectedSupplierLookupItem: SupplierLookupItem | null;
  selectedBuyerLookupItem: BuyerLookupItem | null;
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

@inject(Stores.FilemasterStore)
@observer
class FileMaster extends AppComponentBase<IFileMasterdataProps, IfileMasterState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    MaxAnnexureIdFilter: null as number | null,
    MinAnnexureIdFilter: null as number | null,
    MaxSupplementaryIdFilter: null as number | null,
    MinSupplementaryIdFilter: null as number | null,
    FileNameFilter: null as number | null, // Changed initialization to an empty string
    TokenFilter: '',
    SupplementaryInvoicePathFilter: '',
    AnnecurePathFilter: '',
    PartPartNoFilter: '',
    BuyerNameFilter: '',
    SupplierNameFilter: '',
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
    const hasPermissionCreate = await hasPermission("Pages.Administration.FileMasters.Create");
    this.setState({ hasCreatePermission: hasPermissionCreate });
    const hasPermissionDelete = await hasPermission("Pages.Administration.FileMasters.Delete");
    this.setState({ hasDeletePermission: hasPermissionDelete });
    const hasPermissionEdit = await hasPermission("Pages.Administration.FileMasters.Edit");
    this.setState({ hasEditPermission: hasPermissionEdit });
  };

  async getAll() {
    if (!this.props.filemasterStore) {
        console.error('fileMasterStore is undefined');
        return;
    }

    const filters = {
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter, // global filter (if any)
      filter: this.state.filter,
      MaxAnnexureIdFilter: this.state.MaxAnnexureIdFilter,
      MinAnnexureIdFilter: this.state.MinAnnexureIdFilter,
      MaxSupplementaryIdFilter: this.state.MaxSupplementaryIdFilter,
      MinSupplementaryIdFilter: this.state.MinSupplementaryIdFilter,
      FileNameFilter: this.state.FileNameFilter, // Changed initialization to an empty string
      TokenFilter: this.state.TokenFilter,
      SupplementaryInvoicePathFilter: this.state.SupplementaryInvoicePathFilter,
      AnnecurePathFilter: this.state.AnnecurePathFilter,
      PartPartNoFilter: this.state.PartPartNoFilter,
      BuyerNameFilter: this.state.BuyerNameFilter,
      SupplierNameFilter: this.state.SupplierNameFilter,
    }
    await this.props.filemasterStore.getAll(filters);
   // await this.props.filemasterStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
      await this.props.filemasterStore.fileMasterData();
    } else {
      await this.props.filemasterStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.filemasterStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.filemasterStore.delete(input);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }

  resetFilters = () => {
    this.setState({
      //deliveryNoteFilter: '',
      MaxAnnexureIdFilter: null,
      MinAnnexureIdFilter: null,
      MaxSupplementaryIdFilter: null,
      MinSupplementaryIdFilter: null,
      SupplementaryInvoicePathFilter: '',
      FileNameFilter: null,
      TokenFilter: '',
      AnnecurePathFilter: '',
      PartPartNoFilter: '',
      BuyerNameFilter: '',
      SupplierNameFilter: '',

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
        await this.props.filemasterStore.create(values);
        message.success("Successfully Created!")
      } else {
        await this.props.filemasterStore.update({ ...values, id: this.state.userId });
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

  handleMaxAnnexureIdSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ MaxAnnexureIdFilter: Number(value) }, () => {
      //console.log('Updated nameFilter:', this.state.MaxAnnexureIdFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleMinAnnexureIdSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ MinAnnexureIdFilter: Number(value) }, () => {
      //console.log('Updated nameFilter:', this.state.MinAnnexureIdFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleMaxSupplementaryIdSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ MaxSupplementaryIdFilter: Number(value) }, () => {
      //console.log('Updated nameFilter:', this.state.MaxSupplementaryIdFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleMinSupplementaryIdSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ MinSupplementaryIdFilter: Number(value) }, () => {
      //console.log('Updated nameFilter:', this.state.MinSupplementaryIdFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleFileNameSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ FileNameFilter: Number(value) }, () => {
      //console.log('Updated nameFilter:', this.state.FileNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleTokenSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ TokenFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.TokenFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleSupplementaryPathSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ SupplementaryInvoicePathFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.SupplementaryInvoicePathFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleAnnexurePathSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ AnnecurePathFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.AnnecurePathFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handlePartNoSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ PartPartNoFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.PartPartNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleBuyerNameSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ BuyerNameFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.BuyerNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handleSupplierNameSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ SupplierNameFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.SupplierNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  // handleFileUpload = (event:any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.props.fileMasterStore.importExcel(file);
  //   }
  // };

  public render() {
    //console.log(this.props.filemasterStore);
    const { fileMaster } = this.props.filemasterStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.fileMaster?.id })}>{L('Edit')}</Menu.Item>)}
                       {hasDeletePermission && (
                      <Menu.Item onClick={() => this.delete({ id: item.fileMaster?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('AnnexureId'), dataIndex: 'fileMaster.annexureId', key: 'annexureId', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.annexureId || ''}</div> },
      { title: L('SupplementaryId'), dataIndex: 'fileMaster.supplementaryId', key: 'supplementaryId', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.supplementaryId || ''}</div> },
      { title: L('FileName'), dataIndex: 'fileMaster.fileName', key: 'fileName', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.fileName || ''}</div> },
      { title: L('Token'), dataIndex: 'fileMaster.token', key: 'token', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.token || ''}</div> },
      { title: L('SupplementaryInvoicePath'), dataIndex: 'fileMaster.supplementaryInvoicePath', key: 'supplementaryInvoicePath', width: 150, render: (text: string, record: any) =>
       <div>{record.fileMaster?.supplementaryInvoicePath || ''}</div> },
      { title: L('AnnexurePath'), dataIndex: 'fileMaster.annexurePath', key: 'annexurePath', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.annexurePath || ''}</div> },      
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
            <h2>{L('FileMasterData')}</h2>
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
            <Button type="primary"  icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-100px'}}>Create FileMaster</Button>)}
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
                         <Col md={9}>
                    <div className="my-3">
                      <label className="form-label">{L("Annexure Id")}</label>
                      <div className="input-group">
                        <InputNumber
                          placeholder={L("Min Value")}
                          value={this.state.MaxAnnexureIdFilter?? undefined} 

                          onChange={(value) => this.handleMaxAnnexureIdSearch(value?.toString() || "")}
                          style={{ width: "40%" }}
                        />
                        <InputNumber
                          placeholder={L("Max Value")}
                          value={this.state.MinAnnexureIdFilter?? undefined} 
                          onChange={(value) => this.handleMinAnnexureIdSearch(value?.toString() || "")}
                          style={{ width: "40%", marginLeft: "10px" }}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md={9}>
                    <div className="my-3">
                      <label className="form-label">{L("Supplementary Id")}</label>
                      <div className="input-group">
                        <InputNumber
                          placeholder={L("Min Value")}
                          value={this.state.MaxSupplementaryIdFilter?? undefined} 
                          onChange={(value) => this.handleMaxSupplementaryIdSearch(value?.toString() || "")}
                          style={{ width: "40%" }}
                        />
                        <InputNumber
                          placeholder={L("Max Value")}
                          value={this.state.MinSupplementaryIdFilter?? undefined} 
                          onChange={(value) => this.handleMinSupplementaryIdSearch(value?.toString() || "")}
                          style={{ width: "40%", marginLeft: "10px" }}
                        />
                      </div>
                    </div>
                  </Col>
                     <Col md={5}>
                       <div className="my-3">
                         <label className="form-label">{L("File Name")}</label>
                         <Input
                           //placeholder={L("Part No Filter")}
                           value={this.state.FileNameFilter?.toString()}
                           onChange={(value) => this.handleFileNameSearch(value?.toString() || "")}
                         />
                       </div>
                     </Col>
                     <Col md={5}>
                       <div className="my-3">
                         <label className="form-label">{L("Token")}</label>
                         <Input
                           //placeholder={L("Part No Filter")}
                           value={this.state.TokenFilter}
                           onChange={(e) => this.handleTokenSearch(e.target.value)}
                         />
                       </div>
                     </Col>
                     <Col md={5}>
                       <div className="my-3">
                         <label className="form-label">{L("Annexure Path")}</label>
                         <Input
                           //placeholder={L("Part No Filter")}
                           value={this.state.AnnecurePathFilter}
                           onChange={(e) => this.handleAnnexurePathSearch(e.target.value)}
                         />
                       </div>
                     </Col>
                     <Col md={5}>
                       <div className="my-3">
                         <label className="form-label">{L("Supplementary Path")}</label>
                         <Input
                           //placeholder={L("Part No Filter")}
                           value={this.state.SupplementaryInvoicePathFilter}
                           onChange={(e) => this.handleSupplementaryPathSearch(e.target.value)}
                         />
                       </div>
                     </Col>
                        <Col md={5}>
                          <div className="my-3">
                            <label className="form-label">{L("Part No")}</label>
                            <Input
                              //placeholder={L("Part No Filter")}
                              value={this.state.PartPartNoFilter}
                              onChange={(e) => this.handlePartNoSearch(e.target.value)}
                            />
                          </div>
                        </Col>
                     
                        {/* Buyer Filter */}
                        <Col md={5}>
                          <div className="my-3">
                            <label className="form-label">{L("Buyer Name")}</label>
                            <Input
                              //placeholder={L("Buyer Filter")}
                              value={this.state.BuyerNameFilter}
                              onChange={(e) => this.handleBuyerNameSearch(e.target.value)}
                            />
                          </div>
                        </Col>
                     
                        {/* Supplier Filter */}
                        <Col md={5}>
                          <div className="my-3">
                            <label className="form-label">{L("Supplier Name")}</label>
                            <Input
                              //placeholder={L("Supplier Filter")}
                              value={this.state.SupplierNameFilter}
                              onChange={(e) => this.handleSupplierNameSearch(e.target.value)}
                            />
                          </div>
                        </Col>
                         {/* Reset Button */}
                         <Col md={24} style={{ textAlign: "right", marginTop: 20 }}>
                           <Button type="default" onClick={this.resetFilters}>
                             {L("Reset")}
                           </Button>
                         </Col>
 </Row> 
  )}
  </Row>        <Row style={{ marginTop: 20 }}>
          <Col
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
            xl={{ span: 24, offset: 0 }}
            xxl={{ span: 24, offset: 0 }}
          >
            <Table
              rowKey={(record) => record.FileMaster?.Id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: fileMaster === undefined ? 0 : fileMaster.totalCount, defaultCurrent: 1 }}
              loading={fileMaster === undefined ? true : false}
              dataSource={fileMaster === undefined ? [] : fileMaster.items}
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
          fileMasterStore={this.props.filemasterStore}
        />
      </Card>
    );
  }
}

export default FileMaster;



 


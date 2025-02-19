import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Select, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateAnnexureDetails from './components/createOrUpdateAnnexureDetails';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import annexureDetailsStore from '../../stores/annexureDetailsStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { EnumCurrency } from '../../../src/enum'
import sessionService from '../../services/session/sessionService';

// const userPermissions = ["Pages.Administration.AnnexureDetails.Create", "Pages.Administration.AnnexureDetails.Edit","Pages.Administration.AnnexureDetails.Delete"];
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

hasPermission("Pages.Administration.AnnexureDetails").then(hasPerm => {
  console.log('is',hasPerm);  // true or false based on the session data
});


export interface IAnnexureDetailsProps {
  annexureDetailsStore: annexureDetailsStore;
}

export interface IAnnexureDetailsState {
  modalVisible: boolean;
  maxResultCount: number|null;
  skipCount: number|null;
  userId: number|null;
  filter: string;
  invoiceNoFilter:string,
  minInvoiceDateFilter:Date | null,
  maxInvoiceDateFilter:Date | null,
  maxContractValidFromFilter:Date | null,
  minContractValidFromFilter:Date | null,
  maxContractValidToFilter:Date | null,
  minContractValidToFilter:Date | null,
  contractNoFilter:string,
  maxOldValueFilter:number |null,
  minOldValueFilter:number|null,
  maxNewValueFilter:number|null,
  minNewValueFilter:number|null,
  maxDiffValueFilter:number|null,
  minDiffValueFilter:number|null,
  maxQtyFilter:number|null,
  minQtyFilter:number|null,
  maxTotalFilter:number|null,
  minTotalFilter:number|null,
  currencyFilter:number|null,
  supplementaryInvoiceNoFilter:string,
  maxSupplementaryInvoiceDateFilter:Date | null,
  minSupplementaryInvoiceDateFilter:Date | null,
  partPartNoFilter:string,
  buyerNameFilter:string,
  supplierNameFilter:string,
  showAdvancedFilters: boolean,
  hasCreatePermission: boolean,
  hasDeletePermission: boolean,
  hasEditPermission: boolean,
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

@inject(Stores.AnnexureDetailsStore)
@observer
class AnnexureDetails extends AppComponentBase<IAnnexureDetailsProps, IAnnexureDetailsState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    invoiceNoFilter:'',
    minInvoiceDateFilter:null as Date | null,
    maxInvoiceDateFilter:null as Date | null,
    maxContractValidFromFilter:null as Date | null,
    minContractValidFromFilter:null as Date | null,
    maxContractValidToFilter:null as Date | null,
    minContractValidToFilter:null as Date | null,
    contractNoFilter:'',
    maxOldValueFilter:null as number |null,
    minOldValueFilter:null as number|null,
    maxNewValueFilter:null as number|null,
    minNewValueFilter:null as number|null,
    maxDiffValueFilter:null as number|null,
    minDiffValueFilter:null as number|null,
    maxQtyFilter:null as number|null,
    minQtyFilter:null as number|null,
    maxTotalFilter:null as number|null,
    minTotalFilter:null as number|null,
    currencyFilter:null as number|null,
    supplementaryInvoiceNoFilter:'',
    maxSupplementaryInvoiceDateFilter:null as Date | null,
    minSupplementaryInvoiceDateFilter:null as Date | null,
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
    const hasPermissionCreate = await hasPermission("Pages.Administration.AnnexureDetails.Create");
    this.setState({ hasCreatePermission: hasPermissionCreate });
    const hasPermissionDelete = await hasPermission("Pages.Administration.AnnexureDetails.Delete");
    this.setState({ hasDeletePermission: hasPermissionDelete });
    const hasPermissionEdit = await hasPermission("Pages.Administration.AnnexureDetails.Edit");
    this.setState({ hasEditPermission: hasPermissionEdit });
  };

  async getAll() {
    if (!this.props.annexureDetailsStore) {
        console.error('annexureDetailsStore is undefined');
        return;
    }
    const filters = {
      filter:this.state.filter,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter, // global filter (if any)
      invoiceNoFilter :this.state.invoiceNoFilter,
      contractNoFilter:this.state.contractNoFilter,
      currencyFilter:this.state.currencyFilter,
      supplementaryInvoiceNoFilter:this.state.supplementaryInvoiceNoFilter,
      partPartNoFilter:this.state.partPartNoFilter,
      buyerNameFilter:this.state.buyerNameFilter,
      supplierNameFilter:this.state.supplierNameFilter
    }
    await this.props.annexureDetailsStore.getAll(filters);
    //await this.props.annexureDetailsStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
      await this.props.annexureDetailsStore.createAnnexureDetail();
    } else {
      await this.props.annexureDetailsStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.annexureDetailsStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.annexureDetailsStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  
  resetFilters = () => {
    this.setState({
      supplementaryInvoiceNoFilter:'',    
      partPartNoFilter:'',
      buyerNameFilter:'',
      supplierNameFilter:'',
      currencyFilter:-1,
      contractNoFilter:'',
      invoiceNoFilter:'',
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
        await this.props.annexureDetailsStore.create(values);
      } else {
        await this.props.annexureDetailsStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  handleInvoiceNoSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ invoiceNoFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.invoiceNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  // handleMinDeliveryNoteSearch = (date: Moment | null, dateString: string) => {
  //   // If a valid date is selected, it will be a Moment object
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ minInvoiceDateFilter: dateValue }, () => {
  //     console.log('Updated minDeliveryNoteDateFilter:', this.state.minInvoiceDateFilter);
  //     this.getAll();
  //   });
  // };
  
  // handleMaxInvoiceDateSearch = (date: Moment | null, dateString: string) => {
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ maxInvoiceDateFilter: dateValue }, () => {
  //     console.log('Updated maxDeliveryNoteDateFilter:', this.state.maxInvoiceDateFilter);
  //     this.getAll();
  //   });
  // };
  // handleMaxContractValidFromSearch = (date: Moment | null, dateString: string) => {
  //   // If a valid date is selected, it will be a Moment object
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ maxContractValidFromFilter: dateValue }, () => {
  //     console.log('Updated minDeliveryNoteDateFilter:', this.state.maxContractValidFromFilter);
  //     this.getAll();
  //   });
  // };

  
  // handleMaxDeliveryNoteSearch = (date: Moment | null, dateString: string) => {
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ minContractValidToFilter: dateValue }, () => {
  //     console.log('Updated maxDeliveryNoteDateFilter:', this.state.minContractValidToFilter);
  //     this.getAll();
  //   });
  // };
  // handleMaxContractValidFromSearch = (date: Moment | null, dateString: string) => {
  //   // If a valid date is selected, it will be a Moment object
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ maxContractValidToFilter: dateValue }, () => {
  //     console.log('Updated minDeliveryNoteDateFilter:', this.state.maxContractValidToFilter);
  //     this.getAll();
  //   });
  // };

  
  // handleMaxDeliveryNoteSearch = (date: Moment | null, dateString: string) => {
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ minContractValidToFilter: dateValue }, () => {
  //     console.log('Updated maxDeliveryNoteDateFilter:', this.state.minContractValidToFilter);
  //     this.getAll();
  //   });
  // };
  
  handleContractNoSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ contractNoFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.contractNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  
  handleCurrencySearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ currencyFilter: Number(value) }, () => {
      console.log('Updated nameFilter:', this.state.currencyFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ maxOldValueFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.maxOldValueFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ minOldValueFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.minOldValueFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ maxNewValueFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.maxNewValueFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ minNewValueFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.minNewValueFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ maxDiffValueFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.maxDiffValueFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ minDiffValueFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.minDiffValueFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ maxQtyFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.maxQtyFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ minQtyFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.minQtyFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ maxTotalFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.maxTotalFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ minTotalFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.minTotalFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  // handleMovementTypeSearch = (value: number) => {
  //   this.setState({ currencyFilter: value }, () => {
  //     console.log('Updated nameFilter:', this.state.currencyFilter); // Verify the state update
  //     this.getAll(); // Correctly call getAll() after the state update
  //   });
  // };
  handleSupplementarySearch = (value: string) => {
    this.setState({ supplementaryInvoiceNoFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.supplementaryInvoiceNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handlePartPartNoSearch = (value: string) => {
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
    console.log(this.props.annexureDetailsStore);
    const { annexureDetail } = this.props.annexureDetailsStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.annexureDetail?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasDeletePermission && (
                      <Menu.Item onClick={() => this.delete({ id: item.annexureDetail?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('InvoiceNo'), dataIndex: 'annexureDetail.invoiceNo', key: 'invoiceNo', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.invoiceNo || ''}</div> },
      { title: L('InvoiceDate'), dataIndex: 'annexureDetail.invoiceDate', key: 'invoiceDate', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.invoiceDate || ''}</div> },
      { title: L('ContractValidFrom'), dataIndex: 'annexureDetail.contractValidFrom', key: 'contractValidFrom', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.contractValidFrom || ''}</div> },
      { title: L('ContractValidTo'), dataIndex: 'annexureDetail.contractValidTo', key: 'contractValidTo', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.contractValidTo || ''}</div> },
      { title: L('ContractNo'), dataIndex: 'annexureDetail.contractNo', key: 'contractNo', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.contractNo || ''}</div> },
      { title: L('OldValue'), dataIndex: 'annexureDetail.oldValue', key: 'oldValue', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.oldValue || ''}</div> },
      { title: L('NewValue'), dataIndex: 'annexureDetail.newValue', key: 'newValue', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.newValue || ''}</div> },
      { title: L('DiffValue'), dataIndex: 'annexureDetail.diffValue', key: 'diffValue', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.diffValue || ''}</div> },
      { title: L('qty'), dataIndex: 'annexureDetail.qty', key: 'qty', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.qty || ''}</div> },
      { title: L('Total'), dataIndex: 'annexureDetail.total', key: 'total', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.total || ''}</div> },
        { title: L('Currency'), dataIndex: 'annexureDetail.currency', key: 'currency', width: 150, render: (text: string, record: any) => {
          const currencyvalue = record.annexureDetail?.currency;
          const currencyText = EnumCurrency[currencyvalue] || '';
          return <div>{currencyText}</div>;
      } },
      { title: L('SupplementaryInvoiceNo'), dataIndex: 'annexureDetail.supplementaryInvoiceNo', key: 'supplementaryInvoiceNo', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.supplementaryInvoiceNo || ''}</div> },
      { title: L('SupplementaryInvoiceDate'), dataIndex: 'annexureDetail.supplementaryInvoiceDate', key: 'supplementaryInvoiceDate', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.supplementaryInvoiceDate || ''}</div> },
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
            <h2>{L('AnnexureDetails')}</h2>
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
            <Button type="primary"  icon={<PlusOutlined/>} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-50px'}}>Create Annexure Details</Button>)}
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
               <Col md={5}>
                 <div className="my-3">
                   <label className="form-label">{L("Invoice No")}</label>
                   <Input
                     //placeholder={L("Part No Filter")}
                     value = {this.state.invoiceNoFilter}
                     onChange={(e) => this.handleInvoiceNoSearch(e.target.value)}
                   />
                 </div>
               </Col>

                  <Col md={5}>
                    <div className="my-3">
                      <label className="form-label">{L("Contract No")}</label>
                      <Input
                        //placeholder={L("Part No Filter")}
                        value = {this.state.contractNoFilter}
                        onChange={(e) => this.handleContractNoSearch(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col md={5}>
                    <div className="my-3">
                      <label className="form-label">{L("Currency")}</label>
                      <Select
                        //placeholder={L("Transaction Filter")}
                        value={this.state.currencyFilter?.toString()} 
                        onChange={(value) => this.handleCurrencySearch(value?.toString() || "")}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="0">{L("INR")}</Select.Option>
                        <Select.Option value="1">{L("USD")}</Select.Option>
                      </Select>
                    </div>
                  </Col>

                  <Col md={5}>
                    <div className="my-3">
                      <label className="form-label">{L("Supplementary Invoice No")}</label>
                      <Input
                        //placeholder={L("Part No Filter")}
                        value = {this.state.supplementaryInvoiceNoFilter}
                        onChange={(e) => this.handleSupplementarySearch(e.target.value)}
                      />
                    </div>
                  </Col>

                     {/* Part No Filter */}
                     <Col md={5}>
                       <div className="my-3">
                         <label className="form-label">{L("Part No")}</label>
                         <Input
                           //placeholder={L("Part No Filter")}
                           value = {this.state.partPartNoFilter}
                           onChange={(e) => this.handlePartPartNoSearch(e.target.value)}
                         />
                       </div>
                     </Col>
                  
                     {/* Buyer Filter */}
                     <Col md={5}>
                       <div className="my-3">
                         <label className="form-label">{L("Buyer Name")}</label>
                         <Input
                           //placeholder={L("Buyer Filter")}
                           value = {this.state.buyerNameFilter}
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
                           value = {this.state.supplierNameFilter}
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
              rowKey={(record) => record.AnnexureDetail?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: annexureDetail === undefined ? 0 : annexureDetail.totalCount, defaultCurrent: 1 }}
              loading={annexureDetail === undefined ? true : false}
              dataSource={annexureDetail === undefined ? [] : annexureDetail.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateAnnexureDetails
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
          annexureDetailsStore={this.props.annexureDetailsStore}
        />
      </Card>
    );
  }
}

export default AnnexureDetails;

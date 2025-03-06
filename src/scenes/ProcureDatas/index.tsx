import * as React from 'react';
import { Button, Card, Col, Dropdown, Input, InputNumber, Menu, message, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrEditProcure from './components/createoreditprocuredatas';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import ProcureStore from '../../stores/procuredatastore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import sessionService from '../../services/session/sessionService';
//import * as moment from 'moment-timezone';
//import { Moment } from 'moment-timezone';


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

hasPermission("Pages.Administration.ProcureDatas").then(hasPerm => {
  //console.log('is',hasPerm);  // true or false based on the session data
});


export interface IProcureProps {
  procureStore: ProcureStore;
}

export interface IProcureState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  procureId: number;
  filter: string;

  MaxValidFromFilter:Date | null;
  MinValidFromFilter:Date | null;
  MaxValidToFilter:Date | null;
  MinValidToFilter:Date | null;
  ContractNoFilter:string;
  MaxContractDateFilter:Date | null;
  MinContractDateFilter:Date | null;
  MaxApprovalDateFilter:Date | null;
  MinApprovalDateFilter:Date | null;
  PlantCodeFilter:string;
  MaxVersionNoFilter:number| null;
  MinVersionNoFilter:number | null;
  PartPartNoFilter:string;
  BuyerNameFilter:string;
  SupplierNameFilter:string;
  showAdvancedFilters: boolean,
  hasCreatePermission: boolean;
  hasDeletePermission: boolean;
  hasEditPermission: boolean;
}


const confirm = Modal.confirm;
const Search = Input.Search;
//onst [data, setData] = useState([]);

@inject(Stores.ProcureStore)
@observer
class Procure extends AppComponentBase<IProcureProps, IProcureState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    procureId: 0,
    filter: '',

    MaxValidFromFilter:null as Date | null,
    MinValidFromFilter:null as Date | null,
    MaxValidToFilter:null as Date | null,
    MinValidToFilter:null as Date | null,
    ContractNoFilter:'',
    MaxContractDateFilter:null as Date | null,
    MinContractDateFilter:null as Date | null,
    MaxApprovalDateFilter:null as Date | null,
    MinApprovalDateFilter:null as Date | null,
    PlantCodeFilter:'',
    MaxVersionNoFilter:null as number | null,
    MinVersionNoFilter:null as number | null,
    PartPartNoFilter:'',
    BuyerNameFilter:'',
    SupplierNameFilter:'',
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
    const hasPermissionCreate = await hasPermission("Pages.Administration.ProcureDatas.Create");
    this.setState({ hasCreatePermission: hasPermissionCreate });
    const hasPermissionDelete = await hasPermission("Pages.Administration.ProcureDatas.Delete");
    this.setState({ hasDeletePermission: hasPermissionDelete });
    const hasPermissionEdit = await hasPermission("Pages.Administration.ProcureDatas.Edit");
    this.setState({ hasEditPermission: hasPermissionEdit });
  };
  async getAll() {

     const filters = {
              maxResultCount: this.state.maxResultCount,
              skipCount: this.state.skipCount,
              keyword: this.state.filter, // global filter (if any)
              filter: this.state.filter,
              // MaxValidFromFilter: this.state.MaxValidFromFilter, 
              // MinValidFromFilter: this.state.MinValidFromFilter, 
              // MaxValidToFilter: this.state.MaxValidToFilter, 
              // MinValidToFilter: this.state.MinValidToFilter, 
              ContractNoFilter: this.state.ContractNoFilter, 
              // MaxContractDateFilter: this.state.MaxContractDateFilter,
              // MinContractDateFilter: this.state.MinContractDateFilter,
              // MaxApprovalDateFilter: this.state.MaxApprovalDateFilter,
              // MinApprovalDateFilter: this.state.MinApprovalDateFilter,
              PlantCodeFilter: this.state.PlantCodeFilter,
              MaxVersionNoFilter: this.state.MaxVersionNoFilter,
              MinVersionNoFilter: this.state.MinVersionNoFilter,
              PartPartNoFilter: this.state.PartPartNoFilter,
              BuyerNameFilter: this.state.BuyerNameFilter,
              SupplierNameFilter: this.state.SupplierNameFilter,
            };
            await this.props.procureStore.getAll(filters);
    //await this.props.procureStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
  globalData: any = null;

  async createOrEditeModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
        this.globalData = await this.props.procureStore.createProcure();
     // await this.props.userStore.getRoles();
    } else {
      this.globalData = await this.props.procureStore.get(entityDto);
      //await this.props.userStore.getRoles();
    }

    this.setState({ procureId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.procureStore.editProcure });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.procureStore.delete(input);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }

  resetFilters = () => {
    this.setState({
      ContractNoFilter:'',
      PlantCodeFilter:'',
      MaxVersionNoFilter:null,
      MinVersionNoFilter:null,
      PartPartNoFilter:'',
      BuyerNameFilter:'',
      SupplierNameFilter:'',
    },
  
    () => {
      this.getAll(); // Call the data-refresh function after resetting the filters
    }
  );
};

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.procureId === 0) {
        await this.props.procureStore.create(values);
        message.success("Successfully Created!")
      } else {
        await this.props.procureStore.update({ ...values, id: this.state.procureId });
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

  // handleMaxValidFromFilterSearch = (date: Moment | null, dateString: string) => {
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to Date
  //   this.setState({ MaxValidFromFilter: dateValue }, () => {
  //     //console.log("Updated MaxValidFromFilter:", this.state.MaxValidFromFilter);
  //     this.getAll(); // Call API or refresh data
  //   });
  // };
  
  // handleMinValidFromFilterSearch = (date: Moment | null, dateString: string) => {
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to Date
  //   this.setState({ MinValidFromFilter: dateValue }, () => {
  //     //console.log("Updated MinValidFromFilter:", this.state.MinValidFromFilter);
  //     this.getAll();
  //   });
  // };
  
  // handleMaxValidToFilterSearch = (date: Moment | null, dateString: string) => {
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to Date
  //   this.setState({ MaxValidToFilter: dateValue }, () => {
  //     //console.log("Updated MaxValidToFilter:", this.state.MaxValidToFilter);
  //     this.getAll();
  //   });
  // };
  
  // handleMinValidToFilterSearch = (date: Moment | null, dateString: string) => {
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to Date
  //   this.setState({ MinValidToFilter: dateValue }, () => {
  //     //console.log("Updated MinValidToFilter:", this.state.MinValidToFilter);
  //     this.getAll();
  //   });
  // };

  handleContractNoSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ ContractNoFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.ContractNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  // handleMaxContractDateSearch = (date: Moment , dateString: string) => {
  //   // Update the state and call getAll() once the state is updated
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ MaxContractDateFilter: dateValue }, () => {
  //     //console.log('Updated minDeliveryNoteDateFilter:', this.state.MaxContractDateFilter);
  //     this.getAll();
  //   });
  // };
  // handleMinContractDateSearch = (date: Moment , dateString: string) => {
  //   // If a valid date is selected, it will be a Moment object
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ MinContractDateFilter: dateValue }, () => {
  //     //console.log('Updated minDeliveryNoteDateFilter:', this.state.MinContractDateFilter);
  //     this.getAll();
  //   });
  // };
  // handleMaxApprovalDateSearch = (date: Moment | null, dateString: string) => {
  //   // Update the state and call getAll() once the state is updated
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ MaxApprovalDateFilter: dateValue }, () => {
  //     //console.log('Updated minDeliveryNoteDateFilter:', this.state.MaxApprovalDateFilter);
  //     this.getAll();
  //   });
  // };
  // handleMinApprovalDateSearch = (date: Moment | null, dateString: string) => {
  //   // If a valid date is selected, it will be a Moment object
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ MinApprovalDateFilter: dateValue }, () => {
  //     //console.log('Updated minDeliveryNoteDateFilter:', this.state.MinApprovalDateFilter);
  //     this.getAll();
  //   });
  // };

  handlePlantCodeSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ PlantCodeFilter: value }, () => {
      //console.log('Updated nameFilter:', this.state.PlantCodeFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleMaxVersionNoSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ MaxVersionNoFilter: Number(value) }, () => {
      //console.log('Updated nameFilter:', this.state.MaxVersionNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleMinVersionNoSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ MinVersionNoFilter: Number(value) }, () => {
      //console.log('Updated nameFilter:', this.state.MinVersionNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };



  handlePartPartNoSearch = (value: string) => {
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
  // handleexcelexport = () =>{
  //   this.props.procureStore.getExcelExport();
  // }
  
  
   handleFileUpload = (event:any) => {
      const file = event.target.files[0];
      if (file) {
        this.props.procureStore.importExcel(file);
      }
    };
  
   
   globalProcureData: any = null;

  public render() {
    const { procure } = this.props.procureStore;
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
                      <Menu.Item onClick={() => this.createOrEditeModalOpen({ id: item.procureData?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasDeletePermission && (
                      <Menu.Item onClick={() => this.delete({ id: item.procureData?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('PartPartNo'), dataIndex: 'partPartNo', key: 'partPartNo', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('Buyer'), dataIndex: 'buyerName', key: 'buyerName', width: 150, render: (text: string) => <div>{text}</div> },
      {title: L('ValidFrom'),dataIndex: 'procureData.validFrom', key: 'validFrom', width: 150, render: (text: string, record: any) => {        
        this.globalProcureData = record.procureData;
          return <div>{record.procureData?.validFrom}</div>;
        },
      },
      { title: L('ValidTo'), dataIndex: 'procureData.validTo', key: 'validTo', width: 150, render: (text: string , record:any) => <div>{record.procureData?.validTo}</div> },
      { title: L('ContractNo'), dataIndex: 'procureData.contractNo', key: 'contractNo', width: 150, render: (text: string,record:any) => <div>{record.procureData?.contractNo}</div> },
      { title: L('ContractDate'), dataIndex: 'procureData.contractDate', key: 'contractDate', width: 150, render: (text: string,record:any) => <div>{record.procureData?.contractDate}</div> },
      { title: L('ApprovalDate'), dataIndex: 'procureData.approvalDate', key: 'approvalDate', width: 150, render: (text: string,record:any) => <div>{record.procureData?.approvalDate}</div> },
      { title: L('PlantCode'), dataIndex: 'procureData.plantCode', key: 'plantCode', width: 150, render: (text: string,record:any) => <div>{record.procureData?.plantCode}</div> },
      { title: L('VersionNo'), dataIndex: 'procureData.versionNo', key: 'versionNo', width: 150, render: (text: string,record:any) => <div>{record.procureData?.versionNo}</div> },

      
     
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
            <h2>{L('ProcureDatas')}</h2>
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
            xxl={{ span: 1, offset: 30 }}
          > 
          {hasCreatePermission && (
          <Button type="primary"   icon={<PlusOutlined />} onClick={() => this.createOrEditeModalOpen({ id: 0 })} style={{marginLeft: '-50px'}}>Create ProcurDatas</Button>)}

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
{/* <Col md={9}>
<div className="my-3">
    <label className="form-label">{L("Valid From Range")}</label>
    <div className="input-group">
      <DatePicker
        placeholder={L("Min Value")}
        //onChange={this.handleMinValidFromFilterSearch}
        style={{ width: "40%" }}
      />
      <span style={{ lineHeight: "40px", padding: "0 15px" }}> &mdash; </span>
      <DatePicker
        placeholder={L("Max Value")}
        //onChange={this.handleMaxValidFromFilterSearch}
        style={{ width: "40%" }}
      />
    </div>
  </div>
</Col>

<Col md={9}>
  <div className="my-3">
    <label className="form-label">{L("Valid To Range")}</label>
    <div className="input-group">
      <DatePicker
        placeholder={L("Min Value")}
        //onChange={(date, dateString) => this.handleMinValidToFilterSearch(date, dateString)}
        style={{ width: "40%" }}
      />
      <span style={{ lineHeight: "40px", padding: "0 15px" }}> &mdash; </span>
      <DatePicker
        placeholder={L("Max Value")}
        //onChange={(date, dateString) => this.handleMaxValidToFilterSearch(date, dateString)}
        style={{ width: "40%" }}
      />
    </div>
  </div>
</Col>

   <Col md={9}>
  <div className="my-3">
    <label className="form-label">{L("Valid to Range")}</label>
    <div className="input-group">
      <DatePicker
        placeholder={L("Min Value")}
        //onChange={(date: Moment | null, dateString: string) => this.handleMaxValidToFilterSearch(date, dateString)}
        style={{ width: "40%" }}
      />
      <span style={{ lineHeight: "40px", padding: "0 15px" }}> &mdash; </span>
      <DatePicker
        placeholder={L("Max Value")}
        //onChange={(date: Moment | null, dateString: string) => this.handleMinValidToFilterSearch(date, dateString)}
        style={{ width: "40%" }}
      />
    </div>
  </div>
</Col> */}

   {/* Part No Filter */}
   <Col md={5}>
     <div className="my-3">
       <label className="form-label">{L("Contract No")}</label>
       <Input
         //placeholder={L("Part No Filter")}
         value={this.state.ContractNoFilter}
         onChange={(e) => this.handleContractNoSearch(e.target.value)}
       />
     </div>
   </Col>

   {/* <Col md={9}>
  <div className="my-3">
    <label className="form-label">{L("Contract Date Range")}</label>
    <div className="input-group">
      <DatePicker
        placeholder={L("Min Value")}
        //onChange={(date: Moment | null, dateString: string) => this.handleMaxContractDateSearch(date, dateString)}
        style={{ width: "40%" }}
      />
      <span style={{ lineHeight: "40px", padding: "0 15px" }}> &mdash; </span>
      <DatePicker
        placeholder={L("Max Value")}
        //onChange={(date: Moment | null, dateString: string) => this.handleMinContractDateSearch(date, dateString)}
        style={{ width: "40%" }}
      />
    </div>
  </div>
</Col>
   <Col md={9}>
  <div className="my-3">
    <label className="form-label">{L("Approval Date Range")}</label>
    <div className="input-group">
      <DatePicker
        placeholder={L("Min Value")}
        //onChange={(date: Moment, dateString: string) => this.handleMaxApprovalDateSearch(date, dateString)}
        style={{ width: "40%" }}
      />
      <span style={{ lineHeight: "40px", padding: "0 15px" }}> &mdash; </span>
      <DatePicker
        placeholder={L("Max Value")}
        //onChange={(date: Moment, dateString: string) => this.handleMinApprovalDateSearch(date, dateString)}
        style={{ width: "40%" }}
      />
    </div>
  </div>
</Col> */}

   {/* Part No Filter */}
   <Col md={5}>
     <div className="my-3">
       <label className="form-label">{L("Plant Code")}</label>
       <Input
         //placeholder={L("Part No Filter")}
         value={this.state.PlantCodeFilter}
         onChange={(e) => this.handlePlantCodeSearch(e.target.value)}
       />
     </div>
   </Col>

   
   {/* Year Filter */}
   <Col md={9}>
    <div className="my-3">
      <label className="form-label">{L("Version No")}</label>
      <div className="input-group">
        <InputNumber
          placeholder={L("Min Value")}
          value={this.state.MaxVersionNoFilter?? undefined}
          onChange={(value) => this.handleMaxVersionNoSearch(value?.toString() || "")}
          style={{ width: "40%" }}
        />
        <InputNumber
          placeholder={L("Max Value")}
          value={this.state.MinVersionNoFilter?? undefined}
          onChange={(value) => this.handleMinVersionNoSearch(value?.toString() || "")}
          style={{ width: "40%", marginLeft: "10px" }}
        />
      </div>
    </div>
  </Col>
   {/* Part No Filter */}
   <Col md={5}>
     <div className="my-3">
       <label className="form-label">{L("Part No")}</label>
       <Input
         //placeholder={L("Part No Filter")}
         value={this.state.PartPartNoFilter}
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
             // rowKey={(record) => record.ProcureData.Id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: procure === undefined ? 0 : procure.totalCount, defaultCurrent: 1 }}
              loading={procure === undefined ? true : false}
              dataSource={procure === undefined ? [] : procure.items}
              onChange={this.handleTableChange}
              scroll={{x: 'max-content'} }
            />
          </Col>
        </Row>
        <CreateOrEditProcure
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.procureId === 0 ? 'edit' : 'create'}
          onCreate ={this.handleCreate}
          initialData = {{
            validFrom: this.globalProcureData?.validFrom,
            validTo: this.globalProcureData?.validFrom,
            contractNo:  this.globalProcureData?.contractNo,
            contractDate:  this.globalProcureData?.ContractDate,
            approvalDate:  this.globalProcureData?.approvalDate,
            plantCode:  this.globalProcureData?.plantCode,
            versionNo:  this.globalProcureData?.versionNo,

           

          }}
          //roles={this.props.procureStore.roles}
        />
      </Card>
    );
  }
}

export default Procure;

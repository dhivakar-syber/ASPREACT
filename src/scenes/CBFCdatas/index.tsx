import * as React from 'react';
import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table,Select, InputNumber} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateCBFCData from './components/createOrUpdateCBFCData';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import cbfcdataStore from '../../stores/cbfcdataStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { EnumCurrency,EnumTransaction } from '../../../src/enum'
//import { Moment } from 'moment-timezone';
//import { useState } from 'react';

export interface ICBFCdataProps {
  cbfcdataStore: cbfcdataStore;
}

export interface ICBFCdataState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number ;
  userId: number| null;
  filter: string;
  deliveryNoteFilter:string;
  minDeliveryNoteDateFilter:Date | null,
  maxDeliveryNoteDateFilter:Date | null,
  currencyFilter:number| null;
  transactionFilter:number| null;
  maxPaidAmountFilter:number| null;
  minPaidAmountFilter:number| null;
  maxYearFilter:number| null;
  minYearFilter:number| null;
  partPartNoFilter:string;
  buyerNameFilter:string;
  supplierNameFilter:string;
  showAdvancedFilters: boolean;
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

@inject(Stores.CBFCdataStore)
@observer
class CBFCDatas extends AppComponentBase<ICBFCdataProps, ICBFCdataState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: null as number | null,
    filter: '',
    deliveryNoteFilter: '',
    minDeliveryNoteDateFilter: null as Date | null,
    maxDeliveryNoteDateFilter: null as Date | null,
    currencyFilter: null as number | null,
    transactionFilter: null as number | null,
    maxPaidAmountFilter: null as number | null,
    minPaidAmountFilter: null as number | null,
    maxYearFilter: null as number | null,
    minYearFilter: null as number | null,
    partPartNoFilter: '',
    buyerNameFilter: '',
    supplierNameFilter: '',
    showAdvancedFilters: false,
    selectedLookupItem: null as LookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
  };
  

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    if (!this.props.cbfcdataStore) {
        console.error('cbfcdatastore is undefined');
        return;
    }

        const filters = {
          maxResultCount: this.state.maxResultCount,
          skipCount: this.state.skipCount,
          keyword: this.state.filter, // global filter (if any)
          deliveryNoteFilter: this.state.deliveryNoteFilter, 
          // minDeliveryNoteDateFilter: this.state.minDeliveryNoteDateFilter, 
          // maxDeliveryNoteDateFilter: this.state.maxDeliveryNoteDateFilter, 
          currencyFilter: this.state.currencyFilter, 
          transactionFilter: this.state.transactionFilter, 
          maxPaidAmountFilter: this.state.maxPaidAmountFilter,
          minPaidAmountFilter: this.state.minPaidAmountFilter,
          partPartNoFilter: this.state.partPartNoFilter,
          buyerNameFilter: this.state.buyerNameFilter,
          supplierNameFilter: this.state.supplierNameFilter,
        };
        await this.props.cbfcdataStore.getAll(filters);
    //await this.props.cbfcdataStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
      await this.props.cbfcdataStore.createCBFCData();
    } else {
      await this.props.cbfcdataStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.cbfcdataStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.cbfcdataStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  resetFilters = () => {
    this.setState({
      deliveryNoteFilter: '',
      minDeliveryNoteDateFilter: null,
      maxDeliveryNoteDateFilter: null,
      currencyFilter: -1,
      transactionFilter: -1,
      maxPaidAmountFilter: null,
      minPaidAmountFilter: null,
      maxYearFilter: null,
      minYearFilter: null,
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
        await this.props.cbfcdataStore.create(values);
      } else {
        await this.props.cbfcdataStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  handleDeliveryNoteSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ deliveryNoteFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.deliveryNoteFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  // handleMinDeliveryNoteSearch = (date: Moment | null, dateString: string) => {
  //   // If a valid date is selected, it will be a Moment object
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ minDeliveryNoteDateFilter: dateValue }, () => {
  //     console.log('Updated minDeliveryNoteDateFilter:', this.state.minDeliveryNoteDateFilter);
  //     this.getAll();
  //   });
  // };
  
  // handleMaxDeliveryNoteSearch = (date: Moment | null, dateString: string) => {
  //   const dateValue = date ? date.toDate() : null; // Convert Moment to native Date
  //   this.setState({ maxDeliveryNoteDateFilter: dateValue }, () => {
  //     console.log('Updated maxDeliveryNoteDateFilter:', this.state.maxDeliveryNoteDateFilter);
  //     this.getAll();
  //   });
  // };
  
  

  handleCurrencySearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ currencyFilter: Number(value) }, () => {
      console.log('Updated nameFilter:', this.state.currencyFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleTransactionSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ transactionFilter: Number(value) }, () => {
      console.log('Updated nameFilter:', this.state.transactionFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleMaxPaidAmountSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ maxPaidAmountFilter: Number(value) }, () => {
      console.log('Updated nameFilter:', this.state.maxPaidAmountFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleMinPaidAmountSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ minPaidAmountFilter: Number(value) }, () => {
      console.log('Updated nameFilter:', this.state.minPaidAmountFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleMaxYearSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ maxYearFilter: Number(value) }, () => {
      console.log('Updated nameFilter:', this.state.maxYearFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };

  handleMinYearSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ minYearFilter: Number(value) }, () => {
      console.log('Updated nameFilter:', this.state.minYearFilter); // Verify the state update
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
  //    this.props.cbfcdataStore.getExcelExport();
  //  }

   handleFileUpload = (event:any) => {
      const file = event.target.files[0];
      if (file) {
        this.props.cbfcdataStore.importExcel(file);
      }
    };

  public render() {
    console.log(this.props.cbfcdataStore);
    const { cbfcdata } = this.props.cbfcdataStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.cbfCdata?.id })}>{L('Edit')}</Menu.Item>
                      <Menu.Item onClick={() => this.delete({ id: item.cbfCdata?.id })}>{L('Delete')}</Menu.Item>
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
      { title: L('DeliveryNote'), dataIndex: 'cbfCdata.deliveryNote', key: 'deliveryNote', width: 150, render: (text: string, record: any) =>
        <div>{record.cbfCdata?.deliveryNote || ''}</div> },
      { title: L('DeliveryNoteDate'), dataIndex: 'cbfCdata.deliveryNoteDate', key: 'deliveryNoteDate', width: 150, render: (text: string, record: any) =>
        <div>{record.cbfCdata?.deliveryNoteDate || ''}</div> },
      { title: L('Currency'), dataIndex: 'cbfCdata.currency', key: 'currency', width: 150, render: (text: string, record: any) => {
        const currencyvalue = record.cbfCdata?.currency;
        const currencyText = EnumCurrency[currencyvalue] || '';
        return <div>{currencyText}</div>;
    } },
      { title: L('Transaction'), dataIndex: 'cbfCdata.transaction', key: 'transaction', width: 150, render: (text: string, record: any) => {
        const transactionValue = record.cbfCdata?.transaction;
        const transactionText = EnumTransaction[transactionValue] || '';
        return <div>{transactionText}</div>;
    } },
      { title: L('PaidAmount'), dataIndex: 'cbfCdata.paidAmount', key: 'paidAmount', width: 150, render: (text: string, record: any) =>
        <div>{record.cbfCdata?.paidAmount || ''}</div> },
      { title: L('Year'), dataIndex: 'cbfCdata.year', key: 'year', width: 150, render: (text: string, record: any) =>
        <div>{record.cbfCdata?.year || ''}</div> },
      { title: L('SupplementarySummaries'), dataIndex: 'supplementarySummaryDisplayProperty', key: 'supplementarySummaryFk.supplementaryInvoiceNo', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('SupplierRejection'), dataIndex: 'supplierRejectionCode', key: 'supplementarySummaryFk.code', width: 150, render: (text: string) => <div>{text}</div> },
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
            <h2>{L('CBFCdata')}</h2>
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
            <Button type="primary"  icon={<PlusOutlined/>} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-50px'}}>Create CBFCDatas</Button>
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
   {/* Delivery Note Filter */}
   <Col md={5}>
     <div className="my-3">
       <label className="form-label">{L("Delivery Note")}</label>
       <Input
         //placeholder={L("Delivery Note Filter")}
         value = {this.state.deliveryNoteFilter}
         onChange={(e) => this.handleDeliveryNoteSearch(e.target.value)}
       />
     </div>
   </Col>

   {/* <Col md={9}>
  <div className="my-3">
    <label className="form-label">{L("Delivery Note Date Range")}</label>
    <div className="input-group">
      <DatePicker
        placeholder={L("Min Value")}
        //onChange={(date: Moment | null, dateString: string) => this.handleMinDeliveryNoteSearch(date, dateString)}
        style={{ width: "40%" }}
      />
      <span style={{ lineHeight: "40px", padding: "0 15px" }}> &mdash; </span>
      <DatePicker
        placeholder={L("Max Value")}
        //onChange={(date: Moment | null, dateString: string) => this.handleMaxDeliveryNoteSearch(date, dateString)}
        style={{ width: "40%" }}
      />
    </div>
  </div>
</Col> */}

   {/* Currency Filter */}
   <Col md={4}>
     <div className="my-3">
       <label className="form-label">{L("Currency")}</label>
       <Select
         //placeholder={L("Currency Filter")}
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

   {/* Transaction Filter */}
   <Col md={5}>
     <div className="my-3">
       <label className="form-label">{L("Transaction")}</label>
       <Select
         //placeholder={L("Transaction Filter")}
         value={this.state.transactionFilter?.toString()} 
         onChange={(value) => this.handleTransactionSearch(value?.toString() || "")}
         style={{ width: "100%" }}
       >
         <Select.Option value="-1">{L("All")}</Select.Option>
         <Select.Option value="0">{L("Credit")}</Select.Option>
         <Select.Option value="1">{L("Debit")}</Select.Option>
       </Select>
     </div>
   </Col>

   {/* Paid Amount Filter */}
<Col md={9}>
  <div className="my-3">
    <label className="form-label">{L("Paid Amount")}</label>
    <div className="input-group">
      <InputNumber
        placeholder={L("Min Value")}
        value={this.state.minPaidAmountFilter ?? undefined}
        onChange={(value) => this.handleMinPaidAmountSearch(value?.toString() || "")}
        style={{ width: "40%" }}
      />
      <InputNumber
        placeholder={L("Max Value")}
        value={this.state.minPaidAmountFilter?? undefined} 
        onChange={(value) => this.handleMaxPaidAmountSearch(value?.toString() || "")}
        style={{ width: "40%", marginLeft: "10px" }}
      />
    </div>
  </div>
 </Col>


   {/* Year Filter */}
   <Col md={9}>
    <div className="my-3">
      <label className="form-label">{L("Year")}</label>
      <div className="input-group">
        <InputNumber
          placeholder={L("Min Value")}
          value={this.state.minYearFilter?? undefined} 
          onChange={(value) => this.handleMinYearSearch(value?.toString() || "")}
          style={{ width: "40%" }}
        />
        <InputNumber
          placeholder={L("Max Value")}
          value={this.state.maxYearFilter?? undefined} 
          onChange={(value) => this.handleMaxYearSearch(value?.toString() || "")}
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
         value={this.state.partPartNoFilter} 
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
         value={this.state.buyerNameFilter} 
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
              rowKey={(record) => record.CBFCdata?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: cbfcdata === undefined ? 0 : cbfcdata.totalCount, defaultCurrent: 1 }}
              loading={cbfcdata === undefined ? true : false}
              dataSource={cbfcdata === undefined ? [] : cbfcdata.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateCBFCData
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
          cbfcdataStore={this.props.cbfcdataStore}
        />
      </Card>
    );
  }
}

export default CBFCDatas;

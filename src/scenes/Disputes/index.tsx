import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateDisputes from './components/createOrUpdateDisputes';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import DisputesStrore from '../../stores/DisputesStrore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
//import { EnumCurrency,EnumTransaction } from '../../../src/enum'

export interface IDisputesProps {
    disputesStore: DisputesStrore;
}

export interface IDisputesdataState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  QueryFilter:string;
  BuyerRemarksFilter:string;
  StatusFilter: number|null;
  SupplementarySummaryDisplayPropertyFilter:string;
  SupplierRejectionCodeFilter:string;
  SupplierCodeFilter:string;
  BuyerShortIdFilter:string;
  SupplementarySummaryId:number|null;
  filterVisible: boolean;
}
type SummariesLookupItem = {
  id: number;
  displayName: string;
};
type RejectionLookupItem = {
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

@inject(Stores.DisputesStore)
@observer
class DisputesDatas extends AppComponentBase<IDisputesProps, IDisputesdataState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    QueryFilter:'',
    BuyerRemarksFilter:'',
    StatusFilter: 0,
    SupplementarySummaryDisplayPropertyFilter:'',
    SupplierRejectionCodeFilter:'',
    SupplierCodeFilter:'',
    BuyerShortIdFilter:'',
    SupplementarySummaryId:0,
    selectedLookupItem: null as SummariesLookupItem | null,
    relectedLookupItem: null as RejectionLookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
    filterVisible:false,
  };

  async componentDidMount() {
    await this.getAll();
  } 

  async getAll() {
    if (!this.props.disputesStore) {
        console.error('cbfcdatastore is undefined');
        return;
    }
    const filter ={
      QueryFilter:this.state.QueryFilter,
      BuyerRemarksFilter:this.state.BuyerRemarksFilter,
      StatusFilter:this.state.StatusFilter,
      SupplementarySummaryDisplayPropertyFilter:this.state.SupplementarySummaryDisplayPropertyFilter,
      SupplierRejectionCodeFilter:this.state.SupplierRejectionCodeFilter,
      SupplierCodeFilter:this.state.SupplierCodeFilter,
      BuyerShortIdFilter:this.state.BuyerShortIdFilter,
      SupplementarySummaryId:this.state.SupplementarySummaryId,
      maxResultCount:this.state.maxResultCount,
      skipCount:this.state.skipCount,
      keyword:this.state.filter,
    }
    await this.props.disputesStore.getAll( filter);

  }

  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };

handleQueryChange = (value: string) => {
  this.setState({QueryFilter:value }, async () => await this.getAll());
};
handleBuyerChange = (value: string) => {
  this.setState({BuyerRemarksFilter:value }, async () => await this.getAll());
};
handleStatusChange = (value: any) => {
  this.setState({StatusFilter:value }, async () => await this.getAll());
};
handleSupplementaryChange = (value: any) => {
  this.setState({SupplementarySummaryDisplayPropertyFilter:value }, async () => await this.getAll());
};
handleRejectionChange = (value: any) => {
  this.setState({SupplierRejectionCodeFilter:value }, async () => await this.getAll());
};
handleCodeChange = (value: any) => {
  this.setState({SupplierCodeFilter:value }, async () => await this.getAll());
};
handleShortChange = (value: any) => {
  this.setState({BuyerShortIdFilter:value }, async () => await this.getAll());
};
handleSummaryChange = (value: any) => {
  this.setState({SupplementarySummaryId:value }, async () => await this.getAll());
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
        QueryFilter: '', // Reset filter values
        BuyerRemarksFilter: '',
        StatusFilter: -1,
        SupplementarySummaryDisplayPropertyFilter: '',
        SupplierRejectionCodeFilter: '',
        SupplierCodeFilter: '',
        BuyerShortIdFilter: '',
        filter: '', // Reset other filters as needed
      },
      async () => {
        await this.getAll(); // Fetch data with no filters applied
      }
    );
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.disputesStore.createDisputeData();
    } else {
      await this.props.disputesStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.disputesStore.editDispute });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.disputesStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
editdata:any = null;
  handleCreate = () => {
    const form = this.formRef.current;
    const { selectedLookupItem } = this.state;
    if (selectedLookupItem?.id) { 
      form?.setFieldsValue({ summariesId: selectedLookupItem.id });
    }
    const { relectedLookupItem } = this.state;
    if (relectedLookupItem?.id) { 
      form?.setFieldsValue({ rejecteionId: relectedLookupItem.id });
    }
    const { selectedBuyerLookupItem } = this.state;
    if (selectedBuyerLookupItem?.id) { 
      form?.setFieldsValue({ buyerId: selectedBuyerLookupItem.id });
    }

    const { selectedSupplierLookupItem } = this.state;
    if (selectedSupplierLookupItem?.id) { 
      form?.setFieldsValue({ buyerId: selectedSupplierLookupItem.id });
    }
    form!.validateFields().then(async (values: any) => {
      if (this.state.userId === 0) {
        await this.props.disputesStore.create(values);
      } else {
        await this.props.disputesStore.update({ ...values, id: this.state.userId });
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
  
  
//    handleFileUpload = (event:any) => {
//       const file = event.target.files[0];
//       if (file) {
//         this.props.DisputesStrore.importExcel(file);
//       }
//     };

  public render() {
    console.log(this.props.disputesStore);
    const { disputedata } = this.props.disputesStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.disputedata?.id })}>{L('Edit')}</Menu.Item>
                      <Menu.Item onClick={() => this.delete({ id: item.disputedata?.id })}>{L('Delete')}</Menu.Item>
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
      { title: L('Query'), dataIndex: 'disputedata.query', key: 'query', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.query || ''}</div> },
      { title: L('BuyerRemarks'), dataIndex: 'disputedata.buyerRemarks', key: 'query', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.buyerRemarks || ''}</div> },      
      { title: L('AccountsRemarks'), dataIndex: 'disputedata.accountsRemarks', key: 'accountsRemarks', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.accountsRemarks || ''}</div> },   
      { title: L('Summaries'), dataIndex: 'supplementarySummaryDisplayProperty', key: 'supplementarySummaryFk.SupplementarySummaryDisplayProperty', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('Rejection'), dataIndex: 'supplierRejectionCode', key: 'SupplierRejectionFk.supplierRejectionCode', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('BuyerName'), dataIndex: 'buyerShortId', key: 'buyerFk.buyerShortId', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('SupplierName'), dataIndex: 'supplierCode', key: 'supplierFk.supplierCode', width: 150, render: (text: string) => <div>{text}</div> },
      
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
            <h2>{L('Dispute')}</h2>
          </Col>
            
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            <Button type="primary"  icon={<PlusOutlined/>} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-100px'}}>Create DiputesDatas</Button>
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
          </Col>
        </Row>
        <div>
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
        </div>
        
        {this.state.filterVisible && (
                <Row gutter={16} style={{ marginTop: '10px' }}>
                <Col xs={{span:5,offset:0}}>
                <label className="form-label">{L('Query')}</label>
                <input 
                    value={this.state.QueryFilter} // Correctly bind the value to the state
                    onChange={(e) =>this.handleQueryChange (e.target.value) // Update the state on change
                  }
                />
                </Col>

                 {/* Filter */}

                <Col xs={{span:5,offset:0}}>
                <label className="form-label">{L('BuyerRemarks')}</label>
                <input 
                    value={this.state.BuyerRemarksFilter} // Correctly bind the value to the state
                    onChange={(e) =>this.handleBuyerChange  (e.target.value ) // Update the state on change
                  }
                />
                </Col>

                <Col xs={{span:5,offset:0}}>
                <label className="form-label">{L('Status')}</label>
                <select 
                className="form-select reload-on-change" 
                 name="StatusFilter" 
                 id="StatusFilterId"  
                 value={this.state.StatusFilter}

                style={{
                          width: '100%',
                          padding: '4px',
                          borderRadius: '2px',
                          border: '1px solid #000000',
                          fontSize: '14px',
                        }}>
                <option value="-1">{L("All")}</option>
                <option value="0">{L("Open")}</option>
                <option value="1">{L("Close")}</option>

                </select>
                    {/* <input onChange={(e) => this.handleStatusChange(e.target.value)}/> */}
                </Col>

                <Col xs={{span:5,offset:0}}>
                <label className="form-label">{L('SupplementarySummaryDisplayProperty')}</label>
                <input 
                    value={this.state.SupplementarySummaryDisplayPropertyFilter} // Correctly bind the value to the state
                    onChange={(e) =>this.handleStatusChange  ( e.target.value ) // Update the state on change
                  }
                />
                </Col>

                <Col xs={{span:5,offset:0}}>
                <label className="form-label">{L('SupplierRejectionCode')}</label>
                <input 
                    value={this.state.SupplierRejectionCodeFilter} // Correctly bind the value to the state
                    onChange={(e) => this.handleSupplementaryChange (e.target.value ) // Update the state on change
                  }
                />
                </Col>

                <Col xs={{span:5,offset:0}}>
                <label className="form-label">{L('SupplierCode')}</label>
                <input 
                    value={this.state.SupplierCodeFilter} // Correctly bind the value to the state
                    onChange={(e) =>this.handleRejectionChange (e.target.value ) // Update the state on change
                  }
                />
                </Col>

                <Col xs={{span:5,offset:0}}>
                <label className="form-label">{L('BuyerShortId')}</label>
                <input 
                    value={this.state.BuyerShortIdFilter} // Correctly bind the value to the state
                    onChange={(e) => this.handleCodeChange ( e.target.value ) // Update the state on change
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
                  style={{ marginTop: '24px', width: '100%' }}
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
              rowKey={(record) => record.Dispute?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: disputedata === undefined ? 0 : disputedata.totalCount, defaultCurrent: 1 }}
              loading={disputedata === undefined ? true : false}
              dataSource={disputedata === undefined ? [] : disputedata.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateDisputes
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
          disputesStrore={this.props.disputesStore}
        />
      </Card>
    );
  }
}

export default DisputesDatas;

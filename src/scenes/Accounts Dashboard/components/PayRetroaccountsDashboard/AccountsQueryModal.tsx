import * as React from 'react';

import { Button, Card, Col, Modal, Row, Table,message} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../../../components/AppComponentBase';
import AccountUpdateQuery from './AccountUpdateQueryModal';
import { EntityDto } from '../../../../services/dto/entityDto';
import { L } from '../../../../lib/abpUtility';
import Stores from '../../../../stores/storeIdentifier';
import DisputesStrore from '../../../../stores/DisputesStrore';
import { FormInstance } from 'antd/lib/form';
import { AccountDashboardInput } from './AccountsDashboardInput';
import Spin from 'antd/es/spin';
//import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
//import { EnumCurrency,EnumTransaction } from '../../../src/enum'

export interface IDisputesProps {
    // disputesStore: DisputesStrore;
    AccountDashboardInput:AccountDashboardInput;
}

export interface IDisputesdataState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  refreshloading:boolean;
  userId: number;
  initialData: {
    supplierName: string;
    buyerName: string;
    supplierRejection: string;
    query: string;
    status: string;
    buyerRemarks: string;
    accountsRemarks: string;
    supplementarySummaryId:number;
    supplementarySummary:string;
  };
  filter: string;
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
//const skipCount = 0;


const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return "Open";
      case 1:
        return "ForwardedToFandC";
      case 2:
        return "Close";
      case 3:
        return "InimatedToBuyer";
      default:
        return "Unknown";
    }
  };

@inject(Stores.DisputesStore)
@observer
class AccountQueryModal extends AppComponentBase<IDisputesProps, IDisputesdataState> {
    
  private disputesStore = new DisputesStrore();
  formRef = React.createRef<FormInstance>();
  

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    refreshloading:false,
    userId: 0,
    initialData: {
    supplierName: "",
    buyerName: "",
    supplierRejection: "",
    query: "",
    status: "",
    buyerRemarks: "",
    accountsRemarks: "",
    supplementarySummaryId:0,
    supplementarySummary:"",
      },
    filter: '',
    selectedLookupItem: null as SummariesLookupItem | null,
    relectedLookupItem: null as RejectionLookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
  };
  

  async componentDidMount() {
    await this.getAll();
  } 

  async componentDidUpdate(prevProps:IDisputesProps) {
      // Run getAll() only if BuyerDashboardInput has changed
      if (prevProps.AccountDashboardInput !== this.props.AccountDashboardInput) {
          await this.getAll();
      }
  }
  
  getAll = async () => {
    if (!this.disputesStore) {
        console.error('cbfcdatastore is undefined');
        return;
    }

     const skipCount = this.state.skipCount;
    await this.disputesStore.accountgetAll(this.props.AccountDashboardInput,skipCount);
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
    let returnedValue: any;

    if (entityDto.id === 0) {
      await this.disputesStore.createDisputeData();
    } else {
      returnedValue = await this.disputesStore.get(entityDto);
    }

    this.setState({
      userId: entityDto.id,
      initialData: {
        supplierName: returnedValue.supplierCode || '',
        buyerName: returnedValue.buyerShortId || '',
        supplierRejection: returnedValue.supplierRejectionCode || '',
        query: returnedValue.dispute.query || '',
        status: returnedValue.dispute.status || 0,
        buyerRemarks: returnedValue.dispute.buyerRemarks || '',
        accountsRemarks: returnedValue.dispute.accountsRemarks || '',
        supplementarySummaryId: returnedValue.dispute.supplementarySummaryId || '',
        supplementarySummary:returnedValue.supplementarySummaryDisplayProperty || ''
      }
    });

    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.disputesStore.editDispute });
    }, 100);
}



  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.disputesStore.delete(input);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }
  setLoading = (value: boolean) => {
    this.setState({ refreshloading: value });
  };
editdata:any = null;
IntimateToBuyerMail = async (item: any) => {
   
      //console.log(item);
      message.success(`F&C to Buyer Forwarded Query Intimation  Mail Sent to - ${item.accoutantName}`);
      

  };

  handleCreate = () => {
    const form = this.formRef.current;
   
    form!.validateFields().then(async (values: any) => {
        if(values.status !== 3){
            values.status = 3;
        }
      if (this.state.userId === 0) {
        await this.disputesStore.create(values);
      } else {
        
        await this.disputesStore.update({ ...values, id: this.state.userId });
        this.IntimateToBuyerMail(values);
        this.getAll();
       
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      message.success("Intimated to Buyer")
      this.setState({ refreshloading: false });
      form!.resetFields();
    });
  };

    Loading = () => (
    <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
      zIndex: 1000, // Ensure it appears above everything
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spin size="large" />
    
  </div >
  
  );
  

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
    // this.getAll();
    //console.log(this.disputesStore);
    const { disputedata } = this.disputesStore;
    const columns = [
         {
                    title: L('Actions'),
                    width: 150,
                    render: (text: string, item: any) => (
                      <div>
                   {item.dispute?.status !== 2 ? (
                  <Button onClick={() => this.createOrUpdateModalOpen({ id: item.dispute?.id })} type="primary">{L('Response')}</Button>
                ) : <Button type="primary" disabled>{L('Response')}</Button>}
                    </div>
                    ),
                    onHeaderCell: () => ({
                      style: {
                        backgroundColor: '#005f7f', // Set header background color for this column
                        color: '#fff',
                      },
                    }),
                  },

          { title: L('BuyerName'), dataIndex: 'buyerShortId', key: 'buyerFk.buyerShortId', width: 150, render: (text: string) => <div>{text}</div>,
          onHeaderCell: () => ({
            style: {
              backgroundColor: '#005f7f', // Set header background color for this column
              color: '#fff',
            },
          }),
         },
          { title: L('SupplierName'), dataIndex: 'supplierCode', key: 'supplierFk.supplierCode', width: 150, render: (text: string) => <div>{text}</div>,
          onHeaderCell: () => ({
            style: {
              backgroundColor: '#005f7f', // Set header background color for this column
              color: '#fff',
            },
          }),
         },    
          { title: L('Predefined Query'), dataIndex: 'supplierRejectionCode', key: 'SupplierRejectionFk.supplierRejectionCode', width: 150, render: (text: string) => <div>{text}</div>,
          onHeaderCell: () => ({
            style: {
              backgroundColor: '#005f7f', // Set header background color for this column
              color: '#fff',
            },
          }),
         },
 
      { title: L('Additional Query'), dataIndex: 'disputedata.query', key: 'query', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.query || ''}</div>,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
       },
        { title: L('Status'), dataIndex: 'disputedata.status', key: 'query', width: 150, render: (text: string, record: any) =>
         <div>{getStatusLabel(record.dispute?.status) || ''}</div>,
         onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
       },
      { title: L('BuyerRemarks'), dataIndex: 'disputedata.buyerRemarks', key: 'query', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.buyerRemarks || ''}</div>,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
       },      
      { title: L('AccountsRemarks'), dataIndex: 'disputedata.accountsRemarks', key: 'accountsRemarks', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.accountsRemarks || ''}</div>,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
       },  
        { title: L('Response Time'), dataIndex: 'disputedata.responseTime', key: 'responseTime', width: 150, render: (text: string, record: any) => {
            const date = record.dispute?.responseTime;
            return <div>{date ? new Date(date).toLocaleString("en-US") : ''}</div>;
          },
          onHeaderCell: () => ({
            style: {
              backgroundColor: '#005f7f', // Set header background color for this column
              color: '#fff',
            },
          }),

        },
      // { title: L('Summaries'), dataIndex: 'supplementarySummaryDisplayProperty', key: 'supplementarySummaryFk.SupplementarySummaryDisplayProperty', width: 150, render: (text: string) => <div>{text}</div> },
      
      
    ];

    return (
      <Card>
        <Row>
          {/* <Col
            xs={{ span: 4, offset: 0 }}
            sm={{ span: 4, offset: 0 }}
            md={{ span: 4, offset: 0 }}
            lg={{ span: 2, offset: 0 }}
            xl={{ span: 2, offset: 0 }}
            xxl={{ span: 2, offset: 0 }}
          >
            {' '}
            <h2 style={{whiteSpace:'nowrap'}}>{L('Accounts Query')}</h2>
          </Col> */}
            
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
          </Col>
        </Row>
        {/* <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
          </Col>
        </Row> */}
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
        {this.state.refreshloading && this.Loading()}
        <AccountUpdateQuery
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
          initialData={this.state.initialData}
          disputesStrore={this.disputesStore}
          onUpdate={this.getAll}
          setloading={this.setLoading}         
        />
      </Card>
    );
  }
}

export default AccountQueryModal;

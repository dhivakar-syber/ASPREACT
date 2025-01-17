import * as React from 'react';

import { Button, Card, Col, Dropdown, Menu, Modal, Row, Table,message} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../../../components/AppComponentBase';
import AccountUpdateQuery from './AccountUpdateQueryModal';
import { EntityDto } from '../../../../services/dto/entityDto';
import { L } from '../../../../lib/abpUtility';
import Stores from '../../../../stores/storeIdentifier';
import DisputesStrore from '../../../../stores/DisputesStrore';
import { FormInstance } from 'antd/lib/form';
import disputesServices from '../../../../services/Disputes/disputesServices';
import { AccountDashboardInput } from './AccountsDashboardInput';
//import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
//import { EnumCurrency,EnumTransaction } from '../../../src/enum'

export interface IDisputesProps {
    disputesStore: DisputesStrore;
    AccountDashboardInput:AccountDashboardInput;
}

export interface IDisputesdataState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
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
declare var abp: any;
//const Search = Input.Search;

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
class DisputesDatas extends AppComponentBase<IDisputesProps, IDisputesdataState> {
    
  formRef = React.createRef<FormInstance>();
  

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
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

  async getAll() {
    if (!this.props.disputesStore) {
        console.error('cbfcdatastore is undefined');
        return;
    }
    await this.props.disputesStore.accountgetAll(this.props.AccountDashboardInput);
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
      await this.props.disputesStore.createDisputeData();
    } else {
      returnedValue = await this.props.disputesStore.get(entityDto);
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
IntimateToBuyerMail = async (item: any) => {
   
      console.log(item);
  
      if (item.buyerMail) {
        item.buyerMail = item.buyerMail.split(',').map((email: string) => email.trim());
      }

      if (item.accoutantMail) {
        item.accoutantMail = item.accoutantMail.split(',').map((email: string) => email.trim());
      }
  
      const jsondata = JSON.stringify(item);
      console.log(jsondata);
  
      const url = `${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}RetroPay/AccountantResolveWorkflow`;
  
      abp.ui.setBusy();
  
      const response = await fetch(url, {
        method: 'POST',
        body: jsondata,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      abp.ui.clearBusy();
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
    //   const result = await response.json();
    //   console.log(result);
  
      message.success(`Buyer to F&C Forwarded Query Intimation  Mail Sent to - ${item.accoutantName}`);

  };

  handleCreate = () => {
    const form = this.formRef.current;
   
    form!.validateFields().then(async (values: any) => {
        if(values.status !== 3){
            values.status = 3;
        }
      if (this.state.userId === 0) {
        await this.props.disputesStore.create(values);
      } else {
        const dispute = { ...values, id: this.state.userId };
        await this.props.disputesStore.update({ ...values, id: this.state.userId });
        disputesServices.buyermail(dispute.id)
                    .then((result) => {
                        this.IntimateToBuyerMail(result);
                    })
                    .catch((error) => {
                        console.error('Error in sending email:', error);
                    });
       
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
    this.getAll();
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
                       {/* <Menu.Item onClick={() => this.delete({ id: item.disputedata?.id })}>{L('view')}</Menu.Item> */}
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.dispute?.id })}>{L('Edit')}</Menu.Item>                      
                    </Menu>
                  }
                  placement="bottomLeft"
                >
                  <Button type="primary" >
                    {L('Actions')}
                  </Button>
                </Dropdown>
              </div>
            ),
          },
          { title: L('BuyerName'), dataIndex: 'buyerShortId', key: 'buyerFk.buyerShortId', width: 150, render: (text: string) => <div>{text}</div> },
          { title: L('SupplierName'), dataIndex: 'supplierCode', key: 'supplierFk.supplierCode', width: 150, render: (text: string) => <div>{text}</div> },    
          { title: L('Rejection'), dataIndex: 'supplierRejectionCode', key: 'SupplierRejectionFk.supplierRejectionCode', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('Query'), dataIndex: 'disputedata.query', key: 'query', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.query || ''}</div> },
        { title: L('Status'), dataIndex: 'disputedata.status', key: 'query', width: 150, render: (text: string, record: any) =>
         <div>{getStatusLabel(record.dispute?.status) || ''}</div> },
      { title: L('BuyerRemarks'), dataIndex: 'disputedata.buyerRemarks', key: 'query', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.buyerRemarks || ''}</div> },      
      { title: L('AccountsRemarks'), dataIndex: 'disputedata.accountsRemarks', key: 'accountsRemarks', width: 150, render: (text: string, record: any) =>
        <div>{record.dispute?.accountsRemarks || ''}</div> },  
        { title: L('Response Time'), dataIndex: 'disputedata.responseTime', key: 'responseTime', width: 150, render: (text: string, record: any) => {
            const date = record.dispute?.responseTime;
            return <div>{date ? new Date(date).toLocaleString("en-US") : ''}</div>;
          },
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
          disputesStrore={this.props.disputesStore}
        />
      </Card>
    );
  }
}

export default DisputesDatas;

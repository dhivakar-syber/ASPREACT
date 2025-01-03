import * as React from 'react';
import { Form, Input, Modal,  Table, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import  disputeStore from '../../../stores/disputeStore';
import { DisputeBuyerLookupTableDto } from '../../../services/disputes/dto/DisputeBuyerLookupTableDto';
import { DisputeSupplementarySummaryLookupTableDto } from '../../../services/disputes/dto/DisputeSupplementarySummaryLookupTableDto';
import { DisputeSupplierLookupTableDto } from '../../../services/disputes/dto/DisputeSupplierLookupTableDto';
import { DisputeSupplierRejectionLookupTableDto } from '../../../services/disputes/dto/DisputeSupplierRejectionLookupTableDto';


export interface BuyerLookupTableDtoProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  disputeStore:disputeStore;
}

interface BuyerLookupTableDto{
  Id:number;
  DisplayName:string;
}
interface SupplementarySummaryLookupTableDto{
  Id:number;
  DisplayName:string;
}
interface SupplierLookupTableDto{
  Id:number;
  DisplayName:string;
}
interface SupplierRejectionLookupTableDto{
  Id:number;
  DisplayName:string;
}

class DisputeBuyerLookupTable extends React.Component<BuyerLookupTableDtoProps> {
  state = {
    getAllBuyerLookupTable: null as BuyerLookupTableDto | null,
    VisibleDisputeBuyerLookupItem: false,

    getAllSupplementaryForLookupTable: null as SupplementarySummaryLookupTableDto | null,
    VisibleDisputeSupplementarySummaryLookupTableDto: false,

    getAllForSupplierLookupTable: null as SupplierLookupTableDto | null,
    VisibleDisputeSupplierLookupTableDto: false,

    getAllRejectionForLookupTable: null as SupplierRejectionLookupTableDto | null,
    VisibleDisputeSupplierRejectionLookupTableDto:false,

  };

  pagedFilterAndSortedRequest = {
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name',
    keyword:'',
    entityDto: 0
  };


  async componentDidMount() {
    await this.getAllBuyerLookupTable();
    await this.getAllSupplementaryForLookupTable();
    await this.getAllRejectionForLookupTable();
    await this.getAllForSupplierLookupTable();
  }


  async getAllBuyerLookupTable() {
    if (!this.props.disputeStore) {
        console.error('disputeStore is undefined');
        return;
    }
    
  this.props.disputeStore.getAllBuyerLookupTable(this.pagedFilterAndSortedRequest); 
};
async getAllSupplementaryForLookupTable() {
  if (!this.props.disputeStore) {
      console.error('disputeStore is undefined');
      return;
  }
  
this.props.disputeStore.getAllSupplementaryForLookupTable(this.pagedFilterAndSortedRequest); 
};
async getAllRejectionForLookupTable() {
  if (!this.props.disputeStore) {
      console.error('disputeStore is undefined');
      return;
  }
  
this.props.disputeStore.getAllRejectionForLookupTable(this.pagedFilterAndSortedRequest); 
};
async getAllForSupplierLookupTable() {
  if (!this.props.disputeStore) {
      console.error('disputeStore is undefined');
      return;
  }
  
this.props.disputeStore.getAllForSupplierLookupTable(this.pagedFilterAndSortedRequest); 
};


showBuyerLookupModal = () => {
  this.setState({ VisibleDisputeBuyerLookupItem: true });
};
showSummaryLookupModal = () => {
  this.setState({ VisibleDisputeSupplementarySummaryLookupTableDto: true });
};
showSupplierLookupModal = () => {
  this.setState({ VisibleDisputeSupplierLookupTableDto: true });
};
showRejectionLookupModal = () => {
  this.setState({ VisibleDisputeSupplierRejectionLookupTableDto: true });
};

// Handle selection from lookup table
handleLookupSelect = (record: BuyerLookupTableDto) => {
  this.setState(
    {
      getAllBuyerLookupTable: record, // Store the selected item in state
      VisibleDisputeBuyerLookupItem: false, // Close the lookup modal after selection
    },
    () => {
      // Update the form fields after state update
      const { formRef } = this.props;
      formRef.current?.setFieldsValue({
        disputeNo: record.DisplayName, // Set the partNo field
        disputeId: record.Id, // Set the partId field
      });
    }
  );
};

// Handle selection from lookup table
handleLookup = (record: SupplementarySummaryLookupTableDto) => {
  this.setState(
    {
      getAllSupplementaryForLookupTable: record, // Store the selected item in state
      VisibleDisputeSupplementarySummaryLookupTableDto: false, // Close the lookup modal after selection
    },
    () => {
      // Update the form fields after state update
      const { formRef } = this.props;
      formRef.current?.setFieldsValue({
        SupplementaryNo: record.DisplayName, // Set the partNo field
        SupplementaryId: record.Id, // Set the partId field
      });
    }
  );
};

// Handle selection from lookup table
handleSupplierSelect = (record: SupplierLookupTableDto) => {
  this.setState(
    {
      getAllRejectionForLookupTable: record, // Store the selected item in state
      VisibleDisputeSupplierLookupTableDto: false, // Close the lookup modal after selection
    },
    () => {
      // Update the form fields after state update
      const { formRef } = this.props;
      formRef.current?.setFieldsValue({
        SupplierNo: record.DisplayName, // Set the partNo field
        Supplierd: record.Id, // Set the partId field
      });
    }
  );
};

// Handle selection from lookup table
handleRejectionSelect = (record: DisputeSupplierRejectionLookupTableDto) => {
  this.setState(
    {
      getAllForSupplierLookupTable: record, // Store the selected item in state
      VisibleDisputeSupplierRejectionLookupTableDto: false, // Close the lookup modal after selection
    },
    () => {
      // Update the form fields after state update
      const { formRef } = this.props;
      formRef.current?.setFieldsValue({
        RejectionNo: record.DisplayName, // Set the partNo field
        RejectionId: record.Id, // Set the partId field
      });
    }
  );
};

  // Handle cancel lookup modal
  handleLookupCancel = () => {
    this.setState({ VisibleDisputeBuyerLookupItem: false });
  };
  handleSummaryCancel = () => {
    this.setState({ VisibleDisputeSupplementarySummaryLookupTableDto: false });
  };
  handleSupplierCancel = () => {
    this.setState({ VisibleDisputeSupplierLookupTableDto: false });
  };
  handleRejectionCancel = () => {
    this.setState({ VisibleDisputeSupplierRejectionLookupTableDto: false });
  };


  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const {VisibleDisputeBuyerLookupItem,VisibleDisputeSupplementarySummaryLookupTableDto,VisibleDisputeSupplierLookupTableDto,VisibleDisputeSupplierRejectionLookupTableDto,getAllBuyerLookupTable,getAllSupplementaryForLookupTable,getAllRejectionForLookupTable,getAllForSupplierLookupTable} = this.state;

    // Fetch lookupData from store
    const lookupData: DisputeBuyerLookupTableDto[] = this.props.disputeStore.lookupData?.items || [];
    const buyerData: DisputeSupplementarySummaryLookupTableDto[] = this.props.disputeStore.buyerData?.items || [];
    const supplierData: DisputeSupplierLookupTableDto[] = this.props.disputeStore.supplierData?.items || [];
    const rejectionData: DisputeSupplierRejectionLookupTableDto[] = this.props.disputeStore.rejectionData?.items || [];
      // Define columns for the lookup table
      const columns = [
        { title: 'ID', dataIndex: 'Id', key: 'Id' },
        { title: 'Name', dataIndex: 'DisplayName', key: 'DisplayName' },
        {
          title: 'Action',
          key: 'action',
          render: (text: any, record: DisputeBuyerLookupTableDto) => (
            <Button onClick={() => this.handleLookupSelect(record)}>Select</Button>
          ),
        },
      ];

      // Define columns for the lookup table
      const Buyercolumns = [
        { title: 'ID', dataIndex: 'Id', key: 'Id' },
        { title: 'Name', dataIndex: 'DisplayName', key: 'DisplayName' },
        {
          title: 'Action',
          key: 'action',
          render: (text: any, record: DisputeSupplementarySummaryLookupTableDto) => (
            <Button onClick={() => this.handleLookupSelect(record)}>Select</Button>
          ),
        },
      ];
      // Define columns for the lookup table
      const Suppliercolumns = [
        { title: 'ID', dataIndex: 'Id', key: 'Id' },
        { title: 'Name', dataIndex: 'DisplayName', key: 'DisplayName' },
        {
          title: 'Action',
          key: 'action',
          render: (text: any, record: DisputeSupplierLookupTableDto) => (
            <Button onClick={() => this.handleLookupSelect(record)}>Select</Button>
          ),
        },
      ];

      const Rejectioncolumns = [
        { title: 'ID', dataIndex: 'Id', key: 'Id' },
        { title: 'Name', dataIndex: 'DisplayName', key: 'DisplayName' },
        {
          title: 'Action',
          key: 'action',
          render: (text: any, record: DisputeSupplierRejectionLookupTableDto) => (
            <Button onClick={() => this.handleLookupSelect(record)}>Select</Button>
          ),
        },
      ];
      return (
        <div>
          <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Disputedatas')} width={550}>
            <Form ref={formRef} initialValues={initialData} onValuesChange={(changedValues, allValues) => {

        if (changedValues.disputeNo && getAllBuyerLookupTable) {
          formRef.current?.setFieldsValue({
            disputeId: getAllBuyerLookupTable.Id,
          });
        }
        if (changedValues.SupplementaryNo && getAllSupplementaryForLookupTable) {
          formRef.current?.setFieldsValue({
            SupplementaryId: getAllSupplementaryForLookupTable.Id,
          });
        }
        if (changedValues.SupplementaryNo && getAllRejectionForLookupTable) {
          formRef.current?.setFieldsValue({
            SupplementaryId: getAllRejectionForLookupTable.Id,
          });
        }
        if (changedValues.rejectionNo && getAllForSupplierLookupTable) {
          formRef.current?.setFieldsValue({
            rejectionId: getAllForSupplierLookupTable.Id,
          });
        }
      }}>
        <Form.Item label={L('DisputeName')} name={'DisputeName'} {...formItemLayout}>
                <Input
                  onClick={this.showSupplierLookupModal} // Trigger supplier lookup modal
                  value={getAllBuyerLookupTable?.DisplayName || ''}
                  readOnly
                />
              </Form.Item>
              <Form.Item label={L('DisplayName')} name="DisplayName" {...formItemLayout} hidden>
                
                <Input />
      </Form.Item>

      <Form.Item label={L('SupplierName')} name={'supplierName'} {...formItemLayout}>
                <Input
                  onClick={this.showSupplierLookupModal} // Trigger supplier lookup modal
                  value={getAllSupplementaryForLookupTable?.DisplayName || ''}
                  readOnly
                />
              </Form.Item>
              <Form.Item label={L('DisplayName')} name="DisplayName" {...formItemLayout} hidden>
                <Input />
      </Form.Item>

      <Form.Item label={L('DisputeName')} name="DisputeName" {...formItemLayout} hidden>
                <Input />
      </Form.Item>

      <Form.Item label={L('BuyerRemark')} name="BuyerRemark" {...formItemLayout} hidden>
                <Input />
      </Form.Item>

      <Form.Item label={L('AccoutantName')} name="AccoutantName" {...formItemLayout} hidden>
                <Input />
      </Form.Item>
      <Form.Item label={L('SupplierMail')} name="SupplierMail" {...formItemLayout} hidden>
                <Input />
      </Form.Item>
                         </Form>
          </Modal>
  
          {/* Lookup Table Modal */}
          <Modal
            title="dispute"
            visible={VisibleDisputeBuyerLookupItem}
            onCancel={this.handleLookupCancel}
            footer={null}
            width={600}
          > 
            <Table
              columns={columns}
              dataSource={lookupData}
              rowKey="Id"
              pagination={false}
            />
          </Modal>
          <Modal
            title="supplier"
            visible={VisibleDisputeSupplementarySummaryLookupTableDto}
            onCancel={this.handleLookupCancel}
            footer={null}
            width={600}
          >
            <Table
              columns={Buyercolumns}
              dataSource={buyerData}
              rowKey="Id"
              pagination={false}
            />
          </Modal>
          <Modal
            title="supplier"
            visible={VisibleDisputeSupplierLookupTableDto}
            onCancel={this.handleLookupCancel}
            footer={null}
            width={600}
          >
            <Table
              columns={Suppliercolumns}
              dataSource={supplierData}
              rowKey="Id"
              pagination={false}
            />
          </Modal>
          <Modal
            title="supplier"
            visible={VisibleDisputeSupplierRejectionLookupTableDto}
            onCancel={this.handleLookupCancel}
            footer={null}
            width={600}
          >
            <Table
              columns={Rejectioncolumns}
              dataSource={rejectionData}
              rowKey="Id"
              pagination={false}
            />
          </Modal>
        </div>
      );
    }
  }
  
  export default DisputeBuyerLookupTable;
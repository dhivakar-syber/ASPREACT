import * as React from 'react';
import { Form, Input, Modal, Table, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
//import { EnumDisputeStatus } from '../../../enum';
import DisputesStrore from '../../../stores/DisputesStrore';
import { DisputeSupplementarySummaryLookupTableDto } from '../../../services/Disputes/dto/DisputeSupplementarySummaryLookupTableDto';
import { DisputeSupplierRejectionLookupTableDto } from '../../../services/Disputes/dto/DisputeSupplierRejectionLookupTableDto';
import { DisputeBuyerLookupTableDto } from '../../../services/Disputes/dto/DisputeBuyerLookupTableDto';
import { DisputeSupplierLookupTableDto } from '../../../services/Disputes/dto/DisputeSupplierLookupTableDto';

export interface ICreateOrUpdateDisputesDataProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  disputesStrore: DisputesStrore;
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



class CreateOrUpdateCBFCdata extends React.Component<ICreateOrUpdateDisputesDataProps> {
  state = {
    visibleSummariesLookup: false,
    visibleRejectionLookup: false,
    visibleSupplierLookup: false,
    visibleBuyerLookup: false,
    selectedSummariesLookupItem: null as SummariesLookupItem | null,
    selectedRejectionLookupItem: null as RejectionLookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,

  };

  // Fetch data from the store when component mounts
  pagedFilterAndSortedRequest = {
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name',
    keyword:''
  };
  async componentDidMount() {
    await this.getAllsuppliersummariesForLookupTable();
    await this.getAllsupplierrejectionForLookupTable();
    await this.getAllSupplierForLookupTable();
    await this.getAllBuyerForLookupTable();
  }
  async getAllsuppliersummariesForLookupTable() {
      if (!this.props.disputesStrore) {
          console.error('disputesStore is undefined');
          return;
      }
      
    this.props.disputesStrore.getAllsuppliersummariesForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllsupplierrejectionForLookupTable() {
      if (!this.props.disputesStrore) {
          console.error('disputesStore is undefined');
          return;
      }
      
    this.props.disputesStrore.getAllsupplierrejectionForLookupTable(this.pagedFilterAndSortedRequest); 
  }

  async getAllSupplierForLookupTable() {
    if (!this.props.disputesStrore) {
        console.error('cbfcdatastore is undefined');
        return;
    }
    
  this.props.disputesStrore.getAllSupplierForLookupTable(this.pagedFilterAndSortedRequest); 
}

  async getAllBuyerForLookupTable() {
      if (!this.props.disputesStrore) {
          console.error('cbfcdatastore is undefined');
          return;
      }
      
    this.props.disputesStrore.getAllBuyerForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  

  // Open lookup modal or table
  showsummariesLookupModal = () => {
    this.setState({ visibleSummariesLookup: true });
  };
  showrejectionLookupModal = () => {
    this.setState({ visibleRejectionLookup: true });
  };
  showSupplierLookupModal = () => {
    this.setState({ visibleSupplierLookup: true });
  };
  showBuyerLookupModal = () => {
    this.setState({ visibleBuyerLookup: true });
  };

  // Handle selection from lookup table
  handleSummariesLookupSelect = (record: SummariesLookupItem) => {
    this.setState(
      {
        selectedSummariesLookupItem: record, 
        visibleSummariesLookup: false, 
      },
      () => {
        // Update the form fields after state update
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          summaries: record.displayName, // Set the partNo field
          summariesId: record.id, // Set the partId field
        });
      }
    );
  };
  handleRejectionLookupSelect = (record: SupplierLookupItem) => {
    this.setState(
      {
        selectedRejectionLookupItem: record, // Store the selected supplier item
        visibleRejectionLookup: false, // Close the supplier lookup modal
      },
      () => {
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          rejection: record.displayName, // Set the supplier field
          rejectionId: record.id, // Set the supplierId field
        });
      }
    );
  };
  handleBuyerLookupSelect = (record: BuyerLookupItem) => {
    this.setState(
      {
        selectedBuyerLookupItem: record, // Store the selected supplier item
        visibleBuyerLookup: false, // Close the supplier lookup modal
      },
      () => {
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          buyerName: record.displayName, // Set the supplier field
          buyerId: record.id, // Set the supplierId field
        });
      }
    );
  };
  handleSupplierLookupSelect = (record: BuyerLookupItem) => {
    this.setState(
      {
        selectedSupplierLookupItem: record, // Store the selected supplier item
        visibleSupplierLookup: false, // Close the supplier lookup modal
      },
      () => {
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          supplierName: record.displayName, // Set the supplier field
          supplierId: record.id, // Set the supplierId field
        });
      }
    );
  };

  // Handle cancel lookup modal
  handlesummariesLookupCancel = () => {
    this.setState({ visibleSummariesLookup: false });
  };
  handlerejectionLookupCancel = () => {
    this.setState({ visibleRejectionLookup: false });
  };
  handleSupplierLookupCancel = () => {
    this.setState({ visibleSupplierLookup: false });
  };
  handleBuyerLookupCancel = () => {
    this.setState({ visibleBuyerLookup: false });
  };
  render() {
    

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const {visibleSummariesLookup,visibleRejectionLookup, visibleSupplierLookup,visibleBuyerLookup, selectedSummariesLookupItem,selectedRejectionLookupItem, selectedSupplierLookupItem,selectedBuyerLookupItem} = this.state;

    // Fetch lookupData from store
    const summariesData: DisputeSupplementarySummaryLookupTableDto[] = this.props.disputesStrore.supplementarylookupdata?.items || []; 
    const rejectionData: DisputeSupplierRejectionLookupTableDto[] = this.props.disputesStrore.rejectionlookupdata?.items || []; 
    const supplierData: DisputeSupplierLookupTableDto[] = this.props.disputesStrore.supplierlookupdata?.items || []; 
    const buyerData: DisputeBuyerLookupTableDto[] = this.props.disputesStrore.buyerlookupdata?.items || []; 

    // Define columns for the lookup table
    const summariescolumns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: SummariesLookupItem) => (
          <Button onClick={() => this.handleSummariesLookupSelect(record)}>Select</Button>
        ),
      },
    ];

    const rejectioncolumns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
        {
          title: 'Action',
          key: 'action',
          render: (text: any, record: RejectionLookupItem) => (
            <Button onClick={() => this.handleRejectionLookupSelect(record)}>Select</Button>
          ),
        },
      ];

    const supplierColumns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: SupplierLookupItem) => (
          <Button onClick={() => this.handleSupplierLookupSelect(record)}>Select</Button>
        ),
      },
    ];
    const buyerColumns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: BuyerLookupItem) => (
          <Button onClick={() => this.handleBuyerLookupSelect(record)}>Select</Button>
        ),
      },
    ];
    return (
      <div>
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Disputes')} width={550}>
          <Form ref={formRef} initialValues={initialData} onValuesChange={(changedValues, allValues) => {
      if (changedValues.summaries && selectedSummariesLookupItem) {
        formRef.current?.setFieldsValue({
          partId: selectedSummariesLookupItem.id,
        });
      }
      if (changedValues.rejection && selectedRejectionLookupItem) {
        formRef.current?.setFieldsValue({
          partId: selectedRejectionLookupItem.id,
        });
      }
      if (changedValues.supplierName && selectedSupplierLookupItem) {
        formRef.current?.setFieldsValue({
          supplierId: selectedSupplierLookupItem.id,
        });
      }
      if (changedValues.buyerName && selectedBuyerLookupItem) {
        formRef.current?.setFieldsValue({
          buyerId: selectedBuyerLookupItem.id,
        });
      }
    }}>
      <Form.Item label={L('Supplier')} name={'supplierName'} {...formItemLayout}>
              <Input
                onClick={this.showSupplierLookupModal} // Trigger supplier lookup modal
                value={selectedSupplierLookupItem?.displayName || ''}
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('SupplierId')} name="supplierId" {...formItemLayout} hidden>
              <Input />
            </Form.Item>
      <Form.Item label={L('Buyer')} name={'buyerName'} {...formItemLayout}>
              <Input
                onClick={this.showBuyerLookupModal} // Trigger supplier lookup modal
                value={selectedBuyerLookupItem?.displayName || ''}
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('BuyerId')} name="buyerId" {...formItemLayout} hidden>
              <Input />
            </Form.Item>
      <Form.Item label={L('Summaries')} name={'summaries'} {...formItemLayout}>
              <Input
                onClick={this.showsummariesLookupModal} // Trigger lookup table when clicked
                value={selectedSummariesLookupItem?.displayName || ''} // Safe access using optional chaining
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('SummariesId')} name="summariesId" {...formItemLayout} hidden>
      <Input />
    </Form.Item>
    <Form.Item label={L('Rejection')} name={'rejection'} {...formItemLayout}>
              <Input
                onClick={this.showrejectionLookupModal} // Trigger lookup table when clicked
                value={selectedRejectionLookupItem?.displayName || ''} // Safe access using optional chaining
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('RejectionId')} name="rejectionId" {...formItemLayout} hidden>
      <Input />
    </Form.Item>
            <Form.Item label={L('Query')} name={'query'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('BuyerRemarks')} name={'buyerRemarks'} {...formItemLayout}>
              <Input />
            </Form.Item>
            <Form.Item label={L('AccountsRemarks')} name={'accountsRemarks'} {...formItemLayout}>
              <Input />
            </Form.Item>                      
          </Form>
        </Modal>

        {/* Lookup Table Modal */}
        <Modal
          title="Summaries"
          visible={visibleSummariesLookup}
          onCancel={this.handlesummariesLookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={summariescolumns}
            dataSource={summariesData}
            rowKey="id"
            pagination={false}
          />
        </Modal>
        <Modal
          title="Rejection"
          visible={visibleRejectionLookup}
          onCancel={this.handlerejectionLookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={rejectioncolumns}
            dataSource={rejectionData}
            rowKey="id"
            pagination={false}
          />
        </Modal>
        <Modal
          title="Suppliers"
          visible={visibleSupplierLookup}
          onCancel={this.handleSupplierLookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={supplierColumns}
            dataSource={supplierData}
            rowKey="id"
            pagination={false}
          />
        </Modal>
        <Modal
          title="Buyers"
          visible={visibleBuyerLookup}
          onCancel={this.handleBuyerLookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={buyerColumns}
            dataSource={buyerData}
            rowKey="id"
            pagination={false}
          />
        </Modal>
      </div>
    );
  }
}

export default CreateOrUpdateCBFCdata;
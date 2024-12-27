import * as React from 'react';
import { Form, Input, Modal, DatePicker, Table, Button } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table'; //ts2724
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import supplierRaisedQueryStore from '../../../stores/supplierRaisedQueryStore';
import { SupplierRaisedQueryPartLookupTableDto } from '../../../services/supplierRaisedQueries/dto/supplierRaisedQueryPartLookupTableDto';
import { SupplierRaisedQuerySupplierLookupTableDto } from '../../../services/supplierRaisedQueries/dto/supplierRaisedQuerySupplierLookupTableDto';
import { supplementarySummaryBuyerLookupTableDto } from '../../../services/SupplementarySummaries/dto/supplementarySummaryBuyerLookupTableDto';

export interface ICreateOrUpdateSupplierRaisedQueriesProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  supplierRaisedQueryStore: supplierRaisedQueryStore;
}

interface LookupItem {
  id: number;
  displayName: string;
}
interface SupplierLookupItem {
  id: number;
  displayName: string;
}
interface BuyerLookupItem {
  id: number;
  displayName: string;
}

class CreateOrUpdateSupplierRaisedQueries extends React.Component<ICreateOrUpdateSupplierRaisedQueriesProps> {
  state = {
    visibleLookup: false,
    visibleSupplierLookup: false,
    visibleBuyerLookup: false,
    selectedLookupItem: null as LookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
    currentPage: 1, // Track the current page
    pageSize: 10,
    totalItems: 0,
  };

  // Fetch data from the store when component mounts
  pagedFilterAndSortedRequest = {
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name',
    keyword:''
  };
  async componentDidMount() {
    await this.getAllPartForLookupTable();
    await this.getAllSupplierForLookupTable();
    await this.getAllBuyerForLookupTable();
  }
  async getAllPartForLookupTable() {
      if (!this.props.supplierRaisedQueryStore) {
          console.error('supplierRaisedQueryStore is undefined');
          return;
      }
      
    this.props.supplierRaisedQueryStore.getAllPartForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllSupplierForLookupTable() {
      if (!this.props.supplierRaisedQueryStore) {
          console.error('supplierRaisedQueryStore is undefined');
          return;
      }
      
    this.props.supplierRaisedQueryStore.getAllSupplierForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllBuyerForLookupTable() {
      if (!this.props.supplierRaisedQueryStore) {
          console.error('supplierRaisedQueryStore is undefined');
          return;
      }
      
    this.props.supplierRaisedQueryStore.getAllBuyerForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  
  showLookupModal = () => {
    this.setState({ visibleLookup: true });
  };
  showSupplierLookupModal = () => {
    this.setState({ visibleSupplierLookup: true });
  };
  showBuyerLookupModal = () => {
    this.setState({ visibleBuyerLookup: true });
  };

  // Handle selection from lookup table
  handleLookupSelect = (record: LookupItem) => {
    this.setState(
      {
        selectedLookupItem: record, // Store the selected item in state
        visibleLookup: false, // Close the lookup modal after selection
      },
      () => {
        // Update the form fields after state update
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          partNo: record.displayName, // Set the partNo field
          partId: record.id, // Set the partId field
        });
      }
    );
  };
  handleSupplierLookupSelect = (record: SupplierLookupItem) => {
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

  // Handle cancel lookup modal
  handleLookupCancel = () => {
    this.setState({ visibleLookup: false });
  };
  handleSupplierLookupCancel = () => {
    this.setState({ visibleSupplierLookup: false });
  };
  handleBuyerLookupCancel = () => {
    this.setState({ visibleBuyerLookup: false });
  };
  handlePageChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    this.setState(
      {
        currentPage: current || 1,
        pageSize: pageSize || 10,
      },
      () => {
        // Update pagedFilterAndSortedRequest based on pagination
        this.pagedFilterAndSortedRequest.skipCount = (this.state.currentPage - 1) * this.state.pageSize;
        this.pagedFilterAndSortedRequest.maxResultCount = this.state.pageSize;
        this.getAllPartForLookupTable(); // Fetch the data again with updated pagination
      }
    );
  };
  render() {
    

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const {visibleLookup, visibleSupplierLookup,visibleBuyerLookup, selectedLookupItem, selectedSupplierLookupItem,selectedBuyerLookupItem} = this.state;

    // Fetch lookupData from store
    const lookupData: SupplierRaisedQueryPartLookupTableDto[] = this.props.supplierRaisedQueryStore.partlookupdata?.items || []; 
    const supplierData: SupplierRaisedQuerySupplierLookupTableDto[] = this.props.supplierRaisedQueryStore.supplierlookupdata?.items || []; 
    const buyerData: supplementarySummaryBuyerLookupTableDto[] = this.props.supplierRaisedQueryStore.buyerlookupdata?.items || []; 

    // Define columns for the lookup table
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: LookupItem) => (
          <Button onClick={() => this.handleLookupSelect(record)}>Select</Button>
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
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('SupplementarySummaries')} width={550}>
          <Form ref={formRef} initialValues={initialData} onValuesChange={(changedValues, allValues) => {
      if (changedValues.partNo && selectedLookupItem) {
        formRef.current?.setFieldsValue({
          partId: selectedLookupItem.id,
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
      <Form.Item label={L('PartNo')} name={'partNo'} {...formItemLayout}>
              <Input
                onClick={this.showLookupModal} // Trigger lookup table when clicked
                value={selectedLookupItem?.displayName || ''} // Safe access using optional chaining
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('PartId')} name="partId" {...formItemLayout} hidden>
      <Input />
      
    </Form.Item>
            
            <Form.Item label={L('ContractValidFrom')} name={'contractValidFrom'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('ContractValidTo')} name={'contractValidTo'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('TotalGRNQty')} name={'totalGRNQty'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('TotalCBFCPaindAmount')} name={'totalCBFCPaindAmount'} {...formItemLayout}>
              <input />
            </Form.Item>
            <Form.Item label={L('RejectionReason')} name={'rejectionReason'} {...formItemLayout}>
              <input />
            </Form.Item>
            <Form.Item label={L('BuyerRemarks')} name={'buyerRemarks'} {...formItemLayout}>
              <input />
            </Form.Item>
            <Form.Item label={L('Status')} name={'status'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('Attachment')} name={'attachment'} {...formItemLayout}>
              <Input/>
            </Form.Item>
          </Form>
        </Modal>

        {/* Lookup Table Modal */}
        <Modal
          title="Parts"
          visible={visibleLookup}
          onCancel={this.handleLookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={columns}
            dataSource={lookupData}
            rowKey="id"
            pagination={{
              current: this.state.currentPage,
              pageSize: this.state.pageSize,
              total: lookupData.length, // Total items count, update if you have pagination count from the server
              onChange: this.handlePageChange as any, //ts2322
            }}
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

export default CreateOrUpdateSupplierRaisedQueries;
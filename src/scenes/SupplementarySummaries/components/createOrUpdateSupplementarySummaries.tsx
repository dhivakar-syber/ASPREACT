import * as React from 'react';
import { Form, Input, Modal, DatePicker, Table, Button,Checkbox } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table'; //ts2724
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import { DocumentStatus } from '../../../enum';
import supplementarySummariesStore from '../../../stores/supplementarySummariesStore';
import { SupplementarySummaryPartLookupTableDto } from '../../../services/SupplementarySummaries/dto/supplementarySummaryPartLookupTableDto';
import { SupplementarySummarySupplierLookupTableDto } from '../../../services/SupplementarySummaries/dto/supplementarySummarySupplierLookupTableDto';
import { supplementarySummaryBuyerLookupTableDto } from '../../../services/SupplementarySummaries/dto/supplementarySummaryBuyerLookupTableDto';

export interface ICreateOrUpdateSupplementarySummariesProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  supplementarySummariesStore: supplementarySummariesStore;
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

const DocumentStatusSelect: React.FC<{ documentStatus: number, onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ documentStatus, onChange }) => {
  const selectListDocumentStatus = Object.keys(DocumentStatus)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      value: DocumentStatus[key as keyof typeof DocumentStatus],
      text: L(`${DocumentStatus[key as keyof typeof DocumentStatus]}`),
    }));

  return (
    <select
      name="Document Status"
      value={documentStatus}
      onChange={onChange}
    >
      {selectListDocumentStatus.map(option => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
};

class CreateOrUpdateSupplementarySummaries extends React.Component<ICreateOrUpdateSupplementarySummariesProps> {
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
      if (!this.props.supplementarySummariesStore) {
          console.error('supplementarySummariesStore is undefined');
          return;
      }
      
    this.props.supplementarySummariesStore.getAllPartForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllSupplierForLookupTable() {
      if (!this.props.supplementarySummariesStore) {
          console.error('supplementarySummariesStore is undefined');
          return;
      }
      
    this.props.supplementarySummariesStore.getAllSupplierForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllBuyerForLookupTable() {
      if (!this.props.supplementarySummariesStore) {
          console.error('supplementarySummariesStore is undefined');
          return;
      }
      
    this.props.supplementarySummariesStore.getAllBuyerForLookupTable(this.pagedFilterAndSortedRequest); 
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
    const lookupData: SupplementarySummaryPartLookupTableDto[] = this.props.supplementarySummariesStore.partlookupdata?.items || []; 
    const supplierData: SupplementarySummarySupplierLookupTableDto[] = this.props.supplementarySummariesStore.supplierlookupdata?.items || []; 
    const buyerData: supplementarySummaryBuyerLookupTableDto[] = this.props.supplementarySummariesStore.buyerlookupdata?.items || []; 

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
            <Form.Item label={L('SupplementaryInvoiceNo')} name={'supplementaryInvoiceNo'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('SupplementaryInvoiceDate')} name={'supplementaryInvoiceDate'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('supplementaryInvoiceFileId')} name={'supplementaryInvoiceFileId'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('AnnexureFileId')} name={'annexureFileId'} {...formItemLayout}>
              <Input />
            </Form.Item>
            <Form.Item label={L('ContractFromDate')} name={'contractFromDate'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('ContractToDate')} name={'contractToDate'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('ContractNo')} name={'contractNo'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('ContractDate')} name={'contractDate'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('ApprovalDate')} name={'approvalDate'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('ImplementationDate')} name={'implementationDate'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('GRNQty')} name={'grNQty'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('OldValue')} name={'oldValue'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('NewValue')} name={'newValue'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('Delta')} name={'delta'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('Total')} name={'total'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('VersionNo')} name={'versionNo'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('PlantCode')} name={'plantCode'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('IsRejected')} {...formItemLayout} name="isRejected" valuePropName="checked">
                <Checkbox>{L('IsRejected')}</Checkbox>
              </Form.Item>
            <Form.Item label={L('DocumentStatus')} name={'documentStatus'} {...formItemLayout}>
              <DocumentStatusSelect
                documentStatus={initialData.documentStatus}
                onChange={(event) => {
                  formRef.current?.setFieldsValue({ documentStatus: event.target.value });
                }}
              />
            </Form.Item>
            <Form.Item label={L('isApproved')} {...formItemLayout} name="isApproved" valuePropName="checked">
                <Checkbox>{L('isApproved')}</Checkbox>
              </Form.Item>
            <Form.Item label={L('BuyerEmailAddress')} name={'buyerEmailAddress'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('BuyerApprovalStatus')} name={'buyerApprovalStatus'} {...formItemLayout}>
              <DocumentStatusSelect
                documentStatus={initialData.documentStatus}
                onChange={(event) => {
                  formRef.current?.setFieldsValue({ documentStatus: event.target.value });
                }}
              />
            </Form.Item>
            <Form.Item label={L('BuyerApproval')} {...formItemLayout} name="buyerApproval" valuePropName="checked">
                <Checkbox>{L('BuyerApproval')}</Checkbox>
              </Form.Item>
              <Form.Item label={L('BuyerApprovedTime')} name={'buyerApprovedTime'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
              <Form.Item label={L('BuyerRejectedTime')} name={'buyerRejectedTime'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('BuyerRemarks')} name={'buyerRemarks'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('AccountantName')} name={'accountantName'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('AccountantEmailAddress')} name={'accountantEmailAddress'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('AccountantApprovalStatus')} name={'accountantApprovalStatus'} {...formItemLayout}>
              <DocumentStatusSelect
                documentStatus={initialData.documentStatus}
                onChange={(event) => {
                  formRef.current?.setFieldsValue({ documentStatus: event.target.value });
                }}
              />
            </Form.Item>
              <Form.Item label={L('AccountApprovedTime')} name={'accountApprovedTime'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
              <Form.Item label={L('AccountRejectedTime')} name={'accountRejectedTime'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('AccountRemarks')} name={'accountRemarks'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('PayerName')} name={'payerName'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('PayerEmailAddress')} name={'payerEmailAddress'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('PaymentApprovalStatus')} name={'paymentApprovalStatus'} {...formItemLayout}>
              <DocumentStatusSelect
                documentStatus={initialData.documentStatus}
                onChange={(event) => {
                  formRef.current?.setFieldsValue({ documentStatus: event.target.value });
                }}
              />
            </Form.Item>
              <Form.Item label={L('PaymentApprovedTime')} name={'paymentApprovedTime'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
              <Form.Item label={L('PaymentRejectedTime')} name={'paymentRejectedTime'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('PaymentRemarks')} name={'paymentRemarks'} {...formItemLayout}>
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

export default CreateOrUpdateSupplementarySummaries;
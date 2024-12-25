import * as React from 'react';
import { Form, Input, Modal, DatePicker, Table, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import { EnumCurrency, EnumTransaction } from '../../../enum';
import cbfcdataStore from '../../../stores/cbfcdataStore';
import { CBFCdataPartLookupTableDto } from '../../../services/cbfcdata/dto/cbfcdataPartLookupTableDto';
import { CBFCdataSupplierLookupTableDto } from '../../../services/cbfcdata/dto/cbfcdataSupplierLookupTableDto';
import { CBFCdataBuyerLookupTableDto } from '../../../services/cbfcdata/dto/cbfcdataBuyerLookupTableDto';

export interface ICreateOrUpdateCBFCdataProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  cbfcdataStore: cbfcdataStore;
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

const CurrencySelect: React.FC<{ currency: number, onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ currency, onChange }) => {
  const selectListCurrency = Object.keys(EnumCurrency)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      value: EnumCurrency[key as keyof typeof EnumCurrency],
      text: L(`${EnumCurrency[key as keyof typeof EnumCurrency]}`),
    }));

  return (
    <select
      name="currency"
      value={currency}
      onChange={onChange}
    >
      {selectListCurrency.map(option => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
};

const TransactionSelect: React.FC<{ transaction: number, onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ transaction, onChange }) => {
  const selectListTransaction = Object.keys(EnumTransaction)
    .filter(key => !isNaN(Number(key)))
    .map(key => ({
      value: EnumTransaction[key as keyof typeof EnumTransaction],
      text: L(`${EnumTransaction[key as keyof typeof EnumTransaction]}`),
    }));

  return (
    <select
      name="transaction"
      value={transaction}
      onChange={onChange}
    >
      {selectListTransaction.map(option => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
};

class CreateOrUpdateCBFCdata extends React.Component<ICreateOrUpdateCBFCdataProps> {
  state = {
    visibleLookup: false,
    visibleSupplierLookup: false,
    visibleBuyerLookup: false,
    selectedLookupItem: null as LookupItem | null,
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
    await this.getAllPartForLookupTable();
    await this.getAllSupplierForLookupTable();
    await this.getAllBuyerForLookupTable();
  }
  async getAllPartForLookupTable() {
      if (!this.props.cbfcdataStore) {
          console.error('cbfcdatastore is undefined');
          return;
      }
      
    this.props.cbfcdataStore.getAllPartForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllSupplierForLookupTable() {
      if (!this.props.cbfcdataStore) {
          console.error('cbfcdatastore is undefined');
          return;
      }
      
    this.props.cbfcdataStore.getAllSupplierForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllBuyerForLookupTable() {
      if (!this.props.cbfcdataStore) {
          console.error('cbfcdatastore is undefined');
          return;
      }
      
    this.props.cbfcdataStore.getAllBuyerForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  

  // Open lookup modal or table
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
  render() {
    

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const {visibleLookup, visibleSupplierLookup,visibleBuyerLookup, selectedLookupItem, selectedSupplierLookupItem,selectedBuyerLookupItem} = this.state;

    // Fetch lookupData from store
    const lookupData: CBFCdataPartLookupTableDto[] = this.props.cbfcdataStore.partlookupdata?.items || []; 
    const supplierData: CBFCdataSupplierLookupTableDto[] = this.props.cbfcdataStore.supplierlookupdata?.items || []; 
    const buyerData: CBFCdataBuyerLookupTableDto[] = this.props.cbfcdataStore.buyerlookupdata?.items || []; 

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
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('CBFCDatas')} width={550}>
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
            <Form.Item label={L('DeliveryNote')} name={'deliveryNote'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('DeliveryNoteDate')} name={'deliveryNoteDate'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('PaidAmount')} name={'paidAmount'} {...formItemLayout}>
              <Input />
            </Form.Item>
            <Form.Item label={L('Year')} name={'year'} {...formItemLayout}>
              <Input />
            </Form.Item>
            <Form.Item label={L('Currency')} name={'currency'} {...formItemLayout}>
              <CurrencySelect
                currency={initialData.currency}
                onChange={(event) => {
                  formRef.current?.setFieldsValue({ currency: event.target.value });
                }}
              />
            </Form.Item>
            <Form.Item label={L('Transaction')} name={'transaction'} {...formItemLayout}>
              <TransactionSelect
                transaction={initialData.transaction}
                onChange={(event) => {
                  formRef.current?.setFieldsValue({ transaction: event.target.value });
                }}
              />
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
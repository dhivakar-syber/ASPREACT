import * as React from 'react';
import { Form, Input, Modal, DatePicker, Table, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import { EnumCurrency, EnumTransaction } from '../../../enum';
import cbfcdataStore from '../../../stores/cbfcdataStore';
import { CBFCdataPartLookupTableDto } from '../../../services/cbfcdata/dto/cbfcdataPartLookupTableDto';

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
    visibleLookup: false, // State to control visibility of the lookup table
    selectedLookupItem: null as LookupItem | null, // Type defined here
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
  }
  async getAllPartForLookupTable() {
      if (!this.props.cbfcdataStore) {
          console.error('cbfcdatastore is undefined');
          return;
      }
      
    this.props.cbfcdataStore.getAllPartForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  

  // Open lookup modal or table
  showLookupModal = () => {
    this.setState({ visibleLookup: true });
  };

  // Handle selection from lookup table
  handleLookupSelect = (record: LookupItem) => {
    this.setState({
      selectedLookupItem: record,
      visibleLookup: false, // Close the lookup modal after selection
    });

    // Optionally, set the value of the selected item in the form
    const { formRef } = this.props;
    formRef.current?.setFieldsValue({ partNo: record.displayName }); // For example, set `deliveryNote` field
  };

  // Handle cancel lookup modal
  handleLookupCancel = () => {
    this.setState({ visibleLookup: false });
  };

  render() {
    

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const { visibleLookup, selectedLookupItem } = this.state;

    // Fetch lookupData from store
    const lookupData: CBFCdataPartLookupTableDto[] = this.props.cbfcdataStore.partlookupdata?.items || []; // ts2304

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

    return (
      <div>
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('CBFCDatas')} width={550}>
          <Form ref={formRef} initialValues={initialData}>
            <Form.Item label={L('DeliveryNote')} name={'deliveryNote'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('PartNo')} name={'partNo'} {...formItemLayout}>
              <Input
                onClick={this.showLookupModal} // Trigger lookup table when clicked
                value={selectedLookupItem?.displayName || ''} // Safe access using optional chaining
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('DeliveryNoteDate')} name={'deliveryNoteDate'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
            <Form.Item label={L('Transaction')} name={'transaction'} {...formItemLayout}>
              <Input />
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
          title="Lookup Table"
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
      </div>
    );
  }
}

export default CreateOrUpdateCBFCdata;
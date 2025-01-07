import * as React from 'react';
import { Form, Input, Modal, Table, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import supplierStore from '../../../stores/supplierStore';

export interface SupplierdataProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  supplierStore: supplierStore;
}

interface SupplierUserLookupTableDto {
  id: number;
  displayName: string;
}

class edit extends React.Component<SupplierdataProps> {
  state = {
    SupplierLookup: false,
    SupplierLookupItem: null as SupplierUserLookupTableDto | null,
  };

  // Fetch data from the store when component mounts
  pagedFilterAndSortedRequest = {
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name',
    keyword:''
  };
  async componentDidMount() {
    await this.getAll();

  }
  async getAll() {
      if (!this.props.supplierStore) {
          console.error('supplierStore is undefined');
          return;
      }
      
    this.props.supplierStore.getAll(this.pagedFilterAndSortedRequest); 
  }
  

  // Open lookup modal or table
  SupplierLookupItem = () => {
    this.setState({ SupplierLookup: true });
  };
  // Handle selection from lookup table
  handleLookupSelect = (record: SupplierUserLookupTableDto) => {
    this.setState(
      {
        SupplierLookupItem: record, // Store the selected item in state
        SupplierLookup: false, // Close the lookup modal after selection
      },
      () => {
        // Update the form fields after state update
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          supplierNo: record.displayName, // Set the partNo field
          supplierId: record.id, // Set the partId field
        });
      }
    );
  };

  // Handle cancel lookup modal
  handleLookupCancel = () => {
    this.setState({ SupplierLookup: false });
  };

  render() {
    

    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
    };

    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const {SupplierLookup,SupplierLookupItem} = this.state;

    // Fetch lookupData from store
    const supplierlookupdata: SupplierUserLookupTableDto[] = this.props.supplierStore.supplierlookupdata?.items || [];

    // Define columns for the lookup table
    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: SupplierUserLookupTableDto) => (
          <Button onClick={() => this.handleLookupSelect(record)}>Select</Button>
        ),
      },
    ];
    return (
      <div>
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Supplier')} width={550}>
          <Form ref={formRef} initialValues={initialData} onValuesChange={(changedValues, allValues) => {
      if (changedValues.supplierNo && SupplierLookupItem) {
        formRef.current?.setFieldsValue({
            supplierNo: SupplierLookupItem.id,
        });
      }
      console.log("hello! Its me");
          }}>
      <Form.Item label={L('Name')} name={'Name'} {...formItemLayout}>
              <Input
                onClick={this.SupplierLookupItem} // Trigger supplier lookup modal
                value={SupplierLookupItem?.displayName || ''}
                readOnly
              />
             <Form.Item label={L('Code')} name={'code'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('User Id')} name={'userid'} {...formItemLayout}>
              <Input/>
            </Form.Item>
      </Form.Item>
          </Form>
        </Modal>

        {/* Lookup Table Modal */}
        <Modal
          title="Parts"
          visible={SupplierLookup}
          onCancel={this.handleLookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={columns}
            dataSource={supplierlookupdata}
            rowKey="id"
            pagination={false}
          />
        </Modal>
      </div>
    );
  }
}

export default edit;
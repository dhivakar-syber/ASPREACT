import * as React from 'react';
import { Form, Input, Modal, Table, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import SupplierStore from '../../../stores/supplierStore';
import { SupplierUserLookupTableDto } from '../../../services/supplier/dto/SupplierUserLookupTableDto';

export interface ICreateOrUpdateSupplierProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  supplierStore: SupplierStore;
}

interface SupplierLookupItem {
  id: number;
  displayName: string;
}



class CreateOrUpdateSupplier extends React.Component<ICreateOrUpdateSupplierProps> {
  state = {
    visibleSupplierLookup: false,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
  };

  // Fetch data from the store when component mounts
  pagedFilterAndSortedRequest = {
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name',
    keyword:''
  };
  async componentDidMount() {
    await this.getAllSupplierForLookupTable();
  }
  async getAllSupplierForLookupTable() {
      if (!this.props.supplierStore) {
          console.error('supplierStore is undefined');
          return;
      }
      
    this.props.supplierStore.getAllSupplierForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  
  showSupplierLookupModal = () => {
    this.setState({ visibleSupplierLookup: true });
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
  handleSupplierLookupCancel = () => {
    this.setState({ visibleSupplierLookup: false });
  };

  render() {
    

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const { visibleSupplierLookup, selectedSupplierLookupItem} = this.state;

    // Fetch lookupData from store
    const supplierData: SupplierUserLookupTableDto[] = this.props.supplierStore.supplierlookupdata?.items || []; 
    

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

    return (
      <div>
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('User')} width={550}>
          <Form ref={formRef} initialValues={initialData} onValuesChange={(changedValues, allValues) => {
      if (changedValues.supplierName && selectedSupplierLookupItem) {
        formRef.current?.setFieldsValue({
          supplierId: selectedSupplierLookupItem.id,
        });
      }
    }}>
      <Form.Item label={L('Name')} name={'name'} {...formItemLayout}>
              <Input
                onClick={this.showSupplierLookupModal} // Trigger supplier lookup modal
                value={selectedSupplierLookupItem?.displayName || ''}
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('SupplierId')} name="supplierId" {...formItemLayout} hidden>
              <Input />
            </Form.Item>
            <Form.Item label={L('Code')} name={'code'} {...formItemLayout}>
              <Input/>
            </Form.Item>
          </Form>
        </Modal>

        {/* Lookup Table Modal */}       
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
      </div>
    );
  }
}

export default CreateOrUpdateSupplier;
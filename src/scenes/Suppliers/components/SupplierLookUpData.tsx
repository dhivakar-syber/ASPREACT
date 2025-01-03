import * as React from 'react';
import { Form, Input, Modal,  Table, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import  supplierStore from '../../../stores/supplierStore'
import {SupplierUserLookupTableDto}  from '../../../services/supplier/dto/SupplierUserLookupTableDto';

export interface SupplierUserLookupTableDtoProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  supplierStore:supplierStore;
}

interface UserLookupTableDto{
  id:string;
  displayName:string;
}

class SupplierForLookupTable extends React.Component<SupplierUserLookupTableDtoProps> {
  state = {
    SupplierLookup: false,
    SupplierLookupItem: null as UserLookupTableDto | null,
  };

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
};

showSupplierLookupModal = () => {
  this.setState({ visibleLookup: true });
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
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const {SupplierLookup,SupplierLookupItem} = this.state;

    // Fetch lookupData from store
    const lookupData: SupplierUserLookupTableDto[] = this.props.supplierStore.supplierlookupdata?.items || [];
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
          <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Suppliers')} width={550}>
            <Form ref={formRef} initialValues={initialData} onValuesChange={(changedValues, allValues) => {
        if (changedValues.supplierNo && SupplierLookupItem) {
          formRef.current?.setFieldsValue({
            supplierId: SupplierLookupItem.id,
          });
        }
      }}>
        <Form.Item label={L('Supplier')} name={'supplierName'} {...formItemLayout}>
                <Input
                  onClick={this.showSupplierLookupModal} // Trigger supplier lookup modal
                  value={SupplierLookupItem?.displayName || ''}
                  readOnly
                />
              </Form.Item>
              <Form.Item label={L('SupplierId')} name="supplierId" {...formItemLayout} hidden>
                <Input />
      </Form.Item>
                         </Form>
          </Modal>
  
          {/* Lookup Table Modal */}
          <Modal
            title="supplier"
            visible={SupplierLookup}
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
  
  export default SupplierForLookupTable;
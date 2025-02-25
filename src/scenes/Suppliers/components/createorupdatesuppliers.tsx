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
interface UserLookupItem {
  id: number;
  displayName: string;
}



class CreateOrUpdateSupplier extends React.Component<ICreateOrUpdateSupplierProps> {
  state = {
    visibleSupplierLookup: false,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    visibleUserLookup: false,
    selectedUserLookupItem: null as UserLookupItem | null,
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
    await this.getAllSupplierForLookupTable();
    await this.getAllUserForLookupTable();
  }
  async getAllSupplierForLookupTable() {
      if (!this.props.supplierStore) {
          console.error('supplierStore is undefined');
          return;
      }
      
    this.props.supplierStore.getAllSupplierForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllUserForLookupTable() {
      if (!this.props.supplierStore) {
          console.error('supplierStore is undefined');
          return;
      }
      
    this.props.supplierStore.getAllUserForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  
  showSupplierLookupModal = () => {
    this.setState({ visibleSupplierLookup: true });
  };
  showUserLookupModal = () => {
    this.setState({ visibleUserLookup: true });
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
  handleUserLookupSelect = (record: UserLookupItem) => {
    this.setState(
      {
        selectedUserLookupItem: record, // Store the selected supplier item
        visibleUserLookup: false, // Close the supplier lookup modal
      },
      () => {
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          userName: record.displayName, // Set the supplier field
          userId: record.id, // Set the supplierId field
        });
      }
    );
  };
  handleUserLookupCancel = () => {
    this.setState({ visibleUserLookup: false });
  };


  handleSupplierPageChange = (pagination: any) => {
    
    // const { current = 1, pageSize = 10 } = pagination; // Default to 1 and 10 if undefined

    const current = typeof pagination === 'number' ? pagination : pagination?.current || 1;
    const pageSize = pagination?.pageSize || 10;

    const skipCount = (current - 1 ) * pageSize;
    const maxResultCount = pageSize;
  
// alert((pagination - 1) * pageSize);

    // Log for debugging
    console.log('Pagination Params:', {
      current,
      pageSize,
      skipCount,
      maxResultCount,
    });
  
    // Update state and fetch new data
    this.setState(
      {
        currentPage: current, // Use 'current' instead of 'pagination'
        pageSize: pageSize,
      },
      async () => {

       this.pagedFilterAndSortedRequest.skipCount = skipCount;
       this.pagedFilterAndSortedRequest.maxResultCount = maxResultCount;

       await this.getAllSupplierForLookupTable(); // Fetch new data with updated pagination
      },
      
    );
  };

  render() {
    

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const { visibleSupplierLookup, visibleUserLookup, selectedUserLookupItem} = this.state;

    // Fetch lookupData from store
    const supplierData: SupplierUserLookupTableDto[] = this.props.supplierStore.supplierlookupdata?.items || []; 
    const userData: SupplierUserLookupTableDto[] = this.props.supplierStore.userlookupdata?.items || []; 
    

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
    const userColumns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: UserLookupItem) => (
          <Button onClick={() => this.handleUserLookupSelect(record)}>Select</Button>
        ),
      },
    ];

    return (
      <div>
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Supplier')} width={550}>
          <Form ref={formRef} initialValues={initialData} onValuesChange={(changedValues, allValues) => {
      if (changedValues.userName && selectedUserLookupItem) {
        formRef.current?.setFieldsValue({
          userId: selectedUserLookupItem.id,
        });
      }
    }}>
      {/* <Form.Item label={L('Name')} name={'name'} {...formItemLayout}>
              <Input
                onClick={this.showSupplierLookupModal} // Trigger supplier lookup modal
                value={selectedSupplierLookupItem?.displayName || ''}
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('SupplierId')} name="supplierId" {...formItemLayout} hidden>
              <Input />
            </Form.Item> */}
            <Form.Item label={L('Name')} name={'name'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('Code')} name={'code'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('User')} name={'userName'} {...formItemLayout}>
              <Input 
                onClick={this.showUserLookupModal} // Trigger supplier lookup modal
                value={selectedUserLookupItem?.displayName || ''}
                readOnly
                />
            </Form.Item>
              <Form.Item label={L('User')} name="userId" {...formItemLayout} hidden>
              <Input />
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
        <Modal
          title="User"
          visible={visibleUserLookup}
          onCancel={this.handleUserLookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={userColumns}
            dataSource={userData}
            rowKey="id"
            pagination={false}
          />
        </Modal>
      </div>
    );
  }
}

export default CreateOrUpdateSupplier;
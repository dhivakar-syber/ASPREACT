import * as React from 'react';
import { Form, Input, Modal, Table, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import approvalWorkflowStore from '../../../stores/approvalWorkflowStore';
import { ApprovalWorkflowUserLookupTableDto } from '../../../services/approvalWorkflows/dto/approvalWorkflowUserLookupTableDto';
import { ApprovalWorkflowBuyerLookupTableDto } from '../../../services/approvalWorkflows/dto/approvalWorkflowBuyerLookupTableDto';
import { ApprovalWorkflowSupplierLookupTableDto } from '../../../services/approvalWorkflows/dto/approvalWorkflowSupplierLookupTableDto';

export interface ICreateOrUpdateApprovalWorkflowProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  approvalWorkflowStore: approvalWorkflowStore;
}

interface UserLookupItem {
  id: number;
  displayName: string;
}
interface User2LookupItem {
  id: number;
  displayName: string;
}
interface User3LookupItem {
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


class CreateOrUpdateApprovalWorkflows extends React.Component<ICreateOrUpdateApprovalWorkflowProps> {
  state = {
    visibleUserLookup: false,
    visibleUser2Lookup: false,
    visibleUser3Lookup: false,
    visibleSupplierLookup: false,
    visibleBuyerLookup: false,
    selectedUserLookupItem: null as UserLookupItem | null,
    selectedUser2LookupItem: null as User2LookupItem | null,
    selectedUser3LookupItem: null as User3LookupItem | null,
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
    await this.getAllUserForLookupTable();
    await this.getAllUser2ForLookupTable();
    await this.getAllUser3ForLookupTable();
    await this.getAllSupplierForLookupTable();
    await this.getAllBuyerForLookupTable();
  }
  async getAllUserForLookupTable() {
      if (!this.props.approvalWorkflowStore) {
          console.error('approvalWorkflowStore is undefined');
          return;
      }
      
    this.props.approvalWorkflowStore.getAllUserForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllUser2ForLookupTable() {
      if (!this.props.approvalWorkflowStore) {
          console.error('approvalWorkflowStore is undefined');
          return;
      }
      
    this.props.approvalWorkflowStore.getAllUserForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllUser3ForLookupTable() {
      if (!this.props.approvalWorkflowStore) {
          console.error('approvalWorkflowStore is undefined');
          return;
      }
      
    this.props.approvalWorkflowStore.getAllUserForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllSupplierForLookupTable() {
      if (!this.props.approvalWorkflowStore) {
          console.error('approvalWorkflowStore is undefined');
          return;
      }
      
    this.props.approvalWorkflowStore.getAllSupplierForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllBuyerForLookupTable() {
      if (!this.props.approvalWorkflowStore) {
          console.error('approvalWorkflowStore is undefined');
          return;
      }
      
    this.props.approvalWorkflowStore.getAllBuyerForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  

  // Open lookup modal or table
  showUserLookupModal = () => {
    this.setState({ visibleUserLookup: true });
  };
  showUser2LookupModal = () => {
    this.setState({ visibleUser2Lookup: true });
  };
  showUser3LookupModal = () => {
    this.setState({ visibleUser3Lookup: true });
  };
  showSupplierLookupModal = () => {
    this.setState({ visibleSupplierLookup: true });
  };
  showBuyerLookupModal = () => {
    this.setState({ visibleBuyerLookup: true });
  };

  // Handle selection from lookup table
  handleUserLookupSelect = (record: UserLookupItem) => {
    this.setState(
      {
        selectedUserLookupItem: record, // Store the selected item in state
        visibleUserLookup: false, // Close the lookup modal after selection
      },
      () => {
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          userName: record.displayName, 
          approvalBuyer: record.id, 
        });
      }
    );
  };
  handleUser2LookupSelect = (record: User2LookupItem) => {
    this.setState(
      {
        selectedUser2LookupItem: record, // Store the selected item in state
        visibleUser2Lookup: false, // Close the lookup modal after selection
      },
      () => {
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          userName2: record.displayName, 
          accountsApprover: record.id, 
        });
      }
    );
  };
  handleUser3LookupSelect = (record: User3LookupItem) => {
    this.setState(
      {
        selectedUser3LookupItem: record, // Store the selected item in state
        visibleUser3Lookup: false, // Close the lookup modal after selection
      },
      () => {
        const { formRef } = this.props;
        formRef.current?.setFieldsValue({
          userName3: record.displayName, 
          paymentApprover: record.id, 
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
  handleUserLookupCancel = () => {
    this.setState({ visibleUserLookup: false });
  };
  handleUser2LookupCancel = () => {
    this.setState({ visibleUser2Lookup: false });
  };
  handleUser3LookupCancel = () => {
    this.setState({ visibleUser3Lookup: false });
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
    const {visibleUserLookup,visibleUser2Lookup,visibleUser3Lookup, visibleSupplierLookup,visibleBuyerLookup, selectedUserLookupItem,selectedUser2LookupItem,selectedUser3LookupItem, selectedSupplierLookupItem,selectedBuyerLookupItem} = this.state;

    // Fetch lookupData from store
    const userData: ApprovalWorkflowUserLookupTableDto[] = this.props.approvalWorkflowStore.userlookupdata?.items || []; 
    const user2Data: ApprovalWorkflowUserLookupTableDto[] = this.props.approvalWorkflowStore.userlookupdata?.items || []; 
    const user3Data: ApprovalWorkflowUserLookupTableDto[] = this.props.approvalWorkflowStore.userlookupdata?.items || []; 
    const supplierData: ApprovalWorkflowSupplierLookupTableDto[] = this.props.approvalWorkflowStore.supplierlookupdata?.items || []; 
    const buyerData: ApprovalWorkflowBuyerLookupTableDto[] = this.props.approvalWorkflowStore.buyerlookupdata?.items || []; 

    // Define columns for the lookup table
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
    const user2Columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: User2LookupItem) => (
          <Button onClick={() => this.handleUser2LookupSelect(record)}>Select</Button>
        ),
      },
    ];
    const user3Columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
      {
        title: 'Action',
        key: 'action',
        render: (text: any, record: User3LookupItem) => (
          <Button onClick={() => this.handleUser3LookupSelect(record)}>Select</Button>
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
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Annexure Details')} width={550}>
          <Form ref={formRef} initialValues={initialData} onValuesChange={(changedValues, allValues) => {
      if (changedValues.userName && selectedUserLookupItem) {
        formRef.current?.setFieldsValue({
          approvalBuyer: selectedUserLookupItem.id,
        });
      }
      if (changedValues.userName2 && selectedUser2LookupItem) {
        formRef.current?.setFieldsValue({
          accountsApprover: selectedUser2LookupItem.id,
        });
      }
      if (changedValues.userName3 && selectedUserLookupItem) {
        formRef.current?.setFieldsValue({
          paymentApprover: selectedUserLookupItem.id,
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
      <Form.Item label={L('BuyerEmailAddress')} name={'userName'} {...formItemLayout}>
              <Input
                onClick={this.showUserLookupModal} // Trigger lookup table when clicked
                value={selectedUserLookupItem?.displayName || ''} // Safe access using optional chaining
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('ApprovalBuyer')} name="approvalBuyer" {...formItemLayout} hidden>
      <Input />
    </Form.Item>
      <Form.Item label={L('FandCEmailAddress')} name={'userName2'} {...formItemLayout}>
              <Input
                onClick={this.showUser2LookupModal} // Trigger lookup table when clicked
                value={selectedUser2LookupItem?.displayName || ''} // Safe access using optional chaining
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('AccountsApprover')} name="accountsApprover" {...formItemLayout} hidden>
      <Input />
    </Form.Item>
      <Form.Item label={L('CBFCEmailAddress')} name={'userName3'} {...formItemLayout}>
              <Input
                onClick={this.showUser3LookupModal} // Trigger lookup table when clicked
                value={selectedUser3LookupItem?.displayName || ''} // Safe access using optional chaining
                readOnly
              />
            </Form.Item>
            <Form.Item label={L('PaymentApprover')} name="paymentApprover" {...formItemLayout} hidden>
      <Input />
    </Form.Item>
          </Form>
        </Modal>

        {/* Lookup Table Modal */}
        <Modal
          title="Users"
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
        <Modal
          title="Users"
          visible={visibleUser2Lookup}
          onCancel={this.handleUser2LookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={user2Columns}
            dataSource={user2Data}
            rowKey="id"
            pagination={false}
          />
        </Modal>
        <Modal
          title="Users"
          visible={visibleUser3Lookup}
          onCancel={this.handleUser3LookupCancel}
          footer={null}
          width={600}
        >
          <Table
            columns={user3Columns}
            dataSource={user3Data}
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

export default CreateOrUpdateApprovalWorkflows;
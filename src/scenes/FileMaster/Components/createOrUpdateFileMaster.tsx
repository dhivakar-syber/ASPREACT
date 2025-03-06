import * as React from 'react';
import { Form, Input, Modal, Table, Button } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table'; //ts2724
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
//import { EnumMovementType } from '../../../enum';
import fileMasterStore from '../../../stores/fileMasterStore';
import { FileMasterPartLookupTableDto } from '../../../services/fileMaster/dto/FileMasterPartLookupTableDto';
import { FileMasterSupplierLookupTableDto } from '../../../services/fileMaster/dto/FileMasterSupplierLookupTableDto';
import { FileMasterBuyerLookupTableDto } from '../../../services/fileMaster/dto/FileMasterBuyerLookupTableDto';

export interface ICreateOrUpdateFileMasterDataProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  fileMasterStore: fileMasterStore;
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

// const MovementTypeSelect: React.FC<{ movementType: number, onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ movementType, onChange }) => {
//   const selectListMovementType = Object.keys(EnumMovementType)
//     .filter(key => !isNaN(Number(key)))
//     .map(key => ({
//       value: EnumMovementType[key as keyof typeof EnumMovementType],
//       text: L(`${EnumMovementType[key as keyof typeof EnumMovementType]}`),
//     }));

//   return (
//     <select
//       name="Movement Type"
//       value={movementType}
//       onChange={onChange}
//     >
//       {selectListMovementType.map(option => (
//         <option key={option.value} value={option.value}>
//           {option.text}
//         </option>
//       ))}
//     </select>
//   );
// };

class CreateOrUpdateFilemasterdata extends React.Component<ICreateOrUpdateFileMasterDataProps> {
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
      if (!this.props.fileMasterStore) {
          console.error('cbfcdatastore is undefined');
          return;
      }
      
    this.props.fileMasterStore.getAllPartForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllSupplierForLookupTable() {
      if (!this.props.fileMasterStore) {
          console.error('cbfcdatastore is undefined');
          return;
      }
      
    this.props.fileMasterStore.getAllSupplierForLookupTable(this.pagedFilterAndSortedRequest); 
  }
  async getAllBuyerForLookupTable() {
      if (!this.props.fileMasterStore) {
          console.error('cbfcdatastore is undefined');
          return;
      }
      
    this.props.fileMasterStore.getAllBuyerForLookupTable(this.pagedFilterAndSortedRequest); 
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
    const lookupData: FileMasterPartLookupTableDto[] = this.props.fileMasterStore.partlookupdata?.items || []; 
    const supplierData: FileMasterSupplierLookupTableDto[] = this.props.fileMasterStore.supplierlookupdata?.items || []; 
    const buyerData: FileMasterBuyerLookupTableDto[] = this.props.fileMasterStore.buyerlookupdata?.items || []; 

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
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} okText={L('Save')}  title={L('FileMaster')} width={550}>
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
            <Form.Item label={L('AnnexureId')} name={'annexureId'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('SupplementaryId')} name={'supplementaryId'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('FileName')} name={'fileName'} {...formItemLayout}>
              <Input />
            </Form.Item>
            <Form.Item label={L('Token')} name={'token'} {...formItemLayout}>
              <Input />
            </Form.Item>
            <Form.Item label={L('SupplementaryInvoicePath')} name={'supplementaryInvoicePath'} {...formItemLayout}>
              <Input />
            </Form.Item>
            <Form.Item label={L('AnnexurePath')} name={'snnexurePath'} {...formItemLayout}>
              <Input />
            </Form.Item>
            {/* <Form.Item label={L('MovementType')} name={'movementType'} {...formItemLayout}>
              <MovementTypeSelect
                movementType={initialData.movementType}
                onChange={(event) => {
                  formRef.current?.setFieldsValue({ movementType: event.target.value });
                }}
              />
            </Form.Item> */}
            
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

export default CreateOrUpdateFilemasterdata;
import * as React from 'react';
import { Form, Input, Modal, Select,Button,Table} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import buyerStore from '../../../stores/buyerstore';
//import { BuyerBuyerLookupTableDto } from '../../../services/buyers/dto/buyerBuyerLookupTableDto';
import { BuyerUserLookupTableDto } from '../../../services/buyers/dto/buyerUserLookupTableDto';

export interface ICreateOrUpdateBuyerProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  buyerStore: buyerStore;
}

interface BuyerLookupItem {
  id: number;
  displayName: string;
}

interface L3UserLookupItem {
  id: number;
  displayName: string;
}

interface L4UserLookupItem {
  id: number;
  displayName: string;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

    // const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    // const {visibleLookup, visibleSupplierLookup,visibleBuyerLookup, selectedLookupItem, selectedSupplierLookupItem,selectedBuyerLookupItem} = this.state;

    // // Fetch lookupData from store
    // const lookupData: CBFCdataPartLookupTableDto[] = this.props.cbfcdataStore.partlookupdata?.items || []; 
    // const supplierData: CBFCdataSupplierLookupTableDto[] = this.props.cbfcdataStore.supplierlookupdata?.items || []; 
    // const buyerData: CBFCdataBuyerLookupTableDto[] = this.props.cbfcdataStore.buyerlookupdata?.items || []; 

class CreateOrUpdateBuyer extends React.Component<ICreateOrUpdateBuyerProps> {
  state = {
    visibleBuyerLookup: false,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
    selectedL3UserLookupItem: null as L3UserLookupItem | null,
    selectedL4UserLookupItem: null as L4UserLookupItem | null,
  };

  pagedFilterAndSortedRequest = {
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name',
    keyword:''
  };
  // Fetch data from the store when component mounts
  async componentDidMount() {
    //console.log('Component mounted. Preparing to fetch buyer data...');
    const { initialData } = this.props;
  if (initialData && initialData.userId) {
    const selectedItem = this.props.buyerStore.buyerlookupdata?.items.find(
      (item: BuyerLookupItem) => item.id === initialData.userId
    );
    if (selectedItem) {
      this.setState({ selectedBuyerLookupItem: selectedItem });
    }
  }
    await this.getAllBuyerForLookupTable();
    await this.getAllL3UserForLookupTable();
    await this.getAllL4UserForLookupTable();
    //console.log('Buyer data fetched successfully');
  }

  async getAllBuyerForLookupTable() {
    if (!this.props.buyerStore) {
      console.error('buyerStore is undefined');
      return;
    }

        this.props.buyerStore.getAllBuyerForLookupTable(this.pagedFilterAndSortedRequest); 
  }

  async getAllL3UserForLookupTable() {
    if (!this.props.buyerStore) {
      console.error('buyerStore is undefined');
      return;
    }
    this.props.buyerStore.getAllBuyerl3UserForLookupTable(this.pagedFilterAndSortedRequest); 
  }

  async getAllL4UserForLookupTable() {
    if (!this.props.buyerStore) {
      console.error('buyerStore is undefined');
      return;
    }
    this.props.buyerStore.getAllBuyerl4UserForLookupTable(this.pagedFilterAndSortedRequest); 

  }

  showBuyerLookupModal = () => {
    this.setState({ visibleBuyerLookup: true });
  };

  handleBuyerLookupSelect = (record: BuyerLookupItem) => {
    //console.log('Selected record:', record);
  
    if (!record) {
      console.error('No record selected!');
      return;
    }
  
    // Update state and form values
    this.setState(
      {
        selectedBuyerLookupItem: record,
        visibleBuyerLookup: false,
      },
      () => {
        const { formRef } = this.props;
        if (formRef && formRef.current) {
          formRef.current.setFieldsValue({
            userName: record.displayName, // Match Form.Item name
            userId: record.id,
          });
        } else {
          console.error('formRef or formRef.current is undefined.');
        }
      }
    );
  };
  
  
  handleL3UserChange = (value: number) => {
    const selectedItem = this.props.buyerStore.l3userlookupdata?.items?.find(
      (item: L3UserLookupItem) => item.id === value
    );
    if (selectedItem) {
      this.setState({ selectedL3UserLookupItem: selectedItem });
    }
  };

  handleL4UserChange = (value: number) => {
    const selectedItem = this.props.buyerStore.l4userlookupdata?.items?.find(
      (item: L4UserLookupItem) => item.id === value
    );
    if (selectedItem) {
      this.setState({ selectedL4UserLookupItem: selectedItem });
    }
  };
  handleBuyerLookupCancel = () => {
    this.setState({ visibleBuyerLookup: false });
  };
  render() {
    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const { visibleBuyerLookup,selectedL3UserLookupItem, selectedL4UserLookupItem,selectedBuyerLookupItem } = this.state;

    // Fetch lookup data from the store
    const l3userData: L3UserLookupItem[] = this.props.buyerStore.l3userlookupdata?.items || [];
    const l4userData: L4UserLookupItem[] = this.props.buyerStore.l4userlookupdata?.items || [];
    const buyerData: BuyerUserLookupTableDto[] = this.props.buyerStore.buyerlookupdata?.items || []; 

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
    <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Buyers')} width={550}>
      <Form ref={formRef} initialValues={initialData} 
      onValuesChange={(changedValues, allValues) => {
    if (changedValues.l3User && selectedL3UserLookupItem) {
      formRef.current?.setFieldsValue({
        l3userId: selectedL3UserLookupItem.id,
      });
    }
    if (changedValues.l4User && selectedL4UserLookupItem) {
      formRef.current?.setFieldsValue({
       l4userId: selectedL4UserLookupItem.id,
      });
    }
    if (changedValues.buyerName && selectedBuyerLookupItem) {
      formRef.current?.setFieldsValue({
        userId: selectedBuyerLookupItem.id,
      });
    }
}}>
  <Form.Item label={L('Department')} name={'department'} {...formItemLayout}>
            <Input />
          </Form.Item>

  <Form.Item label={L('Name')} name={'name'} {...formItemLayout}>
            <Input />
          </Form.Item>

          <Form.Item label={L('ShortId')} name={'shortId'} {...formItemLayout}>
            <Input />
          </Form.Item>

          <Form.Item label={L('User')} name={'userName'} {...formItemLayout}>
            <Input 
             onClick={this.showBuyerLookupModal} // Trigger supplier lookup modal
             value={selectedBuyerLookupItem?.displayName || initialData.buyerName ||  ''}
             readOnly
             />
          </Form.Item>

          <Form.Item label={L('User')} name="userId" {...formItemLayout} hidden>
            <Input value={selectedBuyerLookupItem?.id || initialData.userId || 0} />
          </Form.Item>
          <Form.Item label={L('L4 User')} name={'l4User'} {...formItemLayout}>
            <Select
              value={selectedL4UserLookupItem?.id}
              onChange={this.handleL4UserChange}
              placeholder={L('Select L4 User')}
            >
              {l4userData.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.displayName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={L('L3 User')} name={'l3User'} {...formItemLayout}>
            <Select
              value={selectedL3UserLookupItem?.id}
              onChange={this.handleL3UserChange}
              placeholder={L('Select L3 User')}
            >
              {l3userData.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.displayName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
{/* 
          <Form.Item label={L('L3 User')} name="l3userId" {...formItemLayout} hidden>
            <Input />
          </Form.Item> */}          
{/* 
          <Form.Item label={L('Name')} name="userId" {...formItemLayout} hidden>
            <Input />
          </Form.Item> */}

          {/* <Form.Item label={L('Reporting To')} name={'reportingTo'} {...formItemLayout}>
            <Input />
          </Form.Item> */}
        </Form>
        </Modal>

              {/* Lookup Table Modal */}
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

export default CreateOrUpdateBuyer;

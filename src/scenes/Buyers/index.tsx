import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateBuyer from './components/createOrUpdateBuyer';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import buyerStore from '../../stores/buyerstore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
//import { EnumCurrency,EnumTransaction } from '../../../src/enum'

export interface IBuyerProps {
  buyerStore: buyerStore;
}

export interface IBuyerStore {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  buyerId: number;
  filter: string;
  nameFilter:string;
  shortIdFilter:string;
  departmentFilter:string;
  reportingToFilter:string;
  userNameFilter:string;
  userName2Filter:string;
  userName3Filter:string;
  showAdvancedFilters: boolean;
}
interface buyerLookupItem {
  id: number;
  displayName: string;
};
interface l3UserLookupItem  {
  id: number;
  displayName: string;
};
interface l4UserLookupItem  {
  id: number;
  displayName: string;
};

const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.BuyerStore)
@observer
class Buyers extends AppComponentBase<IBuyerProps, IBuyerStore> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    buyerId: 0,
    filter: '',
    nameFilter:'',
    shortIdFilter:'',
    departmentFilter:'',
    reportingToFilter:'',
    userNameFilter:'',
    userName2Filter:'',
    userName3Filter:'',
    showAdvancedFilters: false,
    //selectedLookupItem: null as LookupItem | null,
    selectedBuyerLookupItem: null as buyerLookupItem | null,
    selectedL3UserLookupItem: null as l3UserLookupItem | null,
    selectedL4UserLookupItem: null as l4UserLookupItem | null,
  };

  async componentDidMount() {
    await this.getAll();
  }

  componentDidUpdate(prevProps: IBuyerProps) {
    // Check if the `editUser` data has changed from the backend
    if (this.props.buyerStore.editUser !== prevProps.buyerStore.editUser) {
      // Update the form values when the data changes
      this.formRef.current?.setFieldsValue({
        ...this.props.buyerStore.editUser,
      });
    }
  }
  async getAll() {
    if (!this.props.buyerStore) {
        console.error('buyerStore is undefined');
        return;
    }
    const filters = {
      filter:this.state.filter,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter, // global filter (if any)
      nameFilter: this.state.nameFilter, // name filter
      shortIdFilter: this.state.shortIdFilter, // short ID filter
      departmentFilter: this.state.departmentFilter, // department filter
      reportingToFilter: this.state.reportingToFilter, // reportingTo filter
      userNameFilter: this.state.userNameFilter, // username filter
      userName2Filter: this.state.userName2Filter, // L3 username filter
      userName3Filter: this.state.userName3Filter // L4 username filter
    };
  
    await this.props.buyerStore.getAll(filters);
  }

  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  toggleAdvancedFilters = () => {
    this.setState((prevState) => ({
      showAdvancedFilters: !prevState.showAdvancedFilters,
    }));
  };
  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.buyerStore.createBuyer();
    } else {
      await this.props.buyerStore.get(entityDto);
    }

   // this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.buyerStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.buyerStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  resetFilters = () => {
    this.setState({
      nameFilter: '', // Reset name filter
      shortIdFilter: '', // Reset short ID filter
      departmentFilter: '', // Reset department filter
      reportingToFilter: '', // Reset reportingTo filter
      userNameFilter: '', // Reset username filter
      userName2Filter: '', // Reset L3 username filter
      userName3Filter: '', // Reset L4 username filter
      // Add additional filters here if needed
    },
    () => {
      this.getAll(); // Call the data-refresh function after resetting the filters
    }
  );
};
  
editdata:any = null;
  handleCreate = () => {
    const form = this.formRef.current;
    const { selectedL3UserLookupItem } = this.state;
    if (selectedL3UserLookupItem?.id) { 
      form?.setFieldsValue({ l3User: selectedL3UserLookupItem.id });
    }
    const { selectedL4UserLookupItem } = this.state;
    if (selectedL4UserLookupItem?.id) { 
      form?.setFieldsValue({ l4User: selectedL4UserLookupItem.id });
    }
    const { selectedBuyerLookupItem } = this.state;
    if (selectedBuyerLookupItem?.id) { 
      form?.setFieldsValue({ userId: selectedBuyerLookupItem.id });
    }
    form!.validateFields().then(async (values: any) => {
      if (this.state.buyerId === 0) {
        await this.props.buyerStore.create(values);
      } else {
        await this.props.buyerStore.update({ ...values, id: this.state.buyerId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };
  handleNameSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ nameFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.nameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleShortIdSearch = (value: string) => {
    this.setState({ shortIdFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.shortIdFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleDepartmentSearch = (value: string) => {
    this.setState({ departmentFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.departmentFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleReportingToSearch = (value: string) => {
    this.setState({ reportingToFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.reportingToFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleUserNameSearch = (value: string) => {
    this.setState({ userNameFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.userNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleL3UserSearch = (value: string) => {
    this.setState({ userName2Filter: value }, () => {
      console.log('Updated nameFilter:', this.state.userName2Filter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleL4UserSearch = (value: string) => {
    this.setState({ userName3Filter: value }, () => {
      console.log('Updated nameFilter:', this.state.userName3Filter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  public render() {
    console.log(this.props.buyerStore);
    const { buyer } = this.props.buyerStore;
    const columns = [
      {
          title: L('Actions'),
          width: 150,
          render: (text: string, item: any) => (
              <div>
                  <Dropdown
                      trigger={['click']}
                      overlay={
                          <Menu>
                              <Menu.Item
                            onClick={() => {
                              console.log('Buyer ID:', item.buyer?.id); // Log the buyer ID
                              this.setState({ buyerId: item.buyer?.id });
                              this.createOrUpdateModalOpen({ id: item.buyer?.id });
                            }}
                          >
                            {L('Edit')}
                          </Menu.Item>
                              <Menu.Item onClick={() => this.delete({ id: item.buyer?.id })}>
                                  {L('Delete')}
                              </Menu.Item>
                          </Menu>
                      }
                      placement="bottomLeft"
                  >
                      <Button type="primary" icon={<SettingOutlined />}>
                          {L('Actions')}
                      </Button>
                  </Dropdown>
              </div>
          ),
      },
      {
          title: L('Name'),
          dataIndex: 'buyer.name',
          key: 'name',
          width: 150,
          render: (text: string, record: any) => <div>{record.buyer?.name || ''}</div>,
      },
      {
          title: L('ShortId'),
          dataIndex: 'buyer.shortId',
          key: 'shortId',
          width: 150,
          render: (text: string, record: any) => <div>{record.buyer?.shortId || ''}</div>,
      },
      {
          title: L('Department'),
          dataIndex: 'buyer.department',
          key: 'department',
          width: 150,
          render: (text: string, record: any) => <div>{record.buyer?.department || ''}</div>,
      },
      {
          title: L('ReportingTo'),
          dataIndex: 'buyer.reportingTo',
          key: 'reportingTo',
          width: 150,
          render: (text: string, record: any) => <div>{record.buyer?.reportingTo || ''}</div>,
      },
      {
        title: L('UserName'),
        dataIndex: 'userName', // Matches the "name" in your JS code
        key: 'userName', // Assign a unique key for React rendering
        width: 150, // Adjust as needed
        render: (text: string) => <div>{text}</div> ,
      },      
      {
        title: L('L3UserName'),
        dataIndex: 'userName2', // Matches the "name" in your JS code
        key: 'userName2',
        width: 150,
        render: (text: string) => <div>{text}</div> , // Adjust to render the correct value
    },
    {
        title: L('L4UserName'),
        dataIndex: 'userName3', // Matches the "name" in your JS code
        key: 'userName3',
        width: 150,
        render: (text: string) => <div>{text}</div> 
    }, // Adjust to render the correct value  
  ];
  return (
    <Card>
      <Row>
        <Col
          xs={{ span: 4 }}
          sm={{ span: 4 }}
          md={{ span: 4 }}
          lg={{ span: 2 }}
          xl={{ span: 2 }}
          xxl={{ span: 2 }}
        >
          <h2>{L('Buyers')}</h2>
        </Col>
        <Col
          xs={{ span: 14 }}
          sm={{ span: 15 }}
          md={{ span: 15 }}
          lg={{ span: 1, offset: 21 }}
          xl={{ span: 1, offset: 21 }}
          xxl={{ span: 1, offset: 21 }}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => this.createOrUpdateModalOpen({ id: 0 })}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col sm={{ span: 10 }}>
          <Search placeholder={L('Filter')} onSearch={this.handleSearch} />
        </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col sm={{ span: 24 }}>
            <span
              className="text-muted clickable-item"
              onClick={this.toggleAdvancedFilters}
            >
              {this.state.showAdvancedFilters ? (
                <>
                  <i className="fa fa-angle-up"></i> {L('HideAdvancedFilters')}
                </>
              ) : (
                <>
                  <i className="fa fa-angle-down"></i> {L('ShowAdvancedFilters')}
                </>
              )}
            </span>
          </Col>

          {this.state.showAdvancedFilters && (
  <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
    <Col md={{ span: 4 }}>
    <label className="form-label">{L("Name")}</label>
      <Input
        //placeholder={L('Name Filter')}
        value={this.state.nameFilter} // Bind to state
        onChange={(e) => this.handleNameSearch(e.target.value)}
      />
    </Col>
    <Col md={{ span: 4 }}>
    <label className="form-label">{L("ShortId")}</label>
      <Input
        //placeholder={L('ShortId Filter')}
        value={this.state.shortIdFilter} // Bind to state
        onChange={(e) => this.handleShortIdSearch(e.target.value)}
      />
    </Col>
    <Col md={{ span: 4 }}>
    <label className="form-label">{L("Department")}</label>
      <Input
        //placeholder={L('Department Filter')}
        value={this.state.departmentFilter} // Bind to state
        onChange={(e) => this.handleDepartmentSearch(e.target.value)}
      />
    </Col>
    <Col md={{ span: 4 }}>
    <label className="form-label">{L("Reporting To")}</label>
      <Input
        //placeholder={L('ReportingTo Filter')}
        value={this.state.reportingToFilter} // Bind to state
        onChange={(e) => this.handleReportingToSearch(e.target.value)}
      />
    </Col>
    <Col md={{ span: 4 }}>
    <label className="form-label">{L("UserName")}</label>
      <Input
        //placeholder={L('UserName Filter')}
        value={this.state.userNameFilter} // Bind to state
        onChange={(e) => this.handleUserNameSearch(e.target.value)}
      />
    </Col>
    <Col md={{ span: 4 }}>
    <label className="form-label">{L("L3User")}</label>
      <Input
        //placeholder={L('L3User Filter')}
        value={this.state.userName2Filter} // Bind to state
        onChange={(e) => this.handleL3UserSearch(e.target.value)}
      />
    </Col>
    <Col md={{ span: 4 }}>
    <label className="form-label">{L("L4User")}</label>
      <Input
        //placeholder={L('L4User Filter')}
        value={this.state.userName3Filter} // Bind to state
        onChange={(e) => this.handleL4UserSearch(e.target.value)}
      />
    </Col>
       {/* Reset Button */}
       <Col md={24} style={{ textAlign: "right", marginTop: 20 }}>
         <Button type="default" onClick={this.resetFilters}>
           {L("Reset")}
         </Button>
       </Col>
  </Row>
)}

  </Row>
      <Row style={{ marginTop: 20 }}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 24 }}
          xl={{ span: 24 }}
          xxl={{ span: 24 }}
        >
          <Table
            rowKey={(record) => record.Buyer?.id?.toString()}
            bordered
            columns={columns}
            pagination={{
              pageSize: 10,
              total: buyer?.totalCount || 0,
              defaultCurrent: 1,
            }}
            loading={buyer === undefined}
            dataSource={buyer?.items || []}
            onChange={this.handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        </Col>
      </Row>
      <CreateOrUpdateBuyer
        formRef={this.formRef}
        visible={this.state.modalVisible}
        onCancel={() => {
          this.setState({
            modalVisible: false,
          });
          this.formRef.current?.resetFields();
        }}
        modalType={this.state.buyerId === 0 ? 'create' : 'edit'}
        onCreate={this.handleCreate}
        initialData={{
          name: '',
          shortId: '',
          department: '',
          reportingTo: '',
          userName: '',
          userName2: '',
          userName3: ''
        }}
        buyerStore={this.props.buyerStore}
      />
    </Card>
    
  );
  
  }
}

export default Buyers;

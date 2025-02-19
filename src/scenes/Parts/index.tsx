import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import Createorupdateparts from './components/createorupdateparts';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import PartsStore from '../../stores/partsStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import sessionService from '../../services/session/sessionService';


const getUserPermissions = async (): Promise<string[]> => {
  try {
    // Fetch the current login information asynchronously
    const currentLoginInfo = await sessionService.getCurrentLoginInformations();
    console.log('User',currentLoginInfo);
    // Assuming permissions are inside the 'permissions' field of the object
    const permissions: string[] = currentLoginInfo?.user?.permissions || [];
    console.log('permissions',permissions)
    return permissions;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];  // Return an empty array if there's an error
  }
};

const hasPermission = async (permission: string): Promise<boolean> => {
  const userPermissions = await getUserPermissions();
  return userPermissions.includes(permission);
};

hasPermission("Pages.Administration.Parts").then(hasPerm => {
  console.log('is',hasPerm);  // true or false based on the session data
});

export interface IPartsProps {
  partsStore: PartsStore;
}

export interface IPartsState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
  PartNoFilter:string;
  DescriptionFilter:string;
  BuyerNameFilter:string;
  SupplierNameFilter:string;
  showAdvancedFilters: boolean;
  hasCreatePermission: boolean;
  hasDeletePermission: boolean;
  hasEditPermission: boolean;
}
type LookupItem = {
  id: number;
  displayName: string;
};
type SupplierLookupItem = {
  id: number;
  displayName: string;
};
type BuyerLookupItem = {
  id: number;
  displayName: string;
};
const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.PartsStore)
@observer
class Parts extends AppComponentBase<IPartsProps, IPartsState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    PartNoFilter:'',
    DescriptionFilter:'',
    BuyerNameFilter:'',
    SupplierNameFilter:'',
    showAdvancedFilters: false,
    hasCreatePermission: false,
    hasDeletePermission: false,
    hasEditPermission: false,
    selectedLookupItem: null as LookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,

  };

  async componentDidMount() {
    await this.getAll();
    await this.checkPermissions();
  }

  checkPermissions = async () => {
    const hasPermissionCreate = await hasPermission("Pages.Administration.Parts.Create");
    this.setState({ hasCreatePermission: hasPermissionCreate });
    const hasPermissionDelete = await hasPermission("Pages.Administration.Parts.Delete");
    this.setState({ hasDeletePermission: hasPermissionDelete });
    const hasPermissionEdit = await hasPermission("Pages.Administration.Parts.Edit");
    this.setState({ hasEditPermission: hasPermissionEdit });
  };
  async getAll() {
    if (!this.props.partsStore) {
        console.error('partstore is undefined');
        return;
    }
    const filters = {
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter, // global filter (if any)
      filter:this.state.filter,
      PartNoFilter:this.state.PartNoFilter,
      DescriptionFilter:this.state.DescriptionFilter,
      BuyerNameFilter:this.state.BuyerNameFilter,
      SupplierNameFilter:this.state.SupplierNameFilter
    }
    await this.props.partsStore.getAll(filters);
    //await this.props.partsStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
     // await this.props.partsStore.createParts();
    } else {
      await this.props.partsStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.partsStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.partsStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  resetFilters = () => {
    this.setState({
      PartNoFilter:'',
      DescriptionFilter:'',
      BuyerNameFilter:'',
      SupplierNameFilter:'',
},
  
    () => {
      this.getAll(); // Call the data-refresh function after resetting the filters
    }
  );
};
editdata:any = null;
  handleCreate = () => {
    const form = this.formRef.current;
    const { selectedLookupItem } = this.state;
    if (selectedLookupItem?.id) { 
      form?.setFieldsValue({ partId: selectedLookupItem.id });
    }
    const { selectedSupplierLookupItem } = this.state;
    if (selectedSupplierLookupItem?.id) { 
      form?.setFieldsValue({ supplierId: selectedSupplierLookupItem.id });
    }
    const { selectedBuyerLookupItem } = this.state;
    if (selectedBuyerLookupItem?.id) { 
      form?.setFieldsValue({ buyerId: selectedBuyerLookupItem.id });
    }
    form!.validateFields().then(async (values: any) => {
      if (this.state.userId === 0) {
        await this.props.partsStore.create(values);
      } else {
        await this.props.partsStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  handleDescriptionSearch = (value: string) => {
    // Update the state and call getAll() once the state is updated
    this.setState({ DescriptionFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.DescriptionFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  handlePartPartNoSearch = (value: string) => {
    this.setState({ PartNoFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.PartNoFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleSupplierNameSearch = (value: string) => {
    this.setState({ SupplierNameFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.SupplierNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleBuyerNameSearch = (value: string) => {
    this.setState({ BuyerNameFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.BuyerNameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  // handleexcelexport = () =>{
  //   this.props.cbfcdataStore.getExcelExport();
  // }
  
  
   

  public render() {
    console.log(this.props.partsStore);
    const { parts } = this.props.partsStore;
    const { hasCreatePermission,hasEditPermission,hasDeletePermission } = this.state;
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
                      {hasEditPermission && (
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.part?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasDeletePermission && (
                      <Menu.Item onClick={() => this.delete({ id: item.part?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('PartNo'), dataIndex: 'part.partNo', key: 'deliveryNote', width: 150, render: (text: string, record: any) =>
        <div>{record.part?.partNo || ''}</div> },
      { title: L('Description'), dataIndex: 'part.description', key: 'deliveryNoteDate', width: 150, render: (text: string, record: any) =>
        <div>{record.part?.description || ''}</div> },
     
      { title: L('BuyerName'), dataIndex: 'buyerName', key: 'buyerFk.name', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('SupplierName'), dataIndex: 'supplierName', key: 'supplierFk.name', width: 150, render: (text: string) => <div>{text}</div> },
      
    ];

    return (
      <Card>
        <Row>
          <Col
            xs={{ span: 4, offset: 0 }}
            sm={{ span: 4, offset: 0 }}
            md={{ span: 4, offset: 0 }}
            lg={{ span: 2, offset: 0 }}
            xl={{ span: 2, offset: 0 }}
            xxl={{ span: 2, offset: 0 }}
          >
            {' '}
            <h2>{L('Parts')}</h2>
          </Col>

          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            {hasCreatePermission && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{ marginLeft: '-100px' }}>Create Parts</Button>)}
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
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
                <label className="form-label">{L("Description")}</label>
                <Input
                  //placeholder={L('Description Filter')}
                  value = {this.state.DescriptionFilter}
                  onChange={(e) => this.handleDescriptionSearch(e.target.value)} />
              </Col>
              <Col md={{ span: 4 }}>
                <label className="form-label">{L("Part No")}</label>
                <Input
                  //placeholder={L('Part No Filter')
                  value = {this.state.PartNoFilter}
                  onChange={(e) => this.handlePartPartNoSearch(e.target.value)} />
              </Col>
              <Col md={{ span: 4 }}>
                <label className="form-label">{L("Supplier Name")}</label>
                <Input
                  //placeholder={L('Supplier Name Filter')}
                  value = {this.state.SupplierNameFilter}
                  onChange={(e) => this.handleSupplierNameSearch(e.target.value)} />
              </Col>
              <Col md={{ span: 4 }}>
                <label className="form-label">{L("Buyer Name")}</label>
                <Input
                  //placeholder={L('Buyer Name Filter')}
                  value = {this.state.BuyerNameFilter}
                  onChange={(e) => this.handleBuyerNameSearch(e.target.value)} />
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
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 24, offset: 0 }}
          md={{ span: 24, offset: 0 }}
          lg={{ span: 24, offset: 0 }}
          xl={{ span: 24, offset: 0 }}
          xxl={{ span: 24, offset: 0 }}
        >
          <Table
            rowKey={(record) => record.Part?.Id.toString()}
            bordered={true}
            columns={columns}
            pagination={{ pageSize: 10, total: parts === undefined ? 0 : parts.totalCount, defaultCurrent: 1 }}
            loading={parts === undefined ? true : false}
            dataSource={parts === undefined ? [] : parts.items}
            onChange={this.handleTableChange}
            scroll={{ x: 'max-content' }} />
        </Col>
      </Row>
      <Createorupdateparts
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.userId === 0 ? 'edit' : 'create'}
          onCreate={this.handleCreate}
          initialData={{
            deliveryNote: '',
            deliveryNoteDate: '',
            transaction: 0,
            paidAmount: 0,
            year: 0,
          }}
          partStore={this.props.partsStore} 
          />
      </Card>
    );
  }
}

export default Parts;

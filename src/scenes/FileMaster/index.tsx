
import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateGRNData from './Components/createOrUpdateFileMaster';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import fileMasterStore from '../../stores/fileMasterStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
//import { EnumMovementType } from '../../enum'

const userPermissions = ["Pages.Administration.FileMasters.Create", "Pages.Administration.FileMasters.Edit","Pages.Administration.FileMasters.Delete"];
const hasPermission = (permission: string): boolean => userPermissions.includes(permission);

export interface IFileMasterdataProps {
  filemasterStore: fileMasterStore;
}

export interface IfileMasterState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
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

@inject(Stores.FilemasterStore)
@observer
class FileMaster extends AppComponentBase<IFileMasterdataProps, IfileMasterState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    selectedLookupItem: null as LookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    if (!this.props.filemasterStore) {
        console.error('fileMasterStore is undefined');
        return;
    }
    await this.props.filemasterStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
  }

  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  async createOrUpdateModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      await this.props.filemasterStore.fileMasterData();
    } else {
      await this.props.filemasterStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.filemasterStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.filemasterStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
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
        await this.props.filemasterStore.create(values);
      } else {
        await this.props.filemasterStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  // handleFileUpload = (event:any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.props.fileMasterStore.importExcel(file);
  //   }
  // };

  public render() {
    console.log(this.props.filemasterStore);
    const { fileMaster } = this.props.filemasterStore;
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
                      {hasPermission("Pages.Administration.FileMasters.Edit") && (
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.fileMaster?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasPermission("Pages.Administration.FileMasters.Delete") && (
                      <Menu.Item onClick={() => this.delete({ id: item.fileMaster?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('AnnexureId'), dataIndex: 'fileMaster.annexureId', key: 'annexureId', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.annexureId || ''}</div> },
      { title: L('SupplementaryId'), dataIndex: 'fileMaster.supplementaryId', key: 'supplementaryId', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.supplementaryId || ''}</div> },
      { title: L('FileName'), dataIndex: 'fileMaster.fileName', key: 'fileName', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.fileName || ''}</div> },
      { title: L('Token'), dataIndex: 'fileMaster.token', key: 'token', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.token || ''}</div> },
      { title: L('SupplementaryInvoicePath'), dataIndex: 'fileMaster.supplementaryInvoicePath', key: 'supplementaryInvoicePath', width: 150, render: (text: string, record: any) =>
       <div>{record.fileMaster?.supplementaryInvoicePath || ''}</div> },
      { title: L('AnnexurePath'), dataIndex: 'fileMaster.annexurePath', key: 'annexurePath', width: 150, render: (text: string, record: any) =>
        <div>{record.fileMaster?.annexurePath || ''}</div> },      
      { title: L('PartNo'), dataIndex: 'partPartNo', key: 'partFk.partNo', width: 150, render: (text: string) => <div>{text}</div> },
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
            <h2>{L('FileMasterData')}</h2>
          </Col>
          {/* <Col
                      xs={{ span: 14, offset: 0 }}
                      sm={{ span: 15, offset: 0 }}
                      md={{ span: 15, offset: 0 }}
                      lg={{ span: 1, offset: 21 }}
                      xl={{ span: 1, offset: 21 }}
                      xxl={{ span: 1, offset: 19 }}
                    >  <div>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                          <Menu>
                          <Menu.Item>
                            <label style={{ cursor: 'pointer' }}>
                              <input type="file" accept=".xlsx, .xls"  style={{ display: 'none' }}  onChange={this.handleFileUpload} />
                              {L('ImportExcel')}
                            </label>
                          </Menu.Item>
                          <Menu.Item onClick={this.handleexcelexport}>
                            {L('ExportExcel')}
                          </Menu.Item> 
                        </Menu>
                        
                        }
                          placement="bottomLeft">            
                        <Button type="primary" icon={<SettingOutlined />} style={{marginLeft: '-150px'}}>
                          {L('Excel Operation')}
                        </Button>
                    </Dropdown>
                  </div>
          
                    </Col>
                    <br />
                    <br />
                    <br /> */}
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >

            {hasPermission('Pages.Administration.FileMasters.Create') && (
            <Button type="primary"  icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-100px'}}>Create FileMaster</Button>)}
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 10, offset: 0 }}>
            <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
          </Col>
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
              rowKey={(record) => record.FileMaster?.Id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: fileMaster === undefined ? 0 : fileMaster.totalCount, defaultCurrent: 1 }}
              loading={fileMaster === undefined ? true : false}
              dataSource={fileMaster === undefined ? [] : fileMaster.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateGRNData
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
          fileMasterStore={this.props.filemasterStore}
        />
      </Card>
    );
  }
}

export default FileMaster;



 


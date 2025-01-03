import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateAnnexureDetails from './components/createOrUpdateAnnexureDetails';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import annexureDetailsStore from '../../stores/annexureDetailsStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { EnumCurrency } from '../../../src/enum'

const userPermissions = ["Pages.Administration.AnnexureDetails.Create", "Pages.Administration.AnnexureDetails.Edit","Pages.Administration.AnnexureDetails.Delete"];
const hasPermission = (permission: string): boolean => userPermissions.includes(permission);

export interface IAnnexureDetailsProps {
  annexureDetailsStore: annexureDetailsStore;
}

export interface IAnnexureDetailsState {
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

@inject(Stores.AnnexureDetailsStore)
@observer
class AnnexureDetails extends AppComponentBase<IAnnexureDetailsProps, IAnnexureDetailsState> {
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
    if (!this.props.annexureDetailsStore) {
        console.error('annexureDetailsStore is undefined');
        return;
    }
    await this.props.annexureDetailsStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
      await this.props.annexureDetailsStore.createAnnexureDetail();
    } else {
      await this.props.annexureDetailsStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.annexureDetailsStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.annexureDetailsStore.delete(input);
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
        await this.props.annexureDetailsStore.create(values);
      } else {
        await this.props.annexureDetailsStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  // handleexcelexport = () =>{
  //   this.props.cbfcdataStore.getExcelExport();
  // }
  
  
  //  handleFileUpload = (event:any) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       this.props.annexureDetailsStore.importExcel(file);
  //     }
  //   };

  public render() {
    console.log(this.props.annexureDetailsStore);
    const { annexureDetail } = this.props.annexureDetailsStore;
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
                      {hasPermission("Pages.Administration.AnnexureDetails.Edit") && (
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.annexureDetail?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasPermission("Pages.Administration.AnnexureDetails.Delete") && (
                      <Menu.Item onClick={() => this.delete({ id: item.annexureDetail?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('InvoiceNo'), dataIndex: 'annexureDetail.invoiceNo', key: 'invoiceNo', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.invoiceNo || ''}</div> },
      { title: L('InvoiceDate'), dataIndex: 'annexureDetail.invoiceDate', key: 'invoiceDate', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.invoiceDate || ''}</div> },
      { title: L('ContractValidFrom'), dataIndex: 'annexureDetail.contractValidFrom', key: 'contractValidFrom', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.contractValidFrom || ''}</div> },
      { title: L('ContractValidTo'), dataIndex: 'annexureDetail.contractValidTo', key: 'contractValidTo', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.contractValidTo || ''}</div> },
      { title: L('ContractNo'), dataIndex: 'annexureDetail.contractNo', key: 'contractNo', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.contractNo || ''}</div> },
      { title: L('OldValue'), dataIndex: 'annexureDetail.oldValue', key: 'oldValue', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.oldValue || ''}</div> },
      { title: L('NewValue'), dataIndex: 'annexureDetail.newValue', key: 'newValue', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.newValue || ''}</div> },
      { title: L('DiffValue'), dataIndex: 'annexureDetail.diffValue', key: 'diffValue', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.diffValue || ''}</div> },
      { title: L('qty'), dataIndex: 'annexureDetail.qty', key: 'qty', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.qty || ''}</div> },
      { title: L('Total'), dataIndex: 'annexureDetail.total', key: 'total', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.total || ''}</div> },
        { title: L('Currency'), dataIndex: 'annexureDetail.currency', key: 'currency', width: 150, render: (text: string, record: any) => {
          const currencyvalue = record.annexureDetail?.currency;
          const currencyText = EnumCurrency[currencyvalue] || '';
          return <div>{currencyText}</div>;
      } },
      { title: L('SupplementaryInvoiceNo'), dataIndex: 'annexureDetail.supplementaryInvoiceNo', key: 'supplementaryInvoiceNo', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.supplementaryInvoiceNo || ''}</div> },
      { title: L('SupplementaryInvoiceDate'), dataIndex: 'annexureDetail.supplementaryInvoiceDate', key: 'supplementaryInvoiceDate', width: 150, render: (text: string, record: any) =>
        <div>{record.annexureDetail?.supplementaryInvoiceDate || ''}</div> },
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
            <h2>{L('AnnexureDetails')}</h2>
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
            <Button type="primary"  icon={<PlusOutlined/>} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} style={{marginLeft:'-50px'}}>Create Annexure Details</Button>
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
              rowKey={(record) => record.AnnexureDetail?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: annexureDetail === undefined ? 0 : annexureDetail.totalCount, defaultCurrent: 1 }}
              loading={annexureDetail === undefined ? true : false}
              dataSource={annexureDetail === undefined ? [] : annexureDetail.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateAnnexureDetails
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
          annexureDetailsStore={this.props.annexureDetailsStore}
        />
      </Card>
    );
  }
}

export default AnnexureDetails;

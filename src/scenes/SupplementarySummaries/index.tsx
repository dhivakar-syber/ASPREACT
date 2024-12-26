import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateSupplementarySummaries from './components/createOrUpdateSupplementarySummaries';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import supplementarySummariesStore from '../../stores/supplementarySummariesStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { DocumentStatus} from '../../enum'

const userPermissions = ["Pages.Administration.SupplementarySummaries.Create", "Pages.Administration.SupplementarySummaries.Edit","Pages.Administration.SupplementarySummaries.Delete"];
const hasPermission = (permission: string): boolean => userPermissions.includes(permission);


export interface ISupplementarySummariesProps {
    supplementarySummariesStore: supplementarySummariesStore;
}

export interface ISupplementarySummariesState {
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

@inject(Stores.SupplementarySummariesStore)
@observer
class SupplementarySummaries extends AppComponentBase<ISupplementarySummariesProps, ISupplementarySummariesState> {
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
    if (!this.props.supplementarySummariesStore) {
        console.error('supplementarySummariesStore is undefined');
        return;
    }
    await this.props.supplementarySummariesStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
      await this.props.supplementarySummariesStore.createSupplementarySummary();
    } else {
      await this.props.supplementarySummariesStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.supplementarySummariesStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.supplementarySummariesStore.delete(input);
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
        await this.props.supplementarySummariesStore.create(values);
      } else {
        await this.props.supplementarySummariesStore.update({ ...values, id: this.state.userId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  public render() {
    console.log(this.props.supplementarySummariesStore);
    const { supplementarySummary } = this.props.supplementarySummariesStore;
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
                      {hasPermission("Pages.Administration.SupplementarySummaries.Edit") && (
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.supplementarySummary?.id })}>{L('Edit')}</Menu.Item>)}
                      {hasPermission("Pages.Administration.SupplementarySummaries.Delete") && (
                      <Menu.Item onClick={() => this.delete({ id: item.supplementarySummary?.id })}>{L('Delete')}</Menu.Item>)}
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
      { title: L('SupplementaryInvoiceNo'), dataIndex: 'supplementarySummary.supplementaryInvoiceNo', key: 'SupplementaryInvoiceNo', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.supplementaryInvoiceNo || ''}</div> },
      { title: L('SupplementaryInvoiceDate'), dataIndex: 'supplementarySummary.SupplementaryInvoiceDate', key: 'SupplementaryInvoiceDate', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.SupplementaryInvoiceDate || ''}</div> },
      { title: L('supplementaryInvoiceFileId'), dataIndex: 'supplementarySummary.supplementaryInvoiceFileId', key: 'SupplementaryInvoiceFileId', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.supplementaryInvoiceFileId || ''}</div> },
      { title: L('AnnexureFileId'), dataIndex: 'supplementarySummary.annexureFileId', key: 'AnnexureFileId', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.annexureFileId || ''}</div> },
      { title: L('ContractFromDate'), dataIndex: 'supplementarySummary.contractFromDate', key: 'ContractFromDate', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.contractFromDate || ''}</div> },
      { title: L('ContractToDate'), dataIndex: 'supplementarySummary.contractToDate', key: 'ContractToDate', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.contractToDate || ''}</div> },
      { title: L('ContractNo'), dataIndex: 'supplementarySummary.contractNo', key: 'ContractNo', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.contractNo || ''}</div> },
      { title: L('ContractDate'), dataIndex: 'supplementarySummary.contractDate', key: 'ContractDate', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.contractDate || ''}</div> },
      { title: L('ApprovalDate'), dataIndex: 'supplementarySummary.approvalDate', key: 'ApprovalDate', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.approvalDate || ''}</div> },
      { title: L('ImplementationDate'), dataIndex: 'supplementarySummary.implementationDate', key: 'ImplementationDate', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.implementationDate || ''}</div> },
      { title: L('GRNQty'), dataIndex: 'supplementarySummary.grnQty', key: 'grnQty', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.grnQty || ''}</div> },
      { title: L('OldValue'), dataIndex: 'supplementarySummary.oldValue', key: 'OldValue', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.oldValue || ''}</div> },
      { title: L('NewValue'), dataIndex: 'supplementarySummary.newValue', key: 'NewValue', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.newValue || ''}</div> },
      { title: L('Delta'), dataIndex: 'supplementarySummary.delta', key: 'Delta', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.delta || ''}</div> },
      { title: L('Total'), dataIndex: 'supplementarySummary.total', key: 'Total', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.total || ''}</div> },
      { title: L('VersionNo'), dataIndex: 'supplementarySummary.versionNo', key: 'VersionNo', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.versionNo || ''}</div> },
      { title: L('PlantCode'), dataIndex: 'supplementarySummary.plantCode', key: 'PlantCode', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.plantCode || ''}</div> },
      { title: L('IsRejected'), dataIndex: 'supplementarySummary.isRejected', key: 'IsRejected', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.isRejected || ''}</div> },
      { title: L('AccountedValue'), dataIndex: 'supplementarySummary.accountedValue', key: 'AccountedValue', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.accountedValue || ''}</div> },
        { title: L('DocumentStatus'), dataIndex: 'supplementarySummary.DocumentStatus', key: 'documentStatus', width: 150, render: (text: string, record: any) => {
            const documentStatusvalue = record.supplementarySummary?.documentStatus;
            const documentStatusText = DocumentStatus[documentStatusvalue] || '';
            return <div>{documentStatusText}</div>;
        } },
      { title: L('isApproved'), dataIndex: 'supplementarySummary.isApproved', key: 'isApproved', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.isApproved || ''}</div> },
      { title: L('BuyerEmailAddress'), dataIndex: 'supplementarySummary.buyerEmailAddress', key: 'buyerEmailAddress', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.buyerEmailAddress || ''}</div> },
      { title: L('BuyerApprovalStatus'), dataIndex: 'supplementarySummary.buyerApprovalStatus', key: 'buyerApprovalStatus', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.buyerApprovalStatus || ''}</div> },
      { title: L('BuyerApproval'), dataIndex: 'supplementarySummary.buyerApproval', key: 'buyerApproval', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.buyerApproval || ''}</div> },
      { title: L('BuyerApprovedTime'), dataIndex: 'supplementarySummary.buyerApprovedTime', key: 'buyerApprovedTime', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.buyerApprovedTime || ''}</div> },
      { title: L('BuyerRejectedTime'), dataIndex: 'supplementarySummary.buyerRejectedTime', key: 'buyerRejectedTime', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.buyerRejectedTime || ''}</div> },
      { title: L('BuyerRemarks'), dataIndex: 'supplementarySummary.buyerRemarks', key: 'buyerRemarks', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.buyerRemarks || ''}</div> },
      { title: L('AccountantName'), dataIndex: 'supplementarySummary.accountantName', key: 'accountantName', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.accountantName || ''}</div> },
      { title: L('AccountantEmailAddress'), dataIndex: 'supplementarySummary.accountantEmailAddress', key: 'accountantEmailAddress', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.accountantEmailAddress || ''}</div> },
      { title: L('AccountantApprovalStatus'), dataIndex: 'supplementarySummary.accountantApprovalStatus', key: 'accountantApprovalStatus', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.accountantApprovalStatus || ''}</div> },
      { title: L('AccountApprovedTime'), dataIndex: 'supplementarySummary.accountApprovedTime', key: 'accountApprovedTime', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.accountApprovedTime || ''}</div> },
      { title: L('AccountRejectedTime'), dataIndex: 'supplementarySummary.accountRejectedTime', key: 'accountRejectedTime', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.accountRejectedTime || ''}</div> },
      { title: L('AccountRemarks'), dataIndex: 'supplementarySummary.accountRemarks', key: 'accountRemarks', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.accountRemarks || ''}</div> },
      { title: L('PayerName'), dataIndex: 'supplementarySummary.payerName', key: 'payerName', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.payerName || ''}</div> },
      { title: L('PayerEmailAddress'), dataIndex: 'supplementarySummary.payerEmailAddress', key: 'payerEmailAddress', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.payerEmailAddress || ''}</div> },
      { title: L('PaymentApprovalStatus'), dataIndex: 'supplementarySummary.paymentApprovalStatus', key: 'paymentApprovalStatus', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.paymentApprovalStatus || ''}</div> },
      { title: L('PaymentApproval'), dataIndex: 'supplementarySummary.paymentApproval', key: 'paymentApproval', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.paymentApproval || ''}</div> },
      { title: L('paymentApprovedTime'), dataIndex: 'supplementarySummary.paymentApprovedTime', key: 'paymentApprovedTime', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.paymentApprovedTime || ''}</div> },
      { title: L('paymentRejectedTime'), dataIndex: 'supplementarySummary.paymentRejectedTime', key: 'paymentRejectedTime', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.paymentRejectedTime || ''}</div> },
      { title: L('PaymentRemarks'), dataIndex: 'supplementarySummary.paymentRemarks', key: 'paymentRemarks', width: 150, render: (text: string, record: any) =>
        <div>{record.supplementarySummary?.paymentRemarks || ''}</div> },
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
            <h2>{L('supplementarySummary')}</h2>
          </Col>
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            {hasPermission('Pages.Administration.SupplementarySummaries.Create') && (
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} />)}
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
              rowKey={(record) => record.SupplementarySummary?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: supplementarySummary === undefined ? 0 : supplementarySummary.totalCount, defaultCurrent: 1 }}
              loading={supplementarySummary === undefined ? true : false}
              dataSource={supplementarySummary === undefined ? [] : supplementarySummary.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateSupplementarySummaries
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
          supplementarySummariesStore={this.props.supplementarySummariesStore}
        />
      </Card>
    );
  }
}

export default SupplementarySummaries;

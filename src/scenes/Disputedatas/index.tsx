import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import disputeStore from '../../stores/disputeStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import DisputeBuyerLookupTableDto from './components/CreateOrUpdateDispute';

export interface DisputeProps { 
    disputeStore: disputeStore;
} 

export interface DisputeState { 
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
}
type DisputeBuyerLookupItem = {
  id: number;
  displayName: string;
};
type DisputeSummaryLookupItem = {
  id: number;
  displayName: string;
};
type DisputeSupplierLookupItem = {
  id: number;
  displayName: string;
};
type DisputeSupplierRejectionLookupItem = {
    id: number;
    displayName: string;
  };
  type DisputeInputLookupItem = {
  id: number;
  displayName: string;
};
const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.DisputeStore)
@observer
class Disputedatas extends AppComponentBase<DisputeProps, DisputeState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    DisputeBuyerLookupItem: null as DisputeBuyerLookupItem | null,
    DisputeSummaryLookupItem: null as DisputeSummaryLookupItem | null,
    DisputeSupplierLookupItem: null as DisputeSupplierLookupItem | null,
    DisputeSupplierRejectionLookupItem: null as DisputeSupplierRejectionLookupItem | null,
    DisputeInputLookupItem: null as DisputeInputLookupItem | null,
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    if (!this.props.disputeStore) {
        console.error('disputeStore is undefined');
        return;
    }
    await this.props.disputeStore.getAll({ 
      maxResultCount: this.state.maxResultCount, 
      skipCount: this.state.skipCount, 
      keyword: this.state.filter });
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
    if (entityDto.id === 0 ) {
      await this.props.disputeStore.createDisputedatas();
    } else {
      await this.props.disputeStore.get(entityDto);
    } 

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.disputeStore.editUser });
    }, 100);
  } 

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.disputeStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
editdata:any = null;
  handleCreate = () => {
    const form = this.formRef.current;
    const { DisputeBuyerLookupItem } = this.state;
    if (DisputeBuyerLookupItem?.id) { 
      form?.setFieldsValue({ disputeId: DisputeBuyerLookupItem.id });
    }
    const { DisputeSummaryLookupItem } = this.state;
    if (DisputeSummaryLookupItem?.id) { 
      form?.setFieldsValue({ SupplementaryId: DisputeSummaryLookupItem.id });
    }
    const { DisputeSupplierLookupItem } = this.state;
    if (DisputeSupplierLookupItem?.id) { 
      form?.setFieldsValue({ supplierId: DisputeSupplierLookupItem.id });
    }
    const { DisputeSupplierRejectionLookupItem } = this.state;
    if (DisputeSupplierRejectionLookupItem?.id) { 
      form?.setFieldsValue({ rejectionId: DisputeSupplierRejectionLookupItem.id });
    }
    form!.validateFields().then(async (values: any) => {
      if (this.state.userId === 0) {
        await this.props.disputeStore.create(values);
      } else {
        await this.props.disputeStore.update({ ...values, id: this.state.userId });
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
    console.log(this.props.disputeStore);
    const { Disputedatas } = this.props.disputeStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.Disputedatas?.id })}>{L('Edit')}</Menu.Item>
                      <Menu.Item onClick={() => this.delete({ id: item.Disputedatas?.id })}>{L('Delete')}</Menu.Item>
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
      { title: L('UserId'), 
      dataIndex: 'Disputedatas.UserId', 
      key: 'UserId', 
      width: 150, 
      render: (text: string, record: any) =><div>{record.Disputedatas?.UserId || ''}</div> 
        },
      { title: L('Code'), dataIndex: 'Dispute.Code', key: 'Code', width: 150, render: (text: string, record: any) =>
        <div>{record.Disputedatas?.Code || ''}</div> },
        { title: L('Name'), dataIndex: 'Disputedatas.Name', key: 'Name', width: 150, render: (text: string, record: any) =>
        <div>{record.Disputedatas?.Name || ''}</div> },
        { title: L('BuyerRemark'), dataIndex: 'Disputedatas.BuyerRemark', key: 'BuyerRemark', width: 150, render: (text: string, record: any) =>
        <div>{record.Disputedatas?.BuyerRemark || ''}</div> },
        { title: L('SupplierId'), dataIndex: 'Disputedatas.SupplierId', key: 'SupplierId', width: 150, render: (text: string, record: any) =>
        <div>{record.Disputedatas?.SupplierId || ''}</div> },
        { title: L('Summaries'), dataIndex: 'Disputedatas.Summaries', key: 'Summaries', width: 150, render: (text: string, record: any) =>
        <div>{record.Disputedatas?.Summaries || ''}</div> },
        { title: L('ResponseTime'), dataIndex: 'Disputedatas.ResponseTime', key: 'ResponseTime', width: 150, render: (text: string, record: any) =>
        <div>{record.Disputedatas?.ResponseTime|| ''}</div> },
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
            <h2>{L('Disputedatas')}</h2>
          </Col>
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 21 }}
          >
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} />
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
              rowKey={(record) => record.Dispute?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: Disputedatas === undefined ? 0 : Disputedatas.totalCount, defaultCurrent: 1 }}
              loading={Disputedatas === undefined ? true : false}
              dataSource={Disputedatas === undefined ? [] : Disputedatas.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <DisputeBuyerLookupTableDto
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
          disputeStore={this.props.disputeStore}
        />
      </Card>
    );
  }
}

export default Disputedatas;

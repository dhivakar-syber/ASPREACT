import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrUpdateCBFCData from './components/createOrUpdateCBFCData';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import cbfcdataStore from '../../stores/cbfcdataStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { EnumCurrency,EnumTransaction } from '../../../src/enum'

export interface ICBFCdataProps {
  cbfcdataStore: cbfcdataStore;
}

export interface ICBFCdataState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  userId: number;
  filter: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.CBFCdataStore)
@observer
class CBFCDatas extends AppComponentBase<ICBFCdataProps, ICBFCdataState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    if (!this.props.cbfcdataStore) {
        console.error('cbfcdatastore is undefined');
        return;
    }
    await this.props.cbfcdataStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
      await this.props.cbfcdataStore.createCBFCData();
    } else {
      await this.props.cbfcdataStore.get(entityDto);
    }

    this.setState({ userId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.cbfcdataStore.editUser });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.cbfcdataStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
editdata:any = null;
  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.userId === 0) {
        await this.props.cbfcdataStore.create(values);
      } else {
        await this.props.cbfcdataStore.update({ ...values, id: this.state.userId });
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
    console.log(this.props.cbfcdataStore);
    const { cbfcdata } = this.props.cbfcdataStore;
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
                      <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.cbfCdata?.id })}>{L('Edit')}</Menu.Item>
                      <Menu.Item onClick={() => this.delete({ id: item.cbfCdata?.id })}>{L('Delete')}</Menu.Item>
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
      { title: L('DeliveryNote'), dataIndex: 'cbfCdata.deliveryNote', key: 'deliveryNote', width: 150, render: (text: string, record: any) =>
        <div>{record.cbfCdata?.deliveryNote || ''}</div> },
      { title: L('DeliveryNoteDate'), dataIndex: 'cbfCdata.deliveryNoteDate', key: 'deliveryNoteDate', width: 150, render: (text: string, record: any) =>
        <div>{record.cbfCdata?.deliveryNoteDate || ''}</div> },
      { title: L('Currency'), dataIndex: 'cbfCdata.currency', key: 'currency', width: 150, render: (text: string, record: any) => {
        const currencyvalue = record.cbfCdata?.currency;
        const currencyText = EnumCurrency[currencyvalue] || '';
        return <div>{currencyText}</div>;
    } },
      { title: L('Transaction'), dataIndex: 'cbfCdata.transaction', key: 'transaction', width: 150, render: (text: string, record: any) => {
        const transactionValue = record.cbfCdata?.transaction;
        const transactionText = EnumTransaction[transactionValue] || '';
        return <div>{transactionText}</div>;
    } },
      { title: L('PaidAmount'), dataIndex: 'cbfCdata.paidAmount', key: 'paidAmount', width: 150, render: (text: string, record: any) =>
        <div>{record.cbfCdata?.paidAmount || ''}</div> },
      { title: L('Year'), dataIndex: 'cbfCdata.year', key: 'year', width: 150, render: (text: string, record: any) =>
        <div>{record.cbfCdata?.year || ''}</div> },
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
            <h2>{L('CBFCdata')}</h2>
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
              rowKey={(record) => record.CBFCdata?.id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: cbfcdata === undefined ? 0 : cbfcdata.totalCount, defaultCurrent: 1 }}
              loading={cbfcdata === undefined ? true : false}
              dataSource={cbfcdata === undefined ? [] : cbfcdata.items}
              onChange={this.handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
        <CreateOrUpdateCBFCData //ts2769
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
          cbfcdataStore={this.props.cbfcdataStore}
        />
      </Card>
    );
  }
}

export default CBFCDatas;

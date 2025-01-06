import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
// import SupplierLookUpData from './components/SupplierLookUpData';
import Edit from './components/createorupdatesuppliers';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import supplierStore from '../../stores/supplierStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';

export interface SupplierdataProps { 
    supplierStore: supplierStore;
}

export interface SupplierdataState { 
    modalVisible: boolean;
    maxResultCount: number;
    skipCount: number;
    userId: number;
    filter: string;
}

type SupplierUserLookupTableDto = {
    id: string;
    displayName: string;
};

const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.SupplierStore)
@observer
class Supplier extends AppComponentBase<SupplierdataProps, SupplierdataState> {
    formRef = React.createRef<FormInstance>();

    state = {
        modalVisible: false,
        maxResultCount: 10,
        skipCount: 0,
        userId: 0,
        filter: '',
        SupplierLookupItem: null as SupplierUserLookupTableDto | null,
    };

    async componentDidMount() {
        await this.getAll();
    }
  
    async getAll() {
        if (!this.props.supplierStore) {
            console.error('supplierStore is undefined');
            return;
        }
        await this.props.supplierStore.getAll({
            maxResultCount: this.state.maxResultCount,
            skipCount: this.state.skipCount,
            keyword: this.state.filter
        });
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
            await this.props.supplierStore.createSupplierData();
        } else {
            await this.props.supplierStore.get(entityDto);
        }

        this.setState({ userId: entityDto.id });
        this.Modal();

        setTimeout(() => {
            this.formRef.current?.setFieldsValue({ ...this.props.supplierStore.editUser });
        }, 100);
    }

    delete(input: EntityDto) {
        const self = this;
        confirm({
            title: 'Do you Want to delete these items?',
            onOk() {
                self.props.supplierStore.delete(input);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    editdata: any = null;

    handleCreate = () => {
        const form = this.formRef.current;
        const { SupplierLookupItem } = this.state;
        if (SupplierLookupItem?.id) { 
            form?.setFieldsValue({ supplierId: SupplierLookupItem.id });
        }
        form!.validateFields().then(async (values: any) => {
            if (this.state.userId === 0) {
                await this.props.supplierStore.create(values);
            } else {
                await this.props.supplierStore.update({ ...values, id: this.state.userId });
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
        console.log(this.props.supplierStore);
        const { supplier } = this.props.supplierStore;
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
                                    <Menu.Item onClick={() => this.createOrUpdateModalOpen({ id: item.Suppliers?.id })}>{L('Edit')}</Menu.Item>
                                    <Menu.Item onClick={() => this.delete({ id: item.Suppliers?.id })}>{L('Delete')}</Menu.Item>
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
            // {
            //     title: L('Userid'),
            //     dataIndex: 'supplier.userid',
            //     key: 'userid',
            //     width: 150,
            //     render: (text: string, record: any) => <div>{record.supplier?.userid || ''}</div>,
            // },
            {
                title: L('Name'),
                dataIndex: 'supplier.name',
                key: 'name',
                width: 150,
                render: (text: string, record: any) => <div>{record.supplier?.name || ''}</div>,
            },
            {
                title: L('Code'),
                dataIndex: 'supplier.code',
                key: 'code',
                width: 150,
                render: (text: string, record: any) => <div>{record.supplier?.code || ''}</div>,
            },
            {
                title: L('UserName'),
                dataIndex: 'userName',
                key: 'userName',
                width: 150,
                render: (text: string, record: any) => <div>{record.userName || ''}</div>,
            },
            // {
            //     title: L('DisplayName'),
            //     dataIndex: 'supplier.displayName',
            //     key: 'displayName',
            //     width: 150,
            //     render: (text: string, record: any) => <div>{record.supplier?.displayName || ''}</div>,
            // },
            // {
            //     title: L('Id'),
            //     dataIndex: 'supplier.id',
            //     key: 'id',
            //     width: 150,
            //     render: (text: string, record: any) => <div>{record.supplier?.rid || ''}</div>,
            // },
          ];

        return (
            <Card>
                <Row>
                    <Col xs={{ span: 4, offset: 0 }} sm={{ span: 4, offset: 0 }} md={{ span: 4, offset: 0 }} lg={{ span: 2, offset: 0 }} xl={{ span: 2, offset: 0 }} xxl={{ span: 2, offset: 0 }}>
                        {' '}
                        <h2>{L('supplier')}</h2>
                    </Col>
                    <Col xs={{ span: 14, offset: 0 }} sm={{ span: 15, offset: 0 }} md={{ span: 15, offset: 0 }} lg={{ span: 1, offset: 21 }} xl={{ span: 1, offset: 21 }} xxl={{ span: 1, offset: 21 }}>
                        <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen({ id: 0 })} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 10, offset: 0 }}>
                        <Search placeholder={this.L('Filter')} onSearch={this.handleSearch} />
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 0 }} xl={{ span: 24, offset: 0 }} xxl={{ span: 24, offset: 0 }}>
                        <Table
                            rowKey={(record) => record.supplier?.id.toString()}
                            bordered={true}
                            columns={columns}
                            pagination={{ pageSize: 10, total: supplier === undefined ? 0 : supplier.totalCount, defaultCurrent: 1 }}
                            loading={supplier === undefined ? true : false}
                            dataSource={supplier === undefined ? [] : supplier.items}
                            onChange={this.handleTableChange}
                            scroll={{ x: 'max-content' }}
                        />
                    </Col>
                </Row>
                <Edit
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
                        userid: '',
                        displayname: '',
                        code: ''
                    }}
                    supplierStore={this.props.supplierStore}
                />
            </Card>
            );
        }
      }
      
export default Supplier;

import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';

import AppComponentBase from '../../components/AppComponentBase';
import CreateOrEditProcure from './components/createoreditprocuredatas';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import ProcureStore from '../../stores/procuredatastore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';




export interface IProcureProps {
  procureStore: ProcureStore;
}

export interface IProcureState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  procureId: number;
  filter: string;
}

const confirm = Modal.confirm;
const Search = Input.Search;

@inject(Stores.ProcureStore)
@observer
class Procure extends AppComponentBase<IProcureProps, IProcureState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    procureId: 0,
    filter: '',
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    await this.props.procureStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
  }

  handleTableChange = (pagination: any) => {
    this.setState({ skipCount: (pagination.current - 1) * this.state.maxResultCount! }, async () => await this.getAll());
  };

  Modal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  };

  globalData: any = null;

  async createOrEditeModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
        this.globalData = await this.props.procureStore.createProcure();
     // await this.props.userStore.getRoles();
    } else {
      this.globalData = await this.props.procureStore.get(entityDto);
      //await this.props.userStore.getRoles();
    }

    this.setState({ procureId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.procureStore.editProcure });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.procureStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.procureId === 0) {
        await this.props.procureStore.create(values);
      } else {
        await this.props.procureStore.update({ ...values, id: this.state.procureId });
      }

      await this.getAll();
      this.setState({ modalVisible: false });
      form!.resetFields();
    });
  };

  handleSearch = (value: string) => {
    this.setState({ filter: value }, async () => await this.getAll());
  };

  handleexcelexport = () =>{
    this.props.procureStore.getExcelExport();
  }

   globalProcureData: any = null;

  public render() {
    const { procure } = this.props.procureStore;
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
                      <Menu.Item onClick={() => this.createOrEditeModalOpen({ id: item.procureData?.id })}>{L('Edit')}</Menu.Item>
                      <Menu.Item onClick={() => this.delete({ id: item.procureData?.id })}>{L('Delete')}</Menu.Item>
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
      { title: L('PartPartNo'), dataIndex: 'partPartNo', key: 'partPartNo', width: 150, render: (text: string) => <div>{text}</div> },
      { title: L('Buyer'), dataIndex: 'buyerName', key: 'buyerName', width: 150, render: (text: string) => <div>{text}</div> },
      {title: L('ValidFrom'),dataIndex: 'procureData.validFrom', key: 'validFrom', width: 150, render: (text: string, record: any) => {        
        this.globalProcureData = record.procureData;
          return <div>{record.procureData?.validFrom}</div>;
        },
      },
      { title: L('ValidTo'), dataIndex: 'procureData.validTo', key: 'validTo', width: 150, render: (text: string , record:any) => <div>{record.procureData?.validTo}</div> },
      { title: L('ContractNo'), dataIndex: 'procureData.contractNo', key: 'contractNo', width: 150, render: (text: string,record:any) => <div>{record.procureData?.contractNo}</div> },
      { title: L('ContractDate'), dataIndex: 'procureData.contractDate', key: 'contractDate', width: 150, render: (text: string,record:any) => <div>{record.procureData?.contractDate}</div> },
      { title: L('ApprovalDate'), dataIndex: 'procureData.approvalDate', key: 'approvalDate', width: 150, render: (text: string,record:any) => <div>{record.procureData?.approvalDate}</div> },
      { title: L('PlantCode'), dataIndex: 'procureData.plantCode', key: 'plantCode', width: 150, render: (text: string,record:any) => <div>{record.procureData?.plantCode}</div> },
      { title: L('VersionNo'), dataIndex: 'procureData.versionNo', key: 'versionNo', width: 150, render: (text: string,record:any) => <div>{record.procureData?.versionNo}</div> },

      
     
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
            <h2>{L('ProcureDatas')}</h2>
          </Col>
          <Col
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
                <Menu.Item onClick={() => ({})}>{L('ImportExcel')}</Menu.Item>
                <Menu.Item onClick={() =>this.handleexcelexport()}>{L('ExportExcel')}</Menu.Item>
              </Menu>
            }
            placement="bottomLeft"
          >
            <Button type="primary" icon={<SettingOutlined />}>
              {L('Excel Operation')}
            </Button>
          </Dropdown>
        </div>

          </Col>
          <br />
          <br />
          <br />
          <Col
            xs={{ span: 14, offset: 0 }}
            sm={{ span: 15, offset: 0 }}
            md={{ span: 15, offset: 0 }}
            lg={{ span: 1, offset: 21 }}
            xl={{ span: 1, offset: 21 }}
            xxl={{ span: 1, offset: 30 }}
          > <Button type="primary"   icon={<PlusOutlined />} onClick={() => this.createOrEditeModalOpen({ id: 0 })} >Create ProcurDatas</Button>

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
             // rowKey={(record) => record.ProcureData.Id.toString()}
              bordered={true}
              columns={columns}
              pagination={{ pageSize: 10, total: procure === undefined ? 0 : procure.totalCount, defaultCurrent: 1 }}
              loading={procure === undefined ? true : false}
              dataSource={procure === undefined ? [] : procure.items}
              onChange={this.handleTableChange}
            />
          </Col>
        </Row>
        <CreateOrEditProcure
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.procureId === 0 ? 'edit' : 'create'}
          onCreate ={this.handleCreate}
          initialData = {{
            validFrom: this.globalProcureData?.validFrom,
            validTo: this.globalProcureData?.validFrom,
            contractNo:  this.globalProcureData?.contractNo,
            contractDate:  this.globalProcureData?.ContractDate,
            approvalDate:  this.globalProcureData?.approvalDate,
            plantCode:  this.globalProcureData?.plantCode,
            versionNo:  this.globalProcureData?.versionNo,

           

          }}
          //roles={this.props.procureStore.roles}
        />
      </Card>
    );
  }
}

export default Procure;

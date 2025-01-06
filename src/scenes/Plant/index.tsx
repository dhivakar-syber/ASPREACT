import * as React from 'react';
import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Table} from 'antd';
import { inject, observer } from 'mobx-react';
import AppComponentBase from '../../components/AppComponentBase';
import CreateorEditPlant from './components/CreateorEditPlant';
import { EntityDto } from '../../services/dto/entityDto';
import { L } from '../../lib/abpUtility';
import Stores from '../../stores/storeIdentifier';
import PlantStore from '../../stores/PlantStore';
import { FormInstance } from 'antd/lib/form';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';




export interface IPlantProps {
  plantsStore: PlantStore;
}

export interface IPlantState {
  modalVisible: boolean;
  maxResultCount: number;
  skipCount: number;
  plantId: number;
  filter: string;
  nameFilter:string;
  descriptionFilter:string;
  showAdvancedFilters: boolean;
}


const confirm = Modal.confirm;
const Search = Input.Search;
//onst [data, setData] = useState([]);

@inject(Stores.PlantsStore)
@observer
class Plant extends AppComponentBase<IPlantProps, IPlantState> {
  formRef = React.createRef<FormInstance>();

  state = {
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    plantId: 0,
    filter: '',
    nameFilter:'',
    descriptionFilter:'',
    showAdvancedFilters: false
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {

    const filters = {
      filter:this.state.filter,
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter, // global filter (if any)
      nameFilter: this.state.nameFilter, // name filter
      descriptionFilter: this.state.descriptionFilter,
    }
    await this.props.plantsStore.getAll(filters);
   // await this.props.plantsStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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
  globalData: any = null;

  async createOrEditeModalOpen(entityDto: EntityDto) {
    if (entityDto.id === 0) {
        this.globalData = await this.props.plantsStore.createPlant();
     // await this.props.userStore.getRoles();
    } else {
      this.globalData = await this.props.plantsStore.get(entityDto);
      //await this.props.userStore.getRoles();
    }

    this.setState({ plantId: entityDto.id });
    this.Modal();

    setTimeout(() => {
      this.formRef.current?.setFieldsValue({ ...this.props.plantsStore.editPlant });
    }, 100);
  }

  delete(input: EntityDto) {
    const self = this;
    confirm({
      title: 'Do you Want to delete these items?',
      onOk() {
        self.props.plantsStore.delete(input);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  resetFilters = () => {
    this.setState({
      nameFilter: '',
      descriptionFilter: '',

    },
  
    () => {
      this.getAll(); // Call the data-refresh function after resetting the filters
    }
  );
};
  handleCreate = () => {
    const form = this.formRef.current;

    form!.validateFields().then(async (values: any) => {
      if (this.state.plantId === 0) {
        await this.props.plantsStore.create(values);
      } else {
        await this.props.plantsStore.update({ ...values, id: this.state.plantId });
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
    this.setState({ nameFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.nameFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  
  handleDescriptionSearch = (value: string) => {
    this.setState({ descriptionFilter: value }, () => {
      console.log('Updated nameFilter:', this.state.descriptionFilter); // Verify the state update
      this.getAll(); // Correctly call getAll() after the state update
    });
  };
  // handleexcelexport = () =>{
  //   this.props.procureStore.getExcelExport();
  // }
  
  
//    handleFileUpload = (event:any) => {
//       const file = event.target.files[0];
//       if (file) {
//         this.props.plantStore.importExcel(file);
//       }
//     };
  
   
   globalProcureData: any = null;

  public render() {
    const { plant } = this.props.plantsStore;
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
                      <Menu.Item onClick={() => this.createOrEditeModalOpen({ id: item.plant?.id })}>{L('Edit')}</Menu.Item>
                      <Menu.Item onClick={() => this.delete({ id: item.plant?.id })}>{L('Delete')}</Menu.Item>
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
     
      { title: L('Name'), dataIndex: 'plant.name', key: 'validTo', width: 150, render: (text: string , record:any) =>
         <div>{record.plant?.name}</div> },
      { title: L('ContractNo'), dataIndex: 'plant.description', key: 'contractNo', width: 150, render: (text: string,record:any) =>
         <div>{record.plant?.description}</div> },

      
     
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
            <h2>{L('PlantDatas')}</h2>
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
            xxl={{ span: 1, offset: 30 }}
          > <Button type="primary"   icon={<PlusOutlined />} onClick={() => this.createOrEditeModalOpen({ id: 0 })} style={{marginLeft: '-100px'}}>Create Plants</Button>

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
            <Col md={{ span: 12 }}>
            <label className="form-label">{L("Name")}</label>
              <Input
                //placeholder={L('Name Filter')}
                value={this.state.nameFilter}
                onChange={(e) => this.handleNameSearch(e.target.value)}
                //style={{ width: "40%" }}
              />
            </Col>
            <Col md={{ span: 12 }}>
            <label className="form-label">{L("Description")}</label>
              <Input
                //placeholder={L('ShortId Filter')}
                value={this.state.descriptionFilter}
                onChange={(e) => this.handleDescriptionSearch(e.target.value)}
                //style={{ width: "40%" }}
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
              pagination={{ pageSize: 10, total: plant === undefined ? 0 : plant.totalCount, defaultCurrent: 1 }}
              loading={plant === undefined ? true : false}
              dataSource={plant === undefined ? [] : plant.items}
              onChange={this.handleTableChange}
              scroll={{x: 'max-content'} }
            />
          </Col>
        </Row>
        <CreateorEditPlant
          formRef={this.formRef}
          visible={this.state.modalVisible}
          onCancel={() => {
            this.setState({
              modalVisible: false,
            });
            this.formRef.current?.resetFields();
          }}
          modalType={this.state.plantId === 0 ? 'edit' : 'create'}
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

export default Plant;

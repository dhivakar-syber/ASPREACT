import * as React from 'react';

import { Button, Card, Col, Dropdown, Input, Menu, Modal, Row, Select, Table} from 'antd';
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
  docId: number | null;
  supplementaryInvoiceNoFilter: string;
  documentStatusFilter: number | null;
  isApprovedFilter: number | null;
  buyerApprovalStatusFilter: number | null;
  buyerApprovalFilter: number | null;
  isRejectedFilter: number | null;
  accountantApprovalStatusFilter: number | null;
  paymentApprovalStatusFilter: number | null;
  paymentApprovalFilter: number | null;
  contractNoFilter: string;
  plantCodeFilter: string;
  buyerEmailAddressFilter: string;
  buyerRemarksFilter: string;
  accountantNameFilter: string;
  accountantEmailAddressFilter: string;
  sccountRemarksFilter: string;
  payerNameFilter: string;
  payerEmailAddressFilter: string;
  paymentRemarksFilter: string;
  partPartNoFilter: string;
  buyerNameFilter: string;
  supplierNameFilter: string;
  buyerIds: number[];
  supplierIds: number[];
  partIds: number[];
  supplementaryId: number | null;
  partid: number | null;
  buyerid: number | null;
  supplierid: number | null;
  invoicetype: number | null;
  queryraisedactive: number | null;
  showAdvancedFilters: boolean;
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
    docId: null,
    supplementaryInvoiceNoFilter: '',
    documentStatusFilter: null as number | null,
    isApprovedFilter: null as number | null,
    buyerApprovalStatusFilter: null as number | null,
    buyerApprovalFilter: null as number | null,
    isRejectedFilter: null as number | null,
    accountantApprovalStatusFilter: null as number | null,
    paymentApprovalStatusFilter: null as number | null,
    paymentApprovalFilter: null as number | null,
    contractNoFilter: '',
    plantCodeFilter: '',
    buyerEmailAddressFilter: '',
    buyerRemarksFilter: '',
    accountantNameFilter: '',
    accountantEmailAddressFilter: '',
    sccountRemarksFilter: '',
    payerNameFilter: '',
    payerEmailAddressFilter: '',
    paymentRemarksFilter: '',
    partPartNoFilter: '',
    buyerNameFilter: '',
    supplierNameFilter: '',
    buyerIds: [],
    supplierIds: [],
    partIds: [],
    supplementaryId: null as number | null,
    partid: null as number | null,
    buyerid: null as number | null,
    supplierid: null as number | null,
    invoicetype: null as number | null,
    queryraisedactive: null as number | null,
    showAdvancedFilters: false,
  };

  async componentDidMount() {
    await this.getAll();
  }

  async getAll() {
    if (!this.props.supplementarySummariesStore) {
        console.error('supplementarySummariesStore is undefined');
        return;
    }
    const filters = {
      maxResultCount: this.state.maxResultCount,
      skipCount: this.state.skipCount,
      keyword: this.state.filter, // global filter (if any)
      filter: this.state.filter,
      //docId: this.state.docId,
      supplementaryInvoiceNoFilter: this.state.supplementaryInvoiceNoFilter,
      documentStatusFilter: this.state.documentStatusFilter,
      isApprovedFilter: this.state.isApprovedFilter,
      buyerApprovalStatusFilter: this.state.buyerApprovalStatusFilter,
      buyerApprovalFilter: this.state.buyerApprovalFilter,
      isRejectedFilter: this.state.isRejectedFilter,
      accountantApprovalStatusFilter: this.state.accountantApprovalStatusFilter,
      paymentApprovalStatusFilter: this.state.paymentApprovalStatusFilter,
      paymentApprovalFilter: this.state.paymentApprovalFilter,
      contractNoFilter: this.state.contractNoFilter,
      plantCodeFilter: this.state.plantCodeFilter,
      buyerEmailAddressFilter: this.state.buyerEmailAddressFilter,
      buyerRemarksFilter: this.state.buyerRemarksFilter,
      accountantNameFilter: this.state.accountantNameFilter,
      accountantEmailAddressFilter: this.state.accountantEmailAddressFilter,
      sccountRemarksFilter: this.state.sccountRemarksFilter,
      payerNameFilter: this.state.payerNameFilter,
      payerEmailAddressFilter: this.state.payerEmailAddressFilter,
      paymentRemarksFilter: this.state.paymentRemarksFilter,
      partPartNoFilter: this.state.partPartNoFilter,
      buyerNameFilter: this.state.buyerNameFilter,
      supplierNameFilter: this.state.supplierNameFilter,
      // buyerIds: this.state.buyerIds,
      // supplierIds: this.state.supplierIds,
      // partIds: this.state.partIds,
      // supplementaryId: this.state.supplementaryId,
      // partid: this.state.partid,
      // buyerid: this.state.buyerid,
      // supplierid: this.state.supplierid,
      // invoicetype: this.state.invoicetype,
      // queryraisedactive: this.state.queryraisedactive,
    }
    await this.props.supplementarySummariesStore.getAll(filters);
    //await this.props.supplementarySummariesStore.getAll({ maxResultCount: this.state.maxResultCount, skipCount: this.state.skipCount, keyword: this.state.filter });
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

  resetFilters = () => {
    this.setState({
      supplementaryInvoiceNoFilter: '',
    documentStatusFilter: -1,
    isApprovedFilter: -1,
    buyerApprovalStatusFilter: -1,
    buyerApprovalFilter: -1,
    isRejectedFilter: -1,
    accountantApprovalStatusFilter: -1,
    paymentApprovalStatusFilter: -1,
    paymentApprovalFilter: -1,
    contractNoFilter: '',
    plantCodeFilter: '',
    buyerEmailAddressFilter: '',
    buyerRemarksFilter: '',
    accountantNameFilter: '',
    accountantEmailAddressFilter: '',
    sccountRemarksFilter: '',
    payerNameFilter: '',
    payerEmailAddressFilter: '',
    paymentRemarksFilter: '',
    partPartNoFilter: '',
    buyerNameFilter: '',
    supplierNameFilter: '',
    invoicetype: null,
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

  handleDocIdSearch = (value: number) => {
    this.setState({docId : Number(value) }, () => {
    console.log("Updated MinValidFromFilter:", this.state.docId);
    this.getAll();
  });
};
handleSupplementaryInvSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ supplementaryInvoiceNoFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.supplementaryInvoiceNoFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleDocStatusSearch = (value: number) => {
  this.setState({documentStatusFilter : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.documentStatusFilter);
  this.getAll();
});
};
handleIsApprovedSearch = (value: number) => {
  this.setState({isApprovedFilter : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.isApprovedFilter);
  this.getAll();
});
};
handleBuyerApprovalStatusSearch = (value: number) => {
  this.setState({buyerApprovalStatusFilter : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.buyerApprovalStatusFilter);
  this.getAll();
});
};
handleBuyerApprovalSearch = (value: number) => {
  this.setState({buyerApprovalFilter : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.buyerApprovalFilter);
  this.getAll();
});
};
handleIsRejectedSearch = (value: number) => {
  this.setState({isRejectedFilter : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.isRejectedFilter);
  this.getAll();
});
};
handleAccountantApprovalStatusSearch = (value: number) => {
  this.setState({accountantApprovalStatusFilter : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.accountantApprovalStatusFilter);
  this.getAll();
});
};
handlePaymentApprovalStatusSearch = (value: number) => {
  this.setState({paymentApprovalStatusFilter : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.paymentApprovalStatusFilter);
  this.getAll();
});
};
handlePaymentAppSearch = (value: number) => {
  this.setState({paymentApprovalFilter : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.paymentApprovalFilter);
  this.getAll();
});
};
handleContractNoSearch = (value: string) => {
  this.setState({contractNoFilter : value }, () => {
  console.log("Updated MinValidFromFilter:", this.state.contractNoFilter);
  this.getAll();
});
};
handleBuyerEmailAddrSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ buyerEmailAddressFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.buyerEmailAddressFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleBuyerRemarksSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ buyerRemarksFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.buyerRemarksFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleAccountNameSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ accountantNameFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.accountantNameFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleAccountEmailAddrearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ accountantEmailAddressFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.accountantEmailAddressFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleAccountRemarksSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ sccountRemarksFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.sccountRemarksFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handlePayerNameSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ payerNameFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.payerNameFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handlePayerEmailAddrSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ payerEmailAddressFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.payerEmailAddressFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handlePaymentRemarksSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ paymentRemarksFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.paymentRemarksFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handlePartNoSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ partPartNoFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.partPartNoFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleBuyerNameSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ buyerNameFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.buyerNameFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleSupplierNameSearch = (value: string) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ supplierNameFilter: value }, () => {
    console.log('Updated nameFilter:', this.state.supplierNameFilter); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleBuyerIdsSearch = (value: number[]) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ buyerIds: value }, () => {
    console.log('Updated nameFilter:', this.state.buyerIds); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handleSupplierIdsSearch = (value: number[]) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ supplierIds: value }, () => {
    console.log('Updated nameFilter:', this.state.supplierIds); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handlePartIdsSearch = (value: number[]) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ partIds: value }, () => {
    console.log('Updated nameFilter:', this.state.partIds); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handlePSupplementaryIdSearch = (value: number) => {
  // Update the state and call getAll() once the state is updated
  this.setState({ supplementaryId: Number(value) }, () => {
    console.log('Updated nameFilter:', this.state.supplementaryId); // Verify the state update
    this.getAll(); // Correctly call getAll() after the state update
  });
};
handlePartIdSearch = (value: number) => {
  this.setState({partid : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.partid);
  this.getAll();
});
};
handleBuyerIdSearch = (value: number) => {
  this.setState({buyerid : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.buyerid);
  this.getAll();
});
};
handleSupplierIdSearch = (value: number) => {
  this.setState({supplierid : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.supplierid);
  this.getAll();
});
};
handleInvoiceTypeSearch = (value: number) => {
  this.setState({invoicetype : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.invoicetype);
  this.getAll();
});
};
handleQueryRaisedSearch = (value: number) => {
  this.setState({queryraisedactive : Number(value) }, () => {
  console.log("Updated MinValidFromFilter:", this.state.queryraisedactive);
  this.getAll();
});
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
             <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                 <Col md={5}>
                   <div className="my-3">
                     <label className="form-label">{L("Supplementary Invoice No")}</label>
                     <Input
                       //placeholder={L("Part No Filter")}
                       value = {this.state.supplementaryInvoiceNoFilter}
                       onChange={(e) => this.handleSupplementaryInvSearch(e.target.value)}
                     />
                   </div>
                 </Col>
                 <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Document Status")}</label>
                      <Select
                          //placeholder={L("Transaction Filter")}
                          value = {this.state.documentStatusFilter?.toString()}
                        onChange={(value) => this.handleDocStatusSearch(Number(value))}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="0">{L("Pending")}</Select.Option>
                        <Select.Option value="1">{L("Approved")}</Select.Option>
                        <Select.Option value="2">{L("Rejected")}</Select.Option>
                      </Select>
                    </Col>
                 <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Buyer Approval Status")}</label>
                      <Select
                          //placeholder={L("Transaction Filter")}
                          value = {this.state.buyerApprovalFilter?.toString()}
                        onChange={(value) => this.handleBuyerApprovalStatusSearch(Number(value))}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="0">{L("Pending")}</Select.Option>
                        <Select.Option value="1">{L("Approved")}</Select.Option>
                        <Select.Option value="2">{L("Rejected")}</Select.Option>
                      </Select>
                    </Col>
                 <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Account Approval Status")}</label>
                      <Select
                          //placeholder={L("Transaction Filter")}
                          value = {this.state.accountantApprovalStatusFilter?.toString()}
                        onChange={(value) => this.handleAccountantApprovalStatusSearch(Number(value))}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="0">{L("Pending")}</Select.Option>
                        <Select.Option value="1">{L("Approved")}</Select.Option>
                        <Select.Option value="2">{L("Rejected")}</Select.Option>
                      </Select>
                    </Col>
                    <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Buyer Approval")}</label>
                      <Select
                          //placeholder={L("Transaction Filter")}
                          value = {this.state.buyerApprovalFilter?.toString()}
                        onChange={(value) => this.handleBuyerApprovalSearch(Number(value))}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="1">{L("True")}</Select.Option>
                        <Select.Option value="0">{L("False")}</Select.Option>
                      </Select>
                    </Col>
                    <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Payment Approval")}</label>
                      <Select
                          //placeholder={L("Transaction Filter")}
                          value = {this.state.paymentApprovalFilter?.toString()}
                        onChange={(value) => this.handlePaymentAppSearch(Number(value))}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="1">{L("True")}</Select.Option>
                        <Select.Option value="0">{L("False")}</Select.Option>
                      </Select>
                    </Col>
                    <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Is Approved")}</label>
                      <Select
                          //placeholder={L("Transaction Filter")}
                          value = {this.state.isApprovedFilter?.toString()}
                        onChange={(value) => this.handleIsApprovedSearch(Number(value))}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="1">{L("True")}</Select.Option>
                        <Select.Option value="0">{L("False")}</Select.Option>
                      </Select>
                    </Col>
                    <Col md={{ span: 4 }}>
                      <label className="form-label">{L("Is Rejected")}</label>
                      <Select
                          //placeholder={L("Transaction Filter")}
                          value = {this.state.isRejectedFilter?.toString()}
                        onChange={(value) => this.handleIsRejectedSearch(Number(value))}
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="-1">{L("All")}</Select.Option>
                        <Select.Option value="1">{L("True")}</Select.Option>
                        <Select.Option value="0">{L("False")}</Select.Option>
                      </Select>
                    </Col>

                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Contract No")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.contractNoFilter}
                         onChange={(e) => this.handleContractNoSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Buyer Email Address")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.buyerEmailAddressFilter}
                         onChange={(e) => this.handleBuyerEmailAddrSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Buyer Remarks")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.buyerRemarksFilter}
                         onChange={(e) => this.handleBuyerRemarksSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Accountant Name")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.accountantNameFilter}
                         onChange={(e) => this.handleAccountNameSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Accountant Email Address")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.accountantEmailAddressFilter}
                         onChange={(e) => this.handleAccountEmailAddrearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Accountant Remarks")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.sccountRemarksFilter}
                         onChange={(e) => this.handleAccountRemarksSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Payer Name")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.payerNameFilter}
                         onChange={(e) => this.handlePayerNameSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Payer Email Address")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.payerEmailAddressFilter}
                         onChange={(e) => this.handlePayerEmailAddrSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Payer Remarks")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.paymentRemarksFilter}
                         onChange={(e) => this.handlePaymentRemarksSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Part No")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.partPartNoFilter}
                         onChange={(e) => this.handlePartNoSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Buyer Name")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.buyerNameFilter}
                         onChange={(e) => this.handleBuyerNameSearch(e.target.value)}
                         />
                      </Col>
                     <Col md={{ span: 4 }}>
                       <label className="form-label">{L("Supplier Name")}</label>
                       <Input
                        //placeholder={L('Buyer Name Filter')}
                        value = {this.state.supplierNameFilter}
                         onChange={(e) => this.handleSupplierNameSearch(e.target.value)}
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

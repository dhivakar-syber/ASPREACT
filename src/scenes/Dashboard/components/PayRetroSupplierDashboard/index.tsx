import React ,{ useRef,useState} from "react";

import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import annexureDetailsService from "../../../../services/annexureDetails/annexureDetailsService";
import { SupplierDashboardInput } from "./SupplierDashboardInput";
import  DashboardCards  from "../PayRetroSupplierDashboard/DashboardCards";
import { Row, Col,Select,message, Card,Modal,Button,DatePicker,Spin,Tag, Tabs, Table, Checkbox, Dropdown, Menu } from 'antd';
import SupplierSubmitModal from './SupplierSubmitModal';
import SupplementaryInvoiceModal from "./SupplementaryInvoicesModal";
import DisputesStore from "../../../../stores/DisputesStrore";
import { FormInstance } from 'antd/lib/form';
import CreateOrUpdateDisputes from '../../../../scenes/Disputes/components/createOrUpdateDashboardDisputes';
import DisputedataStore from "../../../../stores/DisputesStrore";
import DisputeHistoryModal from "../../../Dashboard/components/PayRetroSupplierDashboard/DisputeHistoryModal";
import disputesServices from "../../../../services/Disputes/disputesServices";
import sessionServices from "../../../../services/session/sessionService";
//import CreateOrUpdateDisputes from '../../../../scenes/Disputes/components/createOrUpdateDisputes'; // Import the modal component
import './index.css'; // or your CSS file

//import { IDisputesdataState } from "../../../Disputes";
import settingsIcon from "../../../../images/Setting.svg";
import SessionStore from "../../../../stores/sessionStore";
import { inject, observer } from "mobx-react"; // Import MobX utilities
import { ExclamationCircleFilled } from '@ant-design/icons';
import AnalysisPieChart from "../PieChartExample";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { MenuInfo } from "rc-menu/lib/interface";
import sessionService from "../../../../services/session/sessionService";



const getUserPermissions = async (): Promise<string[]> => {
  try {
    const currentLoginInfo = await sessionService.getCurrentLoginInformations();
    // console.log('User',currentLoginInfo);
    const permissions: string[] = currentLoginInfo?.user?.permissions || [];
    // console.log('permissions',permissions)
    return permissions;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];
  }
};

const hasPermission = async (permission: string): Promise<boolean> => {
  const userPermissions = await getUserPermissions();
  return userPermissions.includes(permission);
};



declare var abp: any;

const SettingsIcon = () => (
  <span role="img" aria-label="home" className="anticon">
  <img src={settingsIcon} alt="Settings" />
  </span>
);



const PayRetroSupplierDashboard: React.FC<{ sessionStore?: SessionStore }> = ({
  sessionStore,
}) => {
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [disputeData,setDisputeData] = useState<any[]>([]);
  // const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
  const [selectedRow, setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false); // To control modal visibility
  const [isSupplierSubmitModalOpen, setIsSupplierSubmitModalOpen] = React.useState<boolean>(false); // To control modal visibility
  const [modalData, setModalData] = React.useState<any[]>([]);
  const [annexuremodalData, annexuresetModalData] = React.useState<any[]>([]);
  const [suppliers, setSuppliers] =React.useState<any[]>([]);
  const [AnnexureVersionNo, setAnnexureVersionNo] =React.useState<number>(0);
  const [selectedsuppliers, setselectedsuppliers] = React.useState({ name: '', value:0 });
  const [buyers, setBuyers] =React.useState<any[]>([]);
  const [selectedbuyers, setselectedbuyers] =React.useState<any[]>([]);
  const [parts, setParts] =React.useState<any[]>([]);
  const [selectedparts, setselectedparts] =React.useState<any[]>([]);
  const [selectedcategory, setselectedcategory] =React.useState<any>(String);
  const [submitIdRow, setSubmitIdRow] = React.useState<number>(0);
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);  // Track modal visibility
  const [isQueryModalVisible, setIsQueryModalVisible] = React.useState<boolean>(false);  // Track modal visibility
  const [isHistoryModalVisible, setIsHistoryModalVisible] = React.useState<boolean>(false);  // Track modal visibility
  const [currentRowId, setCurrentRowId] = React.useState<string | null>(null); 
  const disputesStore = new DisputedataStore ();
  const [rowsupplierstatus, setrowsupplierstatus] = React.useState<number | null>(0); 
  const [rowBuyerstatus, setrowBuyerstatus] = React.useState<number | null>(0); 
  const [rowAccountsStatus, setrowAccountsStatus] = React.useState<number | null>(0);
const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
const [showDownloadButton, setShowDownloadButton] = React.useState<boolean>(false);
const [hasRole, setHasRole] = React.useState<boolean>(false);
const [progress, setProgress] = useState(0);
const [loading, setloading] = React.useState<boolean>(false);
const [tableloading, settableloading] = React.useState<boolean>(false);
const [supplierActionsPermission, setSupplierActionsPermission] = useState(false);

const checkPermissions = async () => {
  const hasPermissionSupplierActions = await hasPermission("Pages.Tenant.Dashboard.Actions");
  setSupplierActionsPermission(hasPermissionSupplierActions)
};
checkPermissions();

  // const [implementationDate, setImplementationDate] = React.useState(selectedRow?.implementationDate || '');
  const [dashboardinput, setdashboardinput] = React.useState<SupplierDashboardInput>({
    Supplierid: 0,
    Buyerids: [0],
    Partids: [0],
    invoicetype:0
  });
  const [initialData, setInitialData] = React.useState({
    buyerShortId: "",
    supplierName: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  React.useEffect(() => {

    

     
  
    const fetchData = async () => {

      
      try {

        const session = await sessionServices.getCurrentLoginInformations();
        console.log(session.user.roles);
        const rolesfromsession = session.user.roles;
        const requiredRoles = ["admin", "PayRetroAdmin", "Admin", "payretroadmin"];
        const hasRole = rolesfromsession.some(role => requiredRoles.includes(role));
        console.log('HasRole:',hasRole);
        setHasRole(hasRole)
      

        const suppliers = await supplementarySummariesService.GetAllSuppliers(abp.session.userId);
        console.log('suppliers',suppliers)
        
        setSuppliers(suppliers.data.result || []);
          setselectedsuppliers({name:suppliers.data.result[0].name,value:suppliers.data.result[0].id});
          getbuyers(suppliers.data.result[0].id)
          getparts(suppliers.data.result[0].id,[])
          setselectedcategory(0);

          var supplierDashboardInput: SupplierDashboardInput = {
            Supplierid: suppliers.data.result[0].id,
            Buyerids: [0],
            Partids: [0],
            invoicetype:0
          };

          setdashboardinput(supplierDashboardInput);

          await LoadsupplementarySummary(supplierDashboardInput);
        console.log('Suppliers',suppliers.data.result);
        
      } catch (error) {
        console.error("Error fetching supplementary summaries:", error);
      }
    };

    fetchData();
  }, []);
  React.useEffect(() => {
    setShowDownloadButton(selectedRows.length > 0);
  }, [selectedRows]);
  
  const handlesupplierChange = async  (value:any, option:any) => {

    settableloading(true)
    
    console.log('selectedSuppliers',option,value)
    setselectedsuppliers({name:option.label,value:value});
    

    await getbuyers(value);
    await getparts(value,[])
    await setselectedbuyers([]);
    await setselectedparts([]);

    var   supplierDashboardInput: SupplierDashboardInput = {
      Supplierid: value,
      Buyerids: [],
      Partids: [],
      invoicetype:selectedcategory
    };
    setdashboardinput(supplierDashboardInput);
    await LoadsupplementarySummary(supplierDashboardInput);
    settableloading(false);

  };

  const istoday = (d: string): boolean => {
    return formatDate(new Date()) === d; 
  };
  
  const handlebuyerChange =async  (selectedValues: any[]) => {

    settableloading(true)
    
    setselectedbuyers(selectedValues);
    console.log('selectedbuyers',selectedValues)

    getparts(selectedsuppliers.value,selectedValues);

    var   supplierDashboardInput: SupplierDashboardInput = {
      Supplierid: selectedsuppliers.value,
      Buyerids: selectedValues,
      Partids: [],
      invoicetype:selectedcategory
    };
    setdashboardinput(supplierDashboardInput);
    await LoadsupplementarySummary(supplierDashboardInput);

    settableloading(false)
  };


  const getbuyers =async  (buyersuppliers: number) => {
    
    

    const buyers = await supplementarySummariesService.GetAllBuyersList(buyersuppliers);
        setBuyers(buyers.data.result || []);
        setselectedbuyers([]);

  };

  

  const LoadsupplementarySummary=async (supplierDashboardInput:SupplierDashboardInput)=>
  {

  var  result = await supplementarySummariesService.loadsupplementarySummary(supplierDashboardInput);
    setTableData(result.data.result || []);
    console.log("Supplementary_top_table", result.data.result);

    const carddetails = await supplementarySummariesService.carddetails(supplierDashboardInput);

    setrowsupplierstatus(carddetails.data.result.supplierpending.toFixed(2));
    setrowBuyerstatus(carddetails.data.result.buyerpending.toFixed(2));
    setrowAccountsStatus(carddetails.data.result.accountspending.toFixed(2));

    



  }

  

  const getparts=async  (partsuppliers: number,partbuyers: any[]) => {

     const parts = await supplementarySummariesService.GetAllPartNumbersList(partsuppliers,partbuyers);
         setParts(parts.data.result || []);
         console.log('parts',parts.data.result) 
         setselectedparts([]);


  };


  const handlepartChange =async  (selectedValues: any[]) => {
    
    settableloading(true)
    setselectedparts(selectedValues);
    console.log('selectedparts',selectedValues)

    var   supplierDashboardInput: SupplierDashboardInput = {
      Supplierid: selectedsuppliers.value,
      Buyerids: selectedbuyers,
      Partids: selectedValues,
      invoicetype:selectedcategory
    };
    setdashboardinput(supplierDashboardInput);
    await LoadsupplementarySummary(supplierDashboardInput);
    settableloading(false)
  };

 

  const handlecategorychange = async(value: number) => {

    settableloading(true)
    console.log(`selected ${value}`);
    setselectedcategory(value);

    var   supplierDashboardInput: SupplierDashboardInput = {
      Supplierid: selectedsuppliers.value,
      Buyerids: selectedbuyers,
      Partids: selectedparts,
      invoicetype:value
    };
    setdashboardinput(supplierDashboardInput);
    await LoadsupplementarySummary(supplierDashboardInput);

    settableloading(false)
    
  };



  


  // const toggleDropdown = (id:any,event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   // Toggle the dropdown for the clicked row
  //   setOpenDropdownId(openDropdownId === id ? null : id);
  // };

  
  const handleDisputeHisotryAction = async (
    action: string,
    id: number,
    // event: React.MouseEvent
  ) => {
    // event.stopPropagation();
    console.log(`Action: ${action}, Row ID: ${id}`);
    setSubmitIdRow(id);


    // Fetch data from the store or API
    const fetchedData = await disputesStore.suppliergetAll({
      SupplementarySummaryId: id,
      Filter: state.filter || "", // Add required Filter
      QueryFilter: "", // Default or dynamic value
      BuyerRemarksFilter: "", // Default or dynamic value
      StatusFilter: 0, // Default or dynamic value
      SupplementarySummaryDisplayPropertyFilter:"",
      SupplierRejectionCodeFilter:"",
      SupplierCodeFilter:"",
      BuyerShortIdFilter:"",
      PagedDisputesResultRequestDto: {
        maxResultCount: state.maxResultCount,
        skipCount: state.skipCount,
        keyword: state.filter,
      },
      
    });
    console.log(fetchedData); 
    // Update the state with the fetched data
   setDisputeData(fetchedData.items);
    setIsHistoryModalVisible(true);
  };

  const handlehistoryCancel = () => {
    setIsHistoryModalVisible(false); // close the modal
  };
  const checkAnyQueryIsOpen = async (id: number, event: MenuInfo): Promise<{ isOpen: boolean, count: number }> => {
    event.domEvent.stopPropagation(); // Stop event propagation immediately
  
    try {
      // Fetch data from disputesStore
      const fetchedData = await disputesStore.suppliergetAll({
        SupplementarySummaryId: id,
        Filter: state.filter || "", // Add required filter
        QueryFilter: "", // Default or dynamic value
        BuyerRemarksFilter: "", // Default or dynamic value
        StatusFilter: 0, // Default or dynamic value
        SupplementarySummaryDisplayPropertyFilter: "",
        SupplierRejectionCodeFilter: "",
        SupplierCodeFilter: "",
        BuyerShortIdFilter: "",
        PagedDisputesResultRequestDto: {
          maxResultCount: state.maxResultCount,
          skipCount: state.skipCount,
          keyword: state.filter,
        },
      });
  
      console.log(fetchedData); // Log the fetched data
  
      if (fetchedData && fetchedData.items) {
        // Filter items that are not closed
        const openOrForwardedQueries = fetchedData.items.filter((item: any) => 
          item.dispute?.status !== 2  // 2 = closed, so we check for open (0), forwarded (1), and forwarded (3)
        );
  
        // If there's at least one query that is not closed
        const isOpen = !(openOrForwardedQueries.length > 0);
  
        // Return the status and count of open queries
        return {
          isOpen,
          count: openOrForwardedQueries.length, // Number of queries that aren't closed
        };
      }
  
      // If no items or no matches, return false and count as 0
      return {
        isOpen: false,
        count: 0,
      };
    } catch (error) {
      console.error("Error fetching disputes:", error); // Handle errors properly
      return {
        isOpen: false,  // Return false if there's an error
        count: 0,       // and 0 count in case of error
      };
    }
  };  

  const handleSupplierSubmitAction = (action: string, id: number, event: MenuInfo) => {
    //setdropdownclick(false);
    event.domEvent.stopPropagation();
    console.log(action, id);
    setSubmitIdRow(id);
    // Open the modal
    setIsSupplierSubmitModalOpen(true);
  };
  const closeSupplierSubmitModal = () => {
    setIsSupplierSubmitModalOpen(false);
  };

  const handleSupplierReSubmitAction = (action: string, id: number, event: MenuInfo) => {
    // setdropdownclick(false);
    Modal.confirm({
      title: 'Are you sure?',
      content: 'Do you want to Resubmit the Document?',
      onOk: async () => {
        event.domEvent.stopPropagation();
        console.log(action, id);
        setSubmitIdRow(id);
        // Open the modal
        setIsSupplierSubmitModalOpen(true);
      },
      onCancel() {
        // console.log('Date change cancelled');
      },
    });
  };
  

  
  const handleRaiseQueryAction = async (buttonName: string, rowId: string) => {
    // event.stopPropagation();
    setIsModalOpen(false);
    setCurrentRowId(rowId); // Set the rowId when the button is clicked
    //setdropdownclick(false);
    try {
      const result = await disputesServices.getBuyerAndSupplierNameAsync(rowId); 
  
      setInitialData({
        buyerShortId: result.buyerName || "", // Assign result values
        supplierName: result.supplierName || "", 
      });
  
      // Show the modal after setting initial data
      setIsQueryModalVisible(true);
    } catch (error) {
      console.error("Error fetching buyer and supplier data", error);
      // Handle the error accordingly
    }
  };
  
  const handleCancel = () => {
    setIsQueryModalVisible(false);        
  };

  type SummariesLookupItem = {
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

  

  const [state, setState] = useState({
    modalVisible: false,
    maxResultCount: 10,
    skipCount: 0,
    userId: 0,
    filter: '',
    selectedLookupItem: null as SummariesLookupItem | null,
   // relectedLookupItem: null as RejectionLookupItem | null,
    selectedSupplierLookupItem: null as SupplierLookupItem | null,
    selectedBuyerLookupItem: null as BuyerLookupItem | null,
  });

 

  const handleCreate = async (item: any) => {
    const form = formRef.current;
    const { selectedLookupItem, selectedBuyerLookupItem, selectedSupplierLookupItem } = state;
  
    if (selectedLookupItem?.id) form?.setFieldsValue({ summariesId: selectedLookupItem.id });
    if (selectedBuyerLookupItem?.id) form?.setFieldsValue({ buyerId: selectedBuyerLookupItem.id });
    if (selectedSupplierLookupItem?.id) form?.setFieldsValue({ supplierId: selectedSupplierLookupItem.id });
  
    setProgress(20);
    setloading(true) // Start progress
  
    form!.validateFields().then(async (values: any) => {
      if (values.supplementarySummaryId == null) {
        values.supplementarySummaryId = currentRowId;
      }
  
      setProgress(50); // Midway through validation
  
      console.log('values', values);
      console.log('item', item);
  
      await disputesStore.create(values).then(async function () {
        setProgress(100); // Task completed
       
        message.success(`Query Raised Intimation Sent to ${values.buyerName}`);
        setloading(false);
        var   supplierDashboardInput: SupplierDashboardInput = {
          Supplierid: selectedsuppliers.value,
          Buyerids: selectedbuyers,
          Partids: [],
          invoicetype:selectedcategory
        };
        setdashboardinput(supplierDashboardInput);
        await LoadsupplementarySummary(supplierDashboardInput);
      });
  
      setTimeout(() => setProgress(0), 500); // Reset progress bar after short delay
  
      setState(prevState => ({ ...prevState, modalVisible: false }));
      form!.resetFields();
    });
  
    setIsQueryModalVisible(false);
  };

  const formRef = useRef<FormInstance>(null); 


  const supplementaryInvoiceSubmit = async(item: any) => {
    setIsLoading(true);
    message.success(`${item.document} Approval Mail Sent to - ${item.buyerName}`);
      var   supplierDashboardInput: SupplierDashboardInput = {
        Supplierid: selectedsuppliers.value,
        Buyerids:selectedbuyers,
        Partids: selectedparts,
        invoicetype:selectedcategory
      };
      setdashboardinput(supplierDashboardInput);
       LoadsupplementarySummary(supplierDashboardInput).then(
        function(){

          setIsLoading(false);
        }
       );


  };
  const handleSupplementaryDropdownAction = (buttonName: string, rowId: string, AnnexureVersionNo:number) => {
    // event.stopPropagation();
    setIsModalOpen(false);
    //setdropdownclick(false);
    setAnnexureVersionNo(AnnexureVersionNo);
    setCurrentRowId(rowId); // Set the rowId when the button is clicked
    setIsModalVisible(true); // Show the modal
  };
  const handleCloseModal = async () => {
    setIsModalVisible(false);   
    
    var   supplierDashboardInput: SupplierDashboardInput = {
      Supplierid: selectedsuppliers.value,
      Buyerids: selectedbuyers,
      Partids: selectedparts,
      invoicetype:selectedcategory
    };
    setdashboardinput(supplierDashboardInput);
    await LoadsupplementarySummary(supplierDashboardInput);
  };
  function formatDate(d:Date) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 

    return `${day}-${month}-${year}`; 
}


  const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);

  const handleCheckboxChange = (e: CheckboxChangeEvent, rowId: number) => {
    e.stopPropagation(); // Stop event bubbling
    const isChecked = e.target.checked;  
  
    setSelectedRows((prevSelected) => {
      const updatedSelectedRows = isChecked
        ? prevSelected.concat(rowId) // Add rowId if checked
        : prevSelected.filter((id) => id !== rowId); // Remove rowId if unchecked
  
      // Update the visibility of the download button based on the updated selected rows
      setShowDownloadButton(updatedSelectedRows.length > 0);
  
      return updatedSelectedRows;
    });
  };

  const handleRowClick = async (e: React.MouseEvent<HTMLElement>,row: any) => {
    if ((e.target as HTMLElement).tagName !== 'INPUT') {
    setSelectedRow(row); // Set the clicked row data
    setIsModalOpen(true); // Open the modal
    
    try {
      const result = await supplementarySummariesService.grndata(row.id); // Await the Promise
      setModalData(result);
      console.log('setmodaldata',result) // Assuming the result contains the data in 'data' field
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const annexureresult = await supplementarySummariesService.annexuredata(row.id); // Await the Promise
      annexuresetModalData(annexureresult);
      console.log('annexuresetmodaldata',annexureresult) // Assuming the result contains the data in 'data' field
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
   } 
  };
  //const { Item } = Form;

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedRow(null);  // Clear the selected row data
  };
  
  //const disputestores = new DisputesStore;

  // const handleRaiseQueryAction = (actionName: string, entityId: number) => {
    
  //   disputestores.createDisputeData();
  // }

  const Suppliermodalview = (selectedRow: any) => {
    console.log(selectedRow)
    const handleInsideClick = (e: React.MouseEvent) => {
      // Prevent modal from closing when clicking inside the modal
      e.stopPropagation();
    };
    const handleDateChange = async (date: any, dateString: any) => {
      if (date) {
        console.log("Formatted Implementation Date:", formatDate(selectedRow.implementationDate));
        console.log("Changed Date:", formatDate(dateString));
        console.log("Contract To Date:", formatDate(selectedRow.contractToDate));
    
        if (formatDate(dateString) < formatDate(selectedRow.contractToDate)) {
          message.warn("Selected date cannot be earlier than the implementation date.");
          return;
        }
      Modal.confirm({
        title: 'Are you sure?',
        content: 'Do you want to change the Implementation Date?',
        onOk: async () => {
          console.log('Selected date:', dateString);
          console.log('Selected row ID:', selectedRow?.id);
    
          try {
            await supplementarySummariesService.Implementationeffect(selectedRow?.id, dateString);
            await LoadsupplementarySummary(dashboardinput);
    
            const result = await supplementarySummariesService.grndata(selectedRow?.id);
            setModalData([]);
            setModalData(result);
            console.log('setmodaldata', result);
    
            const annexureresult = await supplementarySummariesService.annexuredata(selectedRow?.id);
            annexuresetModalData([]);
            annexuresetModalData(annexureresult);
            console.log('annexuresetmodaldata', annexureresult);
    
            const row = await supplementarySummariesService.GetAllsupplementarySummarybyId(selectedRow?.id);
            console.log('ImplementationDateChange', row[0]);
            setSelectedRow([]);
            setSelectedRow(row[0]);
    
            message.success('Implementation Date changed Successfully Synced');
          } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Failed to update Implementation Date.');
          }
        },
        onCancel() {
          console.log('Date change cancelled');
        },
      });
    }
    };
    return (
      <Modal
        visible={isModalOpen}
        title="Contract Details"
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        centered
        width="80%"
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
        maskClosable={true}  // This ensures it will close when clicking outside
      >
        <div onClick={handleInsideClick}> {/* Prevent close on inside click */}
          <Row gutter={[14, 10]}>
            {/* Column 1 */}
            <Col span={6}>
              <div>
                <Row gutter={[14, 10]}>
                  <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
                    <p>Part Number</p>
                    <p>Description</p>
                    <p>Buyer Name</p>
                    <p>Supplier Code</p>
                    <p>Supplier Name</p>
                  </Col>
                  <Col span={12} style={{ fontSize: '12px' }}>
                    <p><span>: {selectedRow?.partno}</span></p>
                    <p><span>: {selectedRow?.partdescription}</span></p>
                    <p><span>: {selectedRow?.buyerName}</span></p>
                    <p><span>: {selectedRow?.suppliercode}</span></p>
                    <p><span>: {selectedRow?.suppliername}</span></p>
                  </Col>
                </Row>
              </div>
            </Col>
  
            {/* Column 2 */}
            <Col span={6}>
              <div>
                <Row gutter={[14, 10]}>
                  <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
                    <p>Valid From</p>
                    <p>Valid To</p>
                    <p>Contract No</p>
                    <p>Released Date</p>
                    <p>Plant</p>
                  </Col>
                  <Col span={12} style={{ fontSize: '12px' }}>
                    <p><span>: {formatDate(selectedRow?.contractFromDate)}</span></p>
                    <p><span>: {formatDate(selectedRow?.contractToDate)}</span></p>
                    <p><span>: {selectedRow?.contractNo}</span></p>
                    <p><span>: {formatDate(selectedRow?.approvalDate)}</span></p>
                    <p><span>: {selectedRow?.plantCode}</span></p>
                  </Col>
                </Row>
              </div>
            </Col>
  
            {/* Column 3 */}
            <Col span={6}>
              <div>
                <Row gutter={[14, 10]}>
                  <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
                    <p>Old Value</p>
                    <p>New Value</p>
                    <p>Delta</p>
                    <p>Qty</p>
                    <p>Total</p>
                  </Col>
                  <Col span={12} style={{ fontSize: '12px' }}>
                    <p><span>: {selectedRow?.oldValue}</span></p>
                    <p><span>: {selectedRow?.newValue}</span></p>
                    <p><span>: {selectedRow?.delta}</span></p>
                    <p><span>: {selectedRow?.grnQty}</span></p>
                    <p><span>: {selectedRow?.total}</span></p>
                  </Col>
                </Row>
              </div>
            </Col>
  
            {/* Column 4 */}
            <Col span={6}>
              <div>
                <Row gutter={[14, 10]}>
                  <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
                    <p>Accounted Price</p>
                    <p>Accounted Value</p>
                    <p>Version No</p>
                    <p>Implementation Date</p>
                    {selectedRow.documentStatus === 0 && <p>Change</p>}
                  </Col>
                  <Col span={12} style={{ fontSize: '12px' }}>
                    <p><span>: {selectedRow?.accoutedPrice}</span></p>
                    <p><span>: {selectedRow?.accountedValue}</span></p>
                    <p><span>: {selectedRow?.versionNo}</span></p>
                    <p><span>: {formatDate(selectedRow.implementationDate)}</span></p>
                    {selectedRow.documentStatus === 0 && (
  <DatePicker
    // value={selectedRow?.implementationDate ? dayjs(selectedRow.implementationDate) : null} // Using dayjs
    onChange={handleDateChange}
    format="YYYY-MM-DD"
    style={{ width: '100%' }}
  />
)}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
  
          <InvoiceTable data={modalData} />
          <AnnexureTable data={annexuremodalData} />
        </div>
      </Modal>
    );
  };
    

  

  const InvoiceTable = ({ data }: { data: any[] }) => {
    console.log('invoiceTable',data);
    return (
      <div >
        <h3>CBFC Information</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
              borderRadius: '5px' }}>
          <thead>
          <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" , borderRadius: '2px'}}>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>S.no</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>PartNo</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Invoice No</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>InvoiceDate</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "right"}}>Qty</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "right"}}>Price (GRN)</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "right"}}>Paid Amount (CBFC)</th>
            </tr>
          </thead>
          <tbody >
            {data && data.length > 0 ? (
              data.map((item:any, index:any) => (
                <tr key={index} style={{
                  backgroundColor:
                  index % 2 === 0 ? '#f9f9f9' : '#fff',
                }}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.partNo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.invoiceNo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.invoicedate)}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "right"}}>{item.quantity}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "right"}}>{item.invoiceRate}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "right"}}>{item.paidAmount}</td>
                </tr>
              ))
            ):''}
          </tbody>
        </table>
      </div>
    );
  };
  const handleAnnexureClick = (supplementarysummaryIds: number[]) => {
    const templatepath = '//assets/SampleFiles/AnnexureDetails.xlsx';
  
    // Wrap supplementarysummaryId in an array as the method expects an array
    //const supplementaryIds = [supplementarysummaryId];
  
    // Call the service method with the array of supplementaryIds
    const idsToPass = Array.isArray(supplementarysummaryIds) ? supplementarysummaryIds : [supplementarysummaryIds];

    annexureDetailsService.GetSupplementarysplitAnnexureDetailsToExcel(idsToPass, templatepath)
      .then((result) => {
        // Loop through each file in the result (assuming result is an array of file objects)
        result.forEach((fileData: any) => {
          const fileContent = fileData.fileContent;
          const fileName = fileData.fileName;
          const fileType = fileData.fileType;
  
          // Convert base64 string to a Blob
          const byteCharacters = atob(fileContent);  // Decode base64 string
          const byteArray = new Uint8Array(byteCharacters.length);
  
          // Convert byte characters into byte array
          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }
  
          // Create a Blob from the byte array and specify the MIME type
          const fileBlob = new Blob([byteArray], { type: fileType });
  
          // Create a temporary link element
          const link = document.createElement('a');
  
          // Create an object URL for the Blob
          const url = URL.createObjectURL(fileBlob);
  
          // Set the download attribute with the file name
          link.href = url;
          link.download = fileName;
  
          // Trigger a click event to start the download
          link.click();
  
          // Clean up the URL object after download
          URL.revokeObjectURL(url);
        });
      })
      .catch((error) => {
        console.error('Error fetching annexure details:', error);
      });
  };
  const AnnexureTable = ({ data }: { data: any[] }) => {
    console.log('AnnexureTable',data);
    return (
      <div >
        <br></br>
        <h3>Annexure Details</h3>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
  className="upload-btn"
  id="downloadannexure"
  onClick={() => handleAnnexureClick(data[0].supplementarysummaryId)}
>
  Download Annexure
</button>
</div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
              borderRadius: '5px' }}>
          <thead>
          <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left", borderRadius: '2px' }}>
          
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "left"}}>S.No</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Annexure Group</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Part No</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Invoice No</th>
            <th style={{width:"120px",padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>InvoiceDate</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "right"}}>Old Contract</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "right"}}>New Contract</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "right"}}>Diff Value</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "right"}}>Qty</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px', textAlign: "right"}}>Total</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Currency</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Supp.Inv.No/Credit Note</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Supp.Inv.Date/Credit Note Date</th>
          </tr>
            
          </thead>
          <tbody >
            {data && data.length > 0 ? (
              data.map((item:any, index:any) => (
                <tr key={index} 
                style={{
                  backgroundColor:
                  index % 2 === 0 ? '#f9f9f9' : '#fff',
                }}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "left"}}>{index + 1}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "center"}}>{item.versionNo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.partno}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.invoiceNo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.invoiceDate)}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "right"}}>{item.oldValue}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "right"}}>{item.newValue}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "right"}}>{item.diffValue}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "right"}}>{item.qty}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" , textAlign: "right"}}>{item.total}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.currency==0?'INR':item.currency==1?'USD':''}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplementaryInvoiceNo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplementaryInvoiceDate?formatDate(item.supplementaryInvoiceDate):''}</td>
                </tr>
              ))
            ):''}
          </tbody>
        </table>
      </div>
    );
  };

  function supplierstatus(status:any) {

    switch (status) {
        case 0:
            return 'progress-segment pending'; //yellow
        default:
            return 'progress-segment approved';//green
    }



}


function barstatus(status:any) {

    switch (status) {
        case 0:
            return 'progress-segment default'; //yellow
        case 1:
            return 'progress-segment pending';
        case 2:
            return 'progress-segment approved';
        case 3:
            return 'progress-segment rejected';
        default:
            return '';
    }



}

const Loading = () => (
  <div
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    zIndex: 1000, // Ensure it appears above everything
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Spin size="large" />
  
</div >

);


// const shouldShowNewTagColumn = tableData.some(row => istoday(formatDate(row.createtime)));

  return (
    <div>
{!loading && <div>
      
      <div
        style={{
          background: '#fafafa',
          padding: '!2px',
          marginTop: '16px',
          marginBottom: '10px',
          borderRadius: '2px',
        }}
      >
        <Row
          style={{ color: '#444444', paddingLeft: '10px', paddingTop: '10px', margin: '2px' }}
          gutter={11}
        >
          <p>Supplier Dashboard</p>
        </Row>
      </div>

      <DashboardCards SupplierDashboardInputs={dashboardinput} />

      <Card style={{ backgroundColor:"#fafafa", fontSize: "12px" }}>
        <Row gutter={11} style={{ marginRight: '-200.5px' }}>
        {hasRole?(
          <Col className="gutter-row" span={5}>
            <div style={{ textAlign: 'left' }}>
              <span style={{padding: "2px"}}>Suppliers</span>
              <Select
                style={{ width: '200px' }}
                placeholder="Select supplier"
                options={suppliers.map((supplier) => ({
                  label: supplier.name,
                  value: supplier.id,
                }))}
                value={selectedsuppliers.name}
                // value={}
                onChange={handlesupplierChange}
                // onChange={(value:any, option:any) => {

                optionLabelProp="label"
              />
              </div>
          </Col>
        ):''}
        <Col className="gutter-row" span={5}>
            <div style={{ textAlign: 'left' }}>
              <span style={{padding: "2px"}}>Buyers</span>
              <Select
                mode="multiple"
                style={{ width: '200px' }}
                placeholder="Select one or more Buyers"
                options={buyers.map((buyer) => ({
                  label: buyer.name,
                  value: buyer.value,
                }))}
                value={selectedbuyers}
                //value={[]}
                onChange={handlebuyerChange}
                showSearch
                optionLabelProp="label"
                filterOption={(input: any, buyers: any) =>
                  buyers?.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>
          </Col>
          <Col className="gutter-row" span={5}>
            <div style={{ textAlign: 'left' }}>
              <span style={{padding: "2px"}}>Category</span>
              <Select
                style={{ width: '200px' }}
                placeholder="Select one or more suppliers"
                options={[
                  {
                    label: 'Select All',
                    value: 0,
                  },
                  {
                    label: 'Supplementary Invoice',
                    value: 1,
                  },
                  {
                    label: 'Credit Note',
                    value: 2,
                  },
                ]}
                value={selectedcategory}
                onChange={handlecategorychange}
                optionLabelProp="label"
              />
            </div>
          </Col>
          
          <Col className="gutter-row" span={5}>
            <div style={{ textAlign: 'left' }}>
              <span style={{padding: "2px"}}>Parts</span>
              <Select
                mode="multiple"
                style={{ width: '200px' }}
                placeholder="Select one or more Parts"
                options={parts.map((part) => ({
                  label: part.name,
                  value: part.value,
                }))}
                value={selectedparts}
                //value={[]}
                onChange={handlepartChange}
                filterOption={(input: any, parts: any) =>
                  parts?.label.toLowerCase().includes(input.toLowerCase())
                }
                optionLabelProp="label"
              />
            </div>
          </Col>
         <Col className="gutter-row" span={5}>
            <div style={{ textAlign: 'left' }}>
            {showDownloadButton && (
                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={() => {
                      if (selectedRows.length > 0) {
                        handleAnnexureClick(selectedRows);
                        console.log('Download Annexure clicked for rows:', selectedRows);
                      } else {
                        alert('No rows selected for download!');
                      }
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#005f7f',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Download Annexure
                  </button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <br></br>
        {!tableloading&&<Tabs defaultActiveKey="1">
    
            <Tabs.TabPane tab="Home" key="1">
            {isLoading ? (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  ) : (
    <>
      <Table
        rowKey="id"
        columns={[
          {
            title: (
              <Checkbox
                onChange={(e) =>
                  setSelectedRows(e.target.checked ? tableData.map(row => row.id) : [])
                }
              />
            ),
            dataIndex: 'select',
            render: (_, row) => (
              <>
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  onChange={(e) => handleCheckboxChange(e, row.id)}
                  onClick={(e) => e.stopPropagation()} // Prevents row selection when clicking the checkbox
                />
                {/* Check if the row's creation date is today */}
                {istoday(formatDate(row.createtime)) && (
                  <Tag color="yellow">
                    <ExclamationCircleFilled style={{ marginLeft: 4 }} />
                    New
                  </Tag>
                )}
              </>
            ),
            width: 50, // Set the width here
          },
          

          {
            title: 'Action',
            dataIndex: 'action',
            className: supplierActionsPermission ? '' : 'hidden-column',
            render: (_, row) => (
              <Dropdown
  overlay={
    <Menu>
      {(row.documentStatus === 0 || row.documentStatus === 3 ) && (
        <>
          <Menu.Item onClick={(event) => { 
            event.domEvent.stopPropagation();
            handleSupplementaryDropdownAction('Supplementary Invoice Details', row.id, row.annexureVersionNo);
          }}>
            Supplementary Invoice Details/Credit Note
          </Menu.Item>
          {row.documentStatus === 0 &&
          <Menu.Item onClick={async (event) => {
            event.domEvent.stopPropagation();
            try {
              const { isOpen, count } = await checkAnyQueryIsOpen(row.id, event);
              if (isOpen && row.isdocumentuploaded) {
                handleSupplierSubmitAction('Submit', row.id, event);
              } else {
                if (!row.isdocumentuploaded) {
                  message.warning('Upload All Documents');
                }
                if (!isOpen) {
                  message.warn(`You have ${count} open queries. Please close the previous queries first.`);
                }
              }
            } catch (error) {
              console.error("Error checking query status:", error);
              message.error("An error occurred while checking query status");
            }
          }}>
            Send To Buyer
          </Menu.Item>
          }
          <Menu.Item onClick={(event) => { 
            event.domEvent.stopPropagation();
            handleRaiseQueryAction('Raise Query', row.id);
          }}>
            Raise Query
          </Menu.Item>
        </>
      )}
      <Menu.Item onClick={(event) => { 
        event.domEvent.stopPropagation();
        handleDisputeHisotryAction('History of Query', row.id);
      }}>
        History of Query
      </Menu.Item>
      {row.documentStatus === 3 && (
      <Menu.Item onClick={async (event) => { 
        event.domEvent.stopPropagation();
        try {
          const { isOpen, count } = await checkAnyQueryIsOpen(row.id, event);
          if (isOpen && row.isdocumentuploaded) {
            handleSupplierReSubmitAction('ReSubmit', row.id, event);
          } else {
            if (!row.isdocumentuploaded) {
              message.warning('Upload All Documents');
            }
            if (!isOpen) {
              message.warn(`You have ${count} open queries. Please close the previous queries first.`);
            }
          }
        } catch (error) {
          console.error("Error checking query status:", error);
          message.error("An error occurred while checking query status");
        }
      
      }}>
        Resubmit
      </Menu.Item>)}
    </Menu>
  }
  trigger={['click']}
  placement="bottomRight" // Ensures it appears at the bottom-right of the button
  getPopupContainer={(triggerNode) => (triggerNode.parentNode as HTMLElement) || document.body}
> 
  <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer' ,textAlign: 'center'}}>
    <SettingsIcon />
  </div>
</Dropdown>

            ),
            width: 100,
          },

          { title: 'Query', dataIndex: 'querycount', render: (count) => (count > 0 ? `${count} Query Raised` : '') ,width:100},
          { title: 'Buyer Name', dataIndex: 'buyerName' ,width:200},
          { title: 'Part No - Version', dataIndex: 'partno', render: (_, row) => `${row.partno}-${row.versionNo}` ,width:150},
          { title: 'Report Date', dataIndex: 'createtime', render: formatDate ,width:120},
          { title: 'Ageing', dataIndex: 'ageing', align: 'center' ,width:100},
          { title: 'Supplementary Invoice/Credit Note', dataIndex: 'supplementaryInvoiceNo',width:300 },
          { title: 'Date', dataIndex: 'supplementaryinvoicedatestring',width:120 },
          { title: 'From', dataIndex: 'contractFromDate', render: formatDate ,width:120},
          { title: 'To', dataIndex: 'contractToDate', render: formatDate ,width:120},
          { title: 'Value', dataIndex: 'total' ,width:100},
          {
            title:'Supplier' ,
            children:[
              {
                title: rowsupplierstatus,
                dataIndex: 'status',
                className: 'no-border-column', // Add custom class
                render: (_, row) => (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="progress-tube">
                      <div
                        className={supplierstatus(row.documentStatus)}
                        style={{ width: '50px', height: '10px' }}
                      ></div>
                    </div>
                  </div>
                ),
                width: 100,
              }
            ]
          },
          {
            title:'Buyer' ,
            children:[
              {
                title: rowBuyerstatus,
                dataIndex: 'status',
                className: 'no-border-column', // Add custom class
                render: (_, row) => (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="progress-tube">
                      <div
                        className={barstatus(row.buyerApprovalStatus)}
                        style={{ width: '50px', height: '10px' }}
                      ></div>
                    </div>
                  </div>
                ),
                width: 100,
              }
            ]
          },
          {
            title:'F&C' ,
            children:[
              {
                title: rowAccountsStatus,
                dataIndex: 'status',
                className: 'no-border-column', // Add custom class
                render: (_, row) => (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="progress-tube">
                      <div
                        className={barstatus(row.accountantApprovalStatus)}
                        style={{ width: '50px', height: '10px' }}
                      ></div>
                    </div>
                  </div>
                ),
                width: 100,
              }
            ]
          },
                    
]}
            dataSource={tableData}
            className="custom-table" // Add the custom class here
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: 'max-content'}} 
            
            // rowSelection={{
            //   selectedRowKeys: selectedRows, // Ensure selectedRows is an array of numbers
            //   onChange: (selectedRowKeys) => {
            //     setSelectedRows(selectedRowKeys as number[]); // Cast Key[] to number[]
            //   },
            // }}
            onRow={(row) => ({
              onClick: (e) => handleRowClick(e, row), // Trigger function on click anywhere on the row
              onMouseEnter: () => setHoveredRowId(row.id),
              onMouseLeave: () => setHoveredRowId(null),
              style: {
                backgroundColor:
                  row.documentStatus === 3
                    ? '#d8b1b1' // Set red background if documentStatus is 3
                    : hoveredRowId === row.id
                    ? '#f1f1f1'
                    : row.id % 2 === 0
                    ? '#f9f9f9'
                    : '#fff',
                cursor: 'pointer',
                color:  'black', // Optional: Adjust text color for readability
              },
            })}
            
            
  //           summary={() => (
  //   <thead>

  //     <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left' }}>
  //       <td colSpan={12}></td>
  //       <td style={{ border: '1px solid #ffffff1a' }} colSpan={4}>
  //         {/* Progress Tube for Statuses */}
  //         <div className="progress-tube">
  //           <div style={{ width: '50px', textAlign: 'center' }}>{rowsupplierstatus}</div>
  //           <div style={{ width: '50px', textAlign: 'center' }}>{rowBuyerstatus}</div>
  //           <div style={{ width: '50px', textAlign: 'center' }}>{rowAccountsStatus}</div>
  //         </div>
  //       </td>
  //     </tr>
  //   </thead>
  // )}
  // components={{
  //   header: {
  //     cell: (props) => {
  //       return (
  //         <th {...props} style={{ borderBottom: '2px solid #005f7f' }}>
  //           {props.children}
  //         </th>
  //       );
  //     },
  //   },
  // }}
            />
      {/* Modals */}
      <SupplierSubmitModal
        isOpen={isSupplierSubmitModalOpen}
        onClose={closeSupplierSubmitModal}
        submitIdRow={submitIdRow}
        supplementaryInvoiceSubmit={supplementaryInvoiceSubmit}
      />

      <SupplementaryInvoiceModal
        rowId={currentRowId}
        AnnexureVersion={AnnexureVersionNo}
        visible={isModalVisible}
        onCancel={handleCloseModal}
      />

      {isHistoryModalVisible && (
        <DisputeHistoryModal
          rowId={submitIdRow}
          visible={isHistoryModalVisible}
          onCancel={handlehistoryCancel}
          data={disputeData}
        />
      )}

      {isModalOpen && modalData && Suppliermodalview(selectedRow)}

      {isQueryModalVisible && (
        <CreateOrUpdateDisputes
          visible={isQueryModalVisible}
          modalType="view"
          onCreate={handleCreate}
          onCancel={handleCancel}
          disputesStrore={new DisputesStore()}
          initialData={{
            supplierName: initialData.supplierName,
            buyerName: initialData.buyerShortId,
          }}
          formRef={formRef}
        />
      )}
    </>
  )}
</Tabs.TabPane>
<Tabs.TabPane tab="Summary" key="2">
<AnalysisPieChart
            supplementaryDocStatus={tableData}
            />
</Tabs.TabPane>
          </Tabs>}
          {tableloading && Loading()}
      </Card>
      {progress > 0 && (
          <div style={{ 
            position: "fixed", 
            top: 50, 
            left: 20, 
            width: "80%", 
            zIndex: 9999, 
            background: "white", 
            padding: "5px 0" 
          }}>
      
        </div>
      )}
    </div>}
{loading&&Loading()}
    </div>
  );

  
};

export default inject("sessionStore")(observer(PayRetroSupplierDashboard));

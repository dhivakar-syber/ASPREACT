import React ,{useRef,useState} from "react";

import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import annexureDetailsService from "../../../../services/annexureDetails/annexureDetailsService";
import { SupplierDashboardInput } from "./SupplierDashboardInput";
import  DashboardCards  from "../PayRetroSupplierDashboard/DashboardCards";
import { Row, Col,Select,message, Card,Modal,Button,DatePicker } from 'antd';
import SupplierSubmitModal from './SupplierSubmitModal';
import SupplementaryInvoiceModal from "./SupplementaryInvoicesModal";
import DisputesStore from "../../../../stores/DisputesStrore";
import { FormInstance } from 'antd/lib/form';
import CreateOrUpdateDisputes from '../../../../scenes/Disputes/components/createOrUpdateDashboardDisputes';
import DisputedataStore from "../../../../stores/DisputesStrore";
import DisputeHistoryModal from "../../../Dashboard/components/PayRetroSupplierDashboard/DisputeHistoryModal";
import disputesServices from "../../../../services/Disputes/disputesServices";
//import CreateOrUpdateDisputes from '../../../../scenes/Disputes/components/createOrUpdateDisputes'; // Import the modal component

//import { IDisputesdataState } from "../../../Disputes";
import settingsIcon from "../../../../images/Setting.svg";


declare var abp: any;

const SettingsIcon = () => (
  <span role="img" aria-label="home" className="anticon">
  <img src={settingsIcon} alt="Settings" />
  </span>
);



    const PayRetroSupplierDashboard: React.SFC = () => {
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [disputeData,setDisputeData] = useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
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

  var userid='0';
  

  React.useEffect(() => {
    

    const fetchData = async () => {
      try {

        if(abp.session.userId==2||abp.session.userId==1)
        {

         userid='0';
        }
        else{

          userid=abp.session.userId;

        }
        
        

        const suppliers = await supplementarySummariesService.GetAllSuppliers(userid);
        console.log('suppliers',suppliers)
        setSuppliers(suppliers.data.result || []);
        if(abp.session.userId===1||abp.session.userId===2)
        {
          
          setselectedsuppliers({name:"Select All",value:0})
          setSuppliers(suppliers.data.result || []);
          setselectedcategory(['Select All']);
          await getbuyers(0)
          await getparts(0,[])
          setselectedcategory(0);
          await LoadsupplementarySummary(dashboardinput);
       
        }
        else{
          console.log('Selected_supplier',suppliers.data.result[0].name)

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
        }
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
  // const handleDateChange = async (rowid:any,implementationDate:any,row:any) => {
  //   const newDate= implementationDate
  //   setImplementationDate(newDate);
  //   console.log('New implementation date:', newDate);
  //   console.log('Row Id:', rowid);
  //    await supplementarySummariesService.Implementationeffect(rowid,newDate);

  //    row = await supplementarySummariesService.GetAllsupplementarySummarybyId(rowid);
  //   console.log('ImplementationDateChange',row[0]);
  //   setSelectedRow(row[0]);
  //   try {
  //     const result = await supplementarySummariesService.grndata(rowid);
  //     setModalData([]); // Await the Promise
  //     setModalData(result);
  //     console.log('setmodaldata',result) // Assuming the result contains the data in 'data' field
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  //   try {
  //     const annexureresult = await supplementarySummariesService.annexuredata(rowid); // Await the Promise
  //     annexuresetModalData([]);
  //     annexuresetModalData(annexureresult);
  //     console.log('annexuresetmodaldata',annexureresult) // Assuming the result contains the data in 'data' field
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } 
  //   message.success('Implementation Date changed Successfully Synced');
  // };
//   const handleBlur = () => {
//     // Handle the blur event when the user has finished interacting with the input
//     console.log('Input lost focus, final date:', implementationDate);
//     // Add any additional logic, like saving the date to a database, if needed
// };
// const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
//   setImplementationDate(event.target.value); // Update state when date changes
// };

// const handleButtonClick = () => {
//   handleDateChange(selectedRow.id, implementationDate,selectedRow);
// };
  const handlesupplierChange = async  (value:any, option:any) => {
    
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


  };


  const handlebuyerChange =async  (selectedValues: any[]) => {
    
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
  };

 

  const handlecategorychange = async(value: number) => {
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
    
  };



  // const handleClickOutside = (event: MouseEvent) => {
  //   const target = event.target as HTMLElement;
  //   if (!target.closest(".dropdown-container")) {
  //     setOpenDropdownId(null);
  //   }
  //   if (isModalOpen && !target.closest(".supplier-modal-container")) {
  //     handleModalClose(); // Close the modal if clicked outside
  //   }
  // };

  // React.useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, [isModalOpen]);


  const toggleDropdown = (id:any,event: React.MouseEvent) => {
    event.stopPropagation();
    // Toggle the dropdown for the clicked row
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  
  const handleDisputeHisotryAction = async (
    action: string,
    id: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
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


  
  const handleSupplierSubmitAction = (action: string, id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(action, id);
    setSubmitIdRow(id);
    // Open the modal
    setIsSupplierSubmitModalOpen(true);
  };
  const closeSupplierSubmitModal = () => {
    setIsSupplierSubmitModalOpen(false);
  };


  const handleRaiseQueryAction = async (buttonName: string, rowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentRowId(rowId); // Set the rowId when the button is clicked
  
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

 

  const handleCreate = (item:any) => {
    const form = formRef.current;
    const { selectedLookupItem, selectedBuyerLookupItem, selectedSupplierLookupItem, userId } = state;

    if (selectedLookupItem?.id) {
      form?.setFieldsValue({ summariesId: selectedLookupItem.id });
    }

    

    if (selectedBuyerLookupItem?.id) {
      form?.setFieldsValue({ buyerId: selectedBuyerLookupItem.id });
    }

    if (selectedSupplierLookupItem?.id) {
      form?.setFieldsValue({ buyerId: selectedSupplierLookupItem.id });
    }

    form!.validateFields().then(async (values: any) => {
      // Check and assign SupplementarySummaryId if it's null or undefined
      if (values.supplementarySummaryId == null) {
        values.supplementarySummaryId = currentRowId;
      }
      
      if (userId === 0) {
         await disputesStore.create(values).then(function(docid){
          disputesServices
          .buyermail(docid) 
          .then((item) => { 
            
              railqueryMail(item); 
            
      
            message.success("Submission successful.");
          })
          .catch((error: any) => {
            console.error("Error during submission:", error); // Handle errors
          });
        });  // Create new record
      } else {
        await disputesStore.update({ ...values, id: userId });  // Update existing record with userId
      }
    
      // Close the modal and reset the form
      setState(prevState => ({ ...prevState, modalVisible: false }));
      form!.resetFields();
    });

    
  
 
       
    setIsQueryModalVisible(false);
  };

  const formRef = useRef<FormInstance>(null); 
const railqueryMail = (item:any) =>
{
  console.log(item);  
  if (item.buyerMail) {
    item.buyerMail = item.buyerMail.split(",").map((email: string) => email.trim());   
  }

  var jsondata = JSON.stringify(item);
  console.log(jsondata);
  
  //var url = "";
  var url =`${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}PayRetro/disputebuyerapprovalmail`;

  abp.ui.setBusy();

  fetch(url, {
      method: 'POST',
      body: jsondata,
      headers: {
          'Content-Type': 'application/json'
      }
  }).then(function (response) {
      //return response.json();
      return console.log(response.body);
  }).then(function (data) {
      abp.ui.clearBusy();
      message.success(`Supplier Query Raised Intimation -  ${item.buyerShortId}`);
  }).catch(function (error) {
      abp.ui.clearBusy();
      abp.message.error(error.message || error);
  });
}


  const supplementaryInvoiceSubmit = async(item: any) => {
    console.log('Processing item:', item);
    if (item.buyerEmailAddress) {
      item.buyerEmailAddress = item.buyerEmailAddress.split(",").map((email: string) => email.trim());
    }
    if (item.supplierEmailAddress) {
      item.supplierEmailAddress = item.supplierEmailAddress.split(",").map((email: string) => email.trim());
    }
  
    if (item.accountantEmailAddress) {
      item.accountantEmailAddress = item.accountantEmailAddress.split(",").map((email: string) => email.trim());
    }
    const jsondata = JSON.stringify(item);
    console.log('item', jsondata);
    const url = `${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}RetroPay/Buyer_Approval_Workflow`;
    fetch(url, {
      method: 'POST',
      body: jsondata,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) =>  {
        abp.ui.clearBusy();
        message.success(`Approve Mail Sent to - ${item.buyerName}`);
        var   supplierDashboardInput: SupplierDashboardInput = {
          Supplierid: selectedsuppliers.value,
          Buyerids:selectedbuyers,
          Partids: selectedparts,
          invoicetype:selectedcategory
        };
        setdashboardinput(supplierDashboardInput);
         LoadsupplementarySummary(supplierDashboardInput);
      })
      .catch((error) => {
        abp.ui.clearBusy();
        abp.message.error(error.message || error);
      });

  };
  const handleSupplementaryDropdownAction = (buttonName: string, rowId: string, AnnexureVersionNo:number, event: React.MouseEvent) => {
    event.stopPropagation();
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
  function formatDate(d:string) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 

    return `${day}-${month}-${year}`; 
}
//   function formatDateToInput( d:string) {
//     const date = new Date(d); 
//     const year = date.getFullYear(); 
//     const month = String(date.getMonth() + 1).padStart(2, '0'); 
//     const day = String(date.getDate()).padStart(2, '0'); 

//     return `${year}-${month}-${day}`;  
// }

  const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, rowId: number) => {
    e.stopPropagation();
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

  const handleRowClick = async (e: React.MouseEvent<HTMLTableRowElement>,row: any) => {
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
    const handleInsideClick = (e: React.MouseEvent) => {
      // Prevent modal from closing when clicking inside the modal
      e.stopPropagation();
    };
    const handleDateChange = async (date:any, dateString:any) => {
      console.log('Selected date:', dateString);
      console.log('Selected row ID:', selectedRow?.id);
      await supplementarySummariesService.Implementationeffect(selectedRow?.id,dateString);
      await LoadsupplementarySummary(dashboardinput);
      try {
        const result = await supplementarySummariesService.grndata(selectedRow?.id);
        setModalData([]); // Await the Promise
        setModalData(result);
        console.log('setmodaldata',result) // Assuming the result contains the data in 'data' field
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const annexureresult = await supplementarySummariesService.annexuredata(selectedRow?.id); // Await the Promise
        annexuresetModalData([]);
        annexuresetModalData(annexureresult);
        console.log('annexuresetmodaldata',annexureresult) // Assuming the result contains the data in 'data' field
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
      try {
        const row = await supplementarySummariesService.GetAllsupplementarySummarybyId(selectedRow?.id);
        console.log('ImplementationDateChange',row[0]);
        setSelectedRow([]);
        setSelectedRow(row[0]);
         // Assuming the result contains the data in 'data' field
      } catch (error) {
        console.error('Error fetching data:', error);
      } 

      message.success('Implementation Date changed Successfully Synced');
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
                    <p>Change</p>
                  </Col>
                  <Col span={12} style={{ fontSize: '12px' }}>
                    <p><span>: {selectedRow?.accoutedPrice}</span></p>
                    <p><span>: {selectedRow?.accountedValue}</span></p>
                    <p><span>: {selectedRow?.versionNo}</span></p>
                    <p><span>: {formatDate(selectedRow.implementationDate)}</span></p>
                    <DatePicker
      //value={selectedRow?.implementationDate ? dayjs(selectedRow?.implementationDate) : null} // Using dayjs
      onChange={handleDateChange}
      format="YYYY-MM-DD"
      style={{ width: '100%' }}
    />
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
    

  // const loadgrndata = (supplementaryid: number) => {
  //   const result =  supplementarySummariesService.grndata(supplementaryid);
  //   InvoiceTable(result);
  //   console.log('grndata-',result)
  // };
  


  

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
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Qty</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Price (GRN)</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Price (CBFC)</th>
              <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Amount (CBFC)</th>
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
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.quantity}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
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
          
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>S.No</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Annexure Group</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Part No</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Invoice No</th>
            <th style={{width:"120px",padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>InvoiceDate</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Old Contract</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>New Contract</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Price(CBFC)</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Diff Value</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Qty</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Total</th>
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
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.versionNo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.partno}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.invoiceNo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.invoiceDate)}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.oldValue}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.newValue}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}></td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.diffValue}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.qty}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.total}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.currency}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplementaryInvoiceNo}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.supplementaryInvoiceDate)}</td>
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

  return (
    <div>
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
        </Row>

        <br></br>
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '20px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
             
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left', borderRadius: '2px' }}>
                <th style={{ padding: '10px', border: '1px solid #ffffff1a', borderRadius: '2px' }}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const isChecked = e.target.checked;

                      if (isChecked) {
                        setSelectedRows(tableData.map((row) => row.id)); // Select all rows
                      } else {
                        setSelectedRows([]); // Deselect all rows
                      }
                    }}
                  />
                </th>
                {[
                  'Buyer Name',
                  'Part No - Version',
                  'Report Date',
                  'Ageing',
                  'Action',
                  'Supplementary Invoice/Credit Note',
                  'Date',
                  'From',
                  'To',
                  'Value',
                  'Supplier',
                  'Buyer',
                  'F&C',
                ].map((header) => (
                  <th key={header} style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px' }}>
                    {header}
                  </th>
                ))}
              </tr>
              <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left' }}>
                <td colSpan={11}></td>

                <td style={{ border: '1px solid #ffffff1a' }} colSpan={4}>
                  <div className="progress-tube">
                    <div style={{ width: '50px', textAlign: 'center' }}>{rowsupplierstatus}</div>
                    <div style={{ width: '50px', textAlign: 'center' }}>{rowBuyerstatus}</div>
                    <div style={{ width: '50px', textAlign: 'center' }}>{rowAccountsStatus}</div>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  onClick={(e) => handleRowClick(e, row)} // Add click event here
                  onMouseEnter={() => setHoveredRowId(row.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  style={{
                    backgroundColor:
                      hoveredRowId === row.id ? '#f1f1f1' : row.id % 2 === 0 ? '#f9f9f9' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => handleCheckboxChange(e, row.id)}
                    />
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.buyerName}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {row.partno}-{row.versionNo}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {formatDate(row.createtime)}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {row.ageing}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                    <div
                      className="dropdown-container"
                      style={{ position: 'relative', whiteSpace: 'normal' }}
                    >
                      <div
                        style={{
                          padding: '5px 10px',
                          cursor: 'pointer',
                        }}
                        onClick={(event) => toggleDropdown(row.id, event)} // Ensure this function handles the dropdown toggle
                      >
                        <SettingsIcon />
                      </div>

                      {openDropdownId === row.id && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            zIndex: 999,
                            padding: '10px',
                            width: '325px',
                          }}
                        >
                          {row.documentStatus === 0 && (
                            <>
                              <button
                                style={{
                                  width: '100%',
                                  backgroundColor: '#fff',
                                  color: '#071437',
                                  border: 'none',
                                  padding: '10px',
                                  marginBottom: '5px',
                                  textAlign: 'left',
                                }}
                                onClick={(event) =>
                                  handleSupplementaryDropdownAction(
                                    'Supplementary Invoice/Credit Note Details',
                                    row.id,
                                    row.annexureVersionNo,
                                    event
                                  )
                                }
                              >
                                Supplementary Invoice/Credit Note Details
                              </button>

                              <button
                                style={{
                                  width: '100%',
                                  backgroundColor: '#fff',
                                  color: '#071437',
                                  border: 'none',
                                  padding: '10px',
                                  textAlign: 'left',
                                }}
                                onClick={(event) =>
                                  handleSupplierSubmitAction('Submit', row.id, event)
                                }
                              >
                                Submit
                              </button>

                              <button
                                style={{
                                  width: '100%',
                                  backgroundColor: '#fff',
                                  color: '#071437',
                                  border: 'none',
                                  padding: '10px',
                                  textAlign: 'left',
                                }}
                                onClick={(event) =>
                                  handleRaiseQueryAction('Raise Query', row.id, event)
                                }
                              >
                                Raise Query
                              </button>
                            </>
                          )}

                          {/* "History of Query" button is now always visible */}
                          <button
                            style={{
                              width: '100%',
                              backgroundColor: '#fff',
                              color: '#071437',
                              border: 'none',
                              padding: '10px',
                              textAlign: 'left',
                            }}
                            onClick={(event) =>
                              handleDisputeHisotryAction('History of Query', row.id, event)
                            }
                          >
                            History of Query
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {row.supplementaryInvoiceNo}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {row.supplementaryinvoicedatestring}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {formatDate(row.contractFromDate)}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {formatDate(row.contractToDate)}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.total}</td>

                  <td style={{ padding: '10px', border: '1px solid #ddd' }} colSpan={3}>
                    <div className="progress-tube">
                      <div
                        className={supplierstatus(row.documentStatus)}
                        style={{ width: '50px' }}
                      ></div>
                      <div
                        className={barstatus(row.buyerApprovalStatus)}
                        style={{ width: '50px' }}
                      ></div>
                      <div
                        className={barstatus(row.accountantApprovalStatus)}
                        style={{ width: '50px' }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SupplierSubmitModal
          isOpen={isSupplierSubmitModalOpen}
          onClose={closeSupplierSubmitModal}
          submitIdRow={submitIdRow}
          supplementaryInvoiceSubmit={supplementaryInvoiceSubmit}
        />
        <SupplementaryInvoiceModal
          rowId={currentRowId}
          AnnexureVersion={AnnexureVersionNo} // Pass rowId to the modal
          visible={isModalVisible} // Control visibility of the modal
          onCancel={handleCloseModal} // Function to close modal
        />

        {isHistoryModalVisible && (
          <DisputeHistoryModal
            rowId={submitIdRow}
            visible={isHistoryModalVisible}
            onCancel={handlehistoryCancel}
            data={disputeData}
            // Function to close modal
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
      </Card>
    </div>
  );

  
};

export default PayRetroSupplierDashboard;

import React ,{useRef,useState} from "react";

import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import { SupplierDashboardInput } from "../PayRetroSupplierDashboard/DashboardInput";
import  DashboardCards  from "../PayRetroSupplierDashboard/DashboardCards";
import { Row, Col, Input, Form,Select } from 'antd';
import SupplierSubmitModal from './SupplierSubmitModal';
import SupplementaryInvoiceModal from "./SupplementaryInvoicesModal";
import DisputesStore from "../../../../stores/DisputesStrore";
import { FormInstance } from 'antd/lib/form';
import CreateOrUpdateDisputes from '../../../../scenes/Disputes/components/createOrUpdateDisputes'; // Import the modal component
import DisputedataStore from "../../../../stores/DisputesStrore";
import DisputeHistoryModal from "../../../Dashboard/components/PayRetroSupplierDashboard/DisputeHistoryModal";
//import { IDisputesdataState } from "../../../Disputes";



declare var abp: any;




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
  const [dashboardinput, setdashboardinput] = React.useState<SupplierDashboardInput>({
    Supplierid: 0,
    Buyerids: [0],
    Partids: [0],
    invoicetype:0
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


  
  
  const handlesupplierChange = async  (value:any, option:any) => {
    
    console.log('selectedSuppliers',option,value)
    setselectedsuppliers({name:option.lable,value:value});
    

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



  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      setOpenDropdownId(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


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


  const handleRaiseQueryAction = (buttonName: string, rowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentRowId(rowId); // Set the rowId when the button is clicked
    setIsQueryModalVisible(true); // Show the modal    
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

 

  const handleCreate = () => {
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
      if (values.SupplementarySummaryId == null) {
        values.SupplementarySummaryId = currentRowId;
      }
      
      // Handle userId condition for create or update
      if (userId === 0) {
        await disputesStore.create(values);  // Create new record
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



  const supplementaryInvoiceSubmit = (item: any) => {
    console.log('Processing item:', item);
    // Your logic here
  };
  const handleSupplementaryDropdownAction = (buttonName: string, rowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentRowId(rowId); // Set the rowId when the button is clicked
    setIsModalVisible(true); // Show the modal
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);        
  };
  function formatDate(d:string) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 

    return `${day}-${month}-${year}`; 
}
  function formatDateToInput( d:string) {
    const date = new Date(d); 
    const year = date.getFullYear(); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 

    return `${year}-${month}-${day}`;  
}

  const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);

  const handleRowClick = async (row: any) => {
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
  };
  const { Item } = Form;

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedRow(null);  // Clear the selected row data
  };
  
  //const disputestores = new DisputesStore;

  // const handleRaiseQueryAction = (actionName: string, entityId: number) => {
    
  //   disputestores.createDisputeData();
  // }

  const Suppliermodalview = (selectedRow: any) => {
    
return (
        <div
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "55%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#ece4e4",
                      padding: "20px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      zIndex: 9999,
                      width: "80%",  // Adjusting modal width
                      maxHeight: "80vh",  // Limit modal height
                      overflowY: "auto",
                    }}
                  >
                    <button
                      onClick={handleModalClose}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "10px",
                        backgroundColor: "#005f7f",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    >
                      Close
                    </button>
                    <div className="ui-container">
                      <h3 className="card-title align-items-start flex-column">
                        <span className="fw-bolder text-dark" style={{ fontSize: '13px', textAlign: 'left' }}>
                          Contract Details
                        </span>
                      </h3>
                      <Form layout="vertical">
                        <Row gutter={[14, 10]}>
                          {/* Column 1 */}
                          <Col span={6}>
                            <Item label="Part No:">
                              <Input readOnly value={selectedRow.partno} />
                            </Item>
                            <Item label="Description:">
                              <Input readOnly value={selectedRow.partdescription} />
                            </Item>
                            <Item label="Buyer:">
                              <Input readOnly value={selectedRow.buyerName} />
                            </Item>
                            <Item label="Supplier Code:">
                              <Input readOnly value={selectedRow.suppliercode} />
                            </Item>
                            <Item label="Supplier Name:">
                              <Input readOnly value={selectedRow.suppliername} />
                            </Item>
                            </Col>

                        {/* Column 2 */}
                        <Col span={6}>
                        <Item label="Valid From:">
                          <Input readOnly value={formatDate(selectedRow.contractFromDate)} />
                        </Item>
                        <Item label="Valid To:">
                          <Input readOnly value={formatDate(selectedRow.contractToDate)} />
                        </Item>
                        <Item label="Implemented On:">
                        
                        <Input type="Date" value={formatDateToInput(selectedRow.implementationDate)}/>
          
          

                        </Item>
                        <Item label="Contract No:">
                          <Input readOnly value={selectedRow.contractNo} />
                        </Item>
                        <Item label="Released Date:">
                          <Input readOnly value={selectedRow.approvalDate} />
                        </Item>
                      </Col>

                      {/* Column 3 */}
                      <Col span={6}>
                        <Item label="Old Value:">
                          <Input readOnly value={selectedRow.oldValue} />
                        </Item>
                        <Item label="New Value:">
                          <Input readOnly value={selectedRow.newValue} />
                        </Item>
                        <Item label="Delta:">
                          <Input readOnly value={selectedRow.delta} />
                        </Item>
                        <Item label="Qty:">
                          <Input readOnly value={selectedRow.grnQty} />
                        </Item>
                        <Item label="Total:">
                          <Input readOnly value={selectedRow.total} />
                        </Item>
                      </Col>

                      {/* Column 4 */}
                      <Col span={6}>
                        <Item label="Accounted Price:">
                          <Input readOnly value={selectedRow.accoutedPrice} />
                        </Item>
                        <Item label="Accounted Value:">
                          <Input readOnly value={selectedRow.accountedValue} />
                        </Item>
                        <Item label="Version No:">
                          <Input readOnly value={selectedRow.versionNo} />
                        </Item>
                        <Item label="Plant:">
                          <Input readOnly value={selectedRow.plantCode} />
                        </Item>
                      </Col>
                    </Row>
                  </Form>
                  <InvoiceTable data={modalData} />
                  <AnnexureTable data={annexuremodalData} />
                 
                </div>
                
          </div>
      
      
    )
      
    

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
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
          <thead>
          <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>
              <th>S.no</th>
              <th>PartNo</th>
              <th>Invoice No</th>
              <th>InvoiceDate</th>
              <th>Qty</th>
              <th>Price (GRN)</th>
              <th>Paid Price (CBFC)</th>
              <th>Paid Amount (CBFC)</th>
            </tr>
          </thead>
          <tbody >
            {data && data.length > 0 ? (
              data.map((item:any, index:any) => (
                <tr key={index}>
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
 
  const AnnexureTable = ({ data }: { data: any[] }) => {
    console.log('AnnexureTable',data);
    return (
      <div >
        <h3>AnnexureDetails</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
          <thead>
          <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>
          
            <th>S.No</th>
            <th>Annexure Group</th>
            <th>Part No</th>
            <th>Invoice No</th>
            <th style={{width:"120px"}}>InvoiceDate</th>
            <th>Old Contract</th>
            <th>New Contract</th>
            <th>Paid Price(CBFC)</th>
            <th>Diff Value</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Currency</th>
            <th>Supp.Inv.No/Credit Note</th>
            <th>Supp.Inv.Date/Credit Note Date</th>
          </tr>
            
          </thead>
          <tbody >
            {data && data.length > 0 ? (
              data.map((item:any, index:any) => (
                <tr key={index}>
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

        
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <p>Current User id:{abp.session.userId}</p>
      
      <DashboardCards SupplierDashboardInputs={dashboardinput} />
      <br></br>
      
    <Row gutter={11}>
    
      <Col className="gutter-row" span={4}>
      <div style={{ textAlign: 'left' }}>
      <h3>Suppliers</h3>
      <Select
      
      style={{ width: '200px' }}
      placeholder="Select supplier"
      options={
        suppliers.map((supplier) => ({
          label: supplier.name,
          value: supplier.value,
        }))
      }
      value={selectedsuppliers.name} 
      // value={} 
      onChange={handlesupplierChange} 
     // onChange={(value:any, option:any) => {
        
      optionLabelProp="label"
    />
    </div>
      </Col>
      <Col className="gutter-row" span={4}>
      <div style={{ textAlign: 'left' }}>
      <h3>Category</h3>
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

        }
      ]}
      value={selectedcategory}
        onChange={handlecategorychange}
        optionLabelProp="label"
      />
    </div>
      </Col>
      <Col className="gutter-row" span={4}>
      <div style={{ textAlign: 'left' }}>
      <h3>Buyers</h3>
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
      filterOption={(input:any, buyers:any) =>
        buyers?.label.toLowerCase().includes(input.toLowerCase())
      } 
    />
    </div>
      </Col>
      <Col className="gutter-row" span={4}>
      <div style={{ textAlign: 'left' }}>
      <h3>Parts</h3>
      <Select
        mode="multiple"
        style={{ width: '200px' }}
        placeholder="Select one or more suppliers"
        options={parts.map((part) => ({
          label: part.name,
          value: part.value,
        }))}
         value={selectedparts}
        //value={[]} 
        onChange={handlepartChange}
        filterOption={(input:any, parts:any) =>
          parts?.label.toLowerCase().includes(input.toLowerCase())}
        optionLabelProp="label"
      />
    </div>
      </Col>
      
    </Row>
    
      <br></br>
      <div style={{ marginTop: "20px" }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>
              {[
                "Buyer Name",
                "Part No - Version",
                "Report Date",
                "Ageing",
                "Action",
                "Supplementary Invoice/Credit Note",
                "Date",
                "From",
                "To",
                "Value",
                "Supplier",
                "Buyer",
                "F&C",
              ].map((header) => (
                <th key={header} style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>

            <td  colSpan={10}>
  
</td>
              
            <td style={{  border: "1px solid #ddd" }} colSpan={3}>
  <div className="progress-tube">
    <div  style={{  width: "50px",textAlign:"center" }}>{rowsupplierstatus}</div>
    <div  style={{ width: "50px",textAlign:"center" }}>{rowBuyerstatus}</div>
    <div  style={{ width: "50px",textAlign:"center" }}>{rowAccountsStatus}</div>
  </div>
</td>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)} // Add click event here
                onMouseEnter={() => setHoveredRowId(row.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                style={{
                  backgroundColor: hoveredRowId === row.id ? "#f1f1f1" : row.id % 2 === 0 ? "#f9f9f9" : "#ffff",
                  cursor: "pointer",
                }}
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.buyerName}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.partno}-{row.versionNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(row.createtime)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.ageing}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                <div className="dropdown-container" style={{ position: "relative" }}>
                <button
                  style={{
                    backgroundColor: "#005f7f",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  onClick={(event) => toggleDropdown(row.id, event)} // Ensure this function handles the dropdown toggle
                >
                  ⚙️
                </button>
                    {openDropdownId === row.id && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          zIndex: 999,
                          padding: "10px",
                          width: "325px",
                        }}
                      >
                        <button
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            color: "#071437",
                            border: "none",
                            padding: "10px",
                            marginBottom: "5px",
                            textAlign:"left"
                          }}
                          onClick={(event) => handleSupplementaryDropdownAction("Supplementary Invoice/Credit Note Details", row.id,event)}
                        >
                          Supplementary Invoice/Credit Note Details
                        </button>
                        <button
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            color: "#071437",
                            border: "none",
                            padding: "10px",
                            textAlign:"left"
                          }}
                          onClick={(event) => handleSupplierSubmitAction("Submit", row.id,event)}
                        >
                          Submit
                        </button>
                        <button
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            color: "#071437",
                            border: "none",
                            padding: "10px",
                            textAlign:"left"
                          }}
                          onClick={(event) => handleRaiseQueryAction("Raise Query", row.id,event)}
                        >
                          Raise Query
                        </button>
                        <button
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            color: "#071437",
                            border: "none",
                            padding: "10px",
                            textAlign:"left"
                          }}
                          onClick={(event) => handleDisputeHisotryAction("History of Query", row.id,event)}
                        >
                          History of Query
                        </button>
                      </div>
                    )}
              </div>

                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.supplementaryInvoiceNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.supplementaryinvoicedatestring}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(row.contractFromDate)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(row.contractToDate)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.total}</td>
                
                <td style={{ padding: "10px", border: "1px solid #ddd" }} colSpan={3}>
  <div className="progress-tube">
    <div className={supplierstatus(row.documentStatus)} style={{ width: "50px" }}></div>
    <div className={barstatus(row.buyerApprovalStatus)} style={{ width: "50px" }}></div>
    <div className={barstatus(row.accountantApprovalStatus)} style={{ width: "50px" }}></div>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SupplierSubmitModal isOpen={isSupplierSubmitModalOpen} onClose={closeSupplierSubmitModal} submitIdRow={submitIdRow}
        supplementaryInvoiceSubmit={supplementaryInvoiceSubmit} />
        <SupplementaryInvoiceModal
        rowId={currentRowId}      // Pass rowId to the modal
        visible={isModalVisible}   // Control visibility of the modal
        onCancel={handleCloseModal} // Function to close modal
      />
        {isQueryModalVisible && (
        <CreateOrUpdateDisputes
          visible={isQueryModalVisible}
          modalType="view"
          onCreate={handleCreate}
          onCancel={handleCancel}
          disputesStrore={new DisputesStore()}
          initialData={{
            deliveryNote: "",
            deliveryNoteDate: "",
            transaction: 0,
            paidAmount: 0,
            year: 0,
          }} 
          formRef={formRef} 
        />
      )}
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
    </div>
  );


};

export default PayRetroSupplierDashboard;

import * as React from "react";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";

import  DashboardCards  from "./BuyerDashboardCards";
import { Row, Col,Select, Tabs } from 'antd';
import SupplierSubmitModal from '../../../Dashboard/components/PayRetroSupplierDashboard/SupplierSubmitModal';
import { BuyerDashboardInput } from "./BuyerDashboardInput";
import BuyerQueryModal from "./BuyerQueryModal"
import DisputedataStore from "../../../../stores/DisputesStrore";
//import { keys } from "mobx";

declare var abp: any;

  const PayRetroBuyerDashboard: React.SFC = () => {
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
  const [isSupplierSubmitModalOpen, setIsSupplierSubmitModalOpen] = React.useState<boolean>(false); // To control modal visibility
  
  const [suppliers, setSuppliers] =React.useState<any[]>([]);
  const [selectedsuppliers, setselectedsuppliers] =React.useState<any[]>([]);   
  const [buyers, setBuyers] =React.useState<any[]>([]);
  const [selectedbuyers, setselectedbuyers] = React.useState({ name: '', value:0 });
  const [parts, setParts] =React.useState<any[]>([]);
  const [selectedparts, setselectedparts] =React.useState<any[]>([]);
  const [selectedcategory, setselectedcategory] =React.useState<any>(String);
  const [submitIdRow, setSubmitIdRow] = React.useState<number>(0);
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);  
 // const [isQueryModalVisible, setIsQueryModalVisible] = React.useState<boolean>(false);  
  const [currentRowId, setCurrentRowId] = React.useState<string | null>(null); 
  const [rowsupplierstatus, setrowsupplierstatus] = React.useState<number | null>(0); 
  const [rowBuyerstatus, setrowBuyerstatus] = React.useState<number | null>(0); 
  const [rowAccountsStatus, setrowAccountsStatus] = React.useState<number | null>(0); 
  const [selectedDate, setSelectedDate] = React.useState("");
  const [dashboardinput, setdashboardinput] = React.useState<BuyerDashboardInput>({
    Supplierids:[0],
    Buyerid:0,
    Partids:[0],
    Document:null,
    invoicetype:0,
    Date:null,
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
        
        

        const buyers = await supplementarySummariesService.GetLoginBuyer(userid);
        setBuyers(buyers.data.result || []);
        if(abp.session.userId===1||abp.session.userId===2)
        {
          
          setselectedbuyers({name:"Select All",value:0})
          setBuyers(buyers.data.result || []);
          setselectedcategory(['Select All']);
          await getsuppliers(0)
          await getparts([],0)
          setselectedcategory(0);
          await LoadsupplementarySummary(dashboardinput);
       
        }
        else{

          setBuyers(buyers.data.result || []);
          setselectedbuyers(buyers.data.result);
          getsuppliers(buyers.data.result)
          getparts([],buyers.data.result)
        }
        console.log('buyers',buyers.data.result);
        
      } catch (error) {
        console.error("Error fetching supplementary summaries:", error);
      }
    };

    fetchData();
  }, []);


  const handledatechange = async (value:any)=>{
   console.log('Selected Date',value)
    setSelectedDate(value)

    const dateObject =value && value.trim() !== "" ? new Date(value) : null;

    var   buyerdashboard: BuyerDashboardInput = {
      Supplierids:selectedsuppliers,
      Buyerid:selectedbuyers.value,
      Partids: selectedparts,
      invoicetype:selectedcategory,
      Date:dateObject,
      Document:null
    };

    setdashboardinput(buyerdashboard);
      await LoadsupplementarySummary(buyerdashboard);

  };


  const handlebuyerchange = async  (value:any, option:any) => {
      
      console.log('selectedbuyers',option,value)
      setselectedbuyers({name:option.lable,value:value});
      
  
      await getsuppliers(value);
      await getparts([],value)
      await setselectedsuppliers([]);
      await setselectedparts([]);
  
      var   buyerdashboard: BuyerDashboardInput = {
        Supplierids: [],
        Buyerid:value,
        Partids: [],
        invoicetype:selectedcategory,
        Date:null,
        Document:null
        
        

      };
      setdashboardinput(buyerdashboard);
      await LoadsupplementarySummary(buyerdashboard);
  
  
    };
  
  
    const handlesupplierchange =async  (selectedValues: any[]) => {
      
      setselectedsuppliers(selectedValues);
      console.log('selectedsuppliers',selectedValues)
  
      getparts(selectedValues,selectedbuyers.value);
  
      var   buyerdashboardinput: BuyerDashboardInput = {
        Supplierids: selectedValues,
        Buyerid: selectedbuyers.value,
        Partids: [],
        invoicetype:selectedcategory,
        Document:null,
        Date:null
      };
      setdashboardinput(buyerdashboardinput);
      await LoadsupplementarySummary(buyerdashboardinput);
    };
  
  
    const getsuppliers =async  (supplybuyers: number) => {
      
      
  
      const suppliers = await supplementarySummariesService.GetAllSupplierListBuyerDashboard(supplybuyers);
          setSuppliers(suppliers.data.result || []);
          setselectedsuppliers([]);
          
  
        
          
  
    };
  
    const LoadsupplementarySummary=async (buyerdashboardinput:BuyerDashboardInput)=>
    {
  
    var  result = await supplementarySummariesService.BuyerdashboardloadsupplementarySummary(buyerdashboardinput);
      setTableData(result.data.result || []);
      console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
  
      const carddetails = await supplementarySummariesService.Buyerdashboardcarddetails(buyerdashboardinput);
  
      setrowsupplierstatus(carddetails.data.result.supplierpending.toFixed(2));
      setrowBuyerstatus(carddetails.data.result.buyerpending.toFixed(2));
      setrowAccountsStatus(carddetails.data.result.accountspending.toFixed(2));
  
      
  
  
  
    }
  
    
  
    const getparts=async  (partsuppliers: any[],partbuyers: number) => {
  
       const parts = await supplementarySummariesService.BuyerDashboardGetAllPartNumbersList(partbuyers,partsuppliers);
           setParts(parts.data.result || []);
           console.log('parts',parts.data.result) 
           setselectedparts([]);
  
  
    };
  
  
    const handlepartChange =async  (selectedValues: any[]) => {
      
      console.log(isModalVisible,currentRowId);
      setselectedparts(selectedValues);
      console.log('selectedparts',selectedValues)
  
      var   buyerdashboardinput: BuyerDashboardInput = {
        Supplierids: selectedsuppliers,
        Buyerid: selectedbuyers.value,
        Partids: selectedValues,
        invoicetype:selectedcategory,
        Document:null,
        Date:null
      };
      setdashboardinput(buyerdashboardinput);
      await LoadsupplementarySummary(buyerdashboardinput);
    };
  
   
  
    const handlecategorychange = async(value: number) => {
      console.log(`selected ${value}`);
      setselectedcategory(value);
  
      var   buyerdashboardinput: BuyerDashboardInput = {
        Supplierids: selectedsuppliers,
        Buyerid: selectedbuyers.value,
        Partids: selectedparts,
        invoicetype:value,
        Document:null,
        Date:null

      };
      setdashboardinput(buyerdashboardinput);
      await LoadsupplementarySummary(buyerdashboardinput);
      
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

  const handleDropdownAction = (action: string, id: number,event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`Action: ${action}, Row ID: ${id}`);
    // Placeholder for dropdown action logic
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
  const supplementaryInvoiceSubmit = (item: any) => {
    console.log('Processing item:', item);
    // Your logic here
  };
  const handleSupplementaryDropdownAction = (buttonName: string, rowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentRowId(rowId); // Set the rowId when the button is clicked
    setIsModalVisible(true); // Show the modal
  };
  // const handleCloseModal = () => {
  //   setIsModalVisible(false);        
  // };
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
<DashboardCards BuyerDashboardinputs={dashboardinput} />
<br></br>
<Row gutter={11}>
    <Col className="gutter-row" span={4}>
      <div style={{ textAlign: 'left' }}>
      <h3>Buyer</h3>
      <Select
      
      style={{ width: '200px' }}
      placeholder="Select one or more Buyers"
      options={buyers.map((buyer) => ({
        label: buyer.name,
        value: buyer.id,
      }))}
      value={selectedbuyers.name} 
      onChange={handlebuyerchange} 
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
      <h3>Suppliers</h3>
      <Select
      
      style={{ width: '200px' }}
      placeholder="Select one or more suppliers"
      mode="multiple"
      options={
        suppliers.map((supplier) => ({
          label: supplier.name,
          value: supplier.value,
        }))
      }
      value={selectedsuppliers} 
      onChange={handlesupplierchange} 
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
        onChange={handlepartChange}
        filterOption={(input:any, parts:any) =>
          parts?.label.toLowerCase().includes(input.toLowerCase())}
        optionLabelProp="label"
      />
    </div>
      </Col>
      {/* <Col className="gutter-row" span={4}>
      <div style={{ textAlign: 'left' }}>
      <h3>Document</h3>
      <Select
        mode="multiple"
        style={{ width: '200px' }}
        placeholder="Select one or more suppliers"
        options={parts.map((part) => ({
          label: part.name,
          value: part.value,
        }))}
        value={selectedparts} 
        onChange={handlepartChange}
        filterOption={(input:any, parts:any) =>
          parts?.label.toLowerCase().includes(input.toLowerCase())}
        optionLabelProp="label"
      />
    </div>
      </Col> */}
      
      <Col className="gutter-row" span={4}>
    <div style={{ textAlign: 'left' }}>
      <h3>Date</h3>
      <input 
        type="date" 
        value={selectedDate} 
        onChange={(e) => handledatechange(e.target.value)} 
        style={{ width: '100%' }} 
      />
    </div>
  </Col> 
    </Row>
    
<br></br>
<Tabs defaultActiveKey="1">
    <Tabs.TabPane tab="Home" key="1">
      <div style={{ marginTop: "20px" }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "center" }}>
              {[
                "S.No",
                "PartNumber - Version",
                "Annexure Group",
                "Supplier Name",
                "From",
                "To",
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

            <td  colSpan={6}>
  
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
            {tableData.map((row,index) => (
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{index+1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.partno} - {row.partversionNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.versionNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.suppliername}-{row.suppliercode}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{formatDate(row.contractFromDate)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{formatDate(row.contractToDate)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" ,textAlign:"center"}} colSpan={3}>
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
        {/* <SupplementaryInvoiceModal
        rowId={currentRowId}      // Pass rowId to the modal
        visible={isModalVisible}   // Control visibility of the modal
        onCancel={handleCloseModal} // Function to close modal
      /> */}

    </Tabs.TabPane>
    <Tabs.TabPane tab="Approvals" key="2">
      <div style={{ marginTop: "20px" }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "center" }}>
              {[
                "S.No",
                "Document",
                "Document Number",
                "Date",
                "Value",
                "Ageing",
                "Documents",
                "Accounting Number",
                "Accounting Date",
                "Action",
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
            {tableData.map((row,index) => (
              <tr
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index+1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.document}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.supplementaryInvoiceNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.supplementaryInvoiceDate?formatDate(row.supplementaryInvoiceDate):''}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.total}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.ageing}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}></td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.accountingNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.accountingDate?formatDate(row.accountingDate):''}</td>
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
                      onClick={(event) => toggleDropdown(row.id,event)}
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
                          }}
                          onClick={(event) => handleDropdownAction("Raise Query", row.id,event)}
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
                          }}
                          onClick={(event) => handleDropdownAction("History of Query", row.id,event)}
                        >
                          History of Query
                        </button>
                      </div>
                    )}
                  </div>
                </td>
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
        {/* <SupplementaryInvoiceModal
        rowId={currentRowId}      // Pass rowId to the modal
        visible={isModalVisible}   // Control visibility of the modal
        onCancel={handleCloseModal} // Function to close modal
      /> */}

    </Tabs.TabPane>
    <Tabs.TabPane tab="Queries" key="3">
    <BuyerQueryModal disputesStore={ new DisputedataStore} />
</Tabs.TabPane>

  </Tabs>
  
      
          
    </div>
  );
};

export default PayRetroBuyerDashboard;

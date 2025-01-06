import * as React from "react";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import { SupplierDashboardInput } from "../../../Dashboard/components/PayRetroSupplierDashboard/SupplierDashboardInput";
import { Row, Col,Select, message} from 'antd';
import DashboardCards from "../../../Dashboard/components/PayRetroSupplierDashboard/DashboardCards";
import ApproveorRejectModal from "../ApproveorRejectModal"


declare var abp: any;

const PayRetroAccountsDashboard: React.SFC = () => {
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
  const [selectedsuppliers, setselectedsuppliers] = React.useState({ name: '', value:0 });
  const [suppliers, setSuppliers] =React.useState<any[]>([]);
  const [selectedcategory, setselectedcategory] =React.useState<any>(String);
  const [buyers, setBuyers] =React.useState<any[]>([]);
  const [selectedbuyers, setselectedbuyers] =React.useState<any[]>([]);
  const [parts, setParts] =React.useState<any[]>([]);
  const [selectedparts, setselectedparts] =React.useState<any[]>([]);
  const [rowsupplierstatus, setrowsupplierstatus] = React.useState<number | null>(0); 
  const [rowBuyerstatus, setrowBuyerstatus] = React.useState<number | null>(0); 
  const [rowAccountsStatus, setrowAccountsStatus] = React.useState<number | null>(0);
    const [submitIdRow, setSubmitIdRow] = React.useState<number>(0);
  const [isSupplierSubmitModalOpen, setIsSupplierSubmitModalOpen] = React.useState<boolean>(false); // To control modal visibility
  
  
  
  const [dashboardinput, setdashboardinput] = React.useState<SupplierDashboardInput>({
      Supplierid: 0,
      Buyerids: [0],
      Partids: [0],
      invoicetype:0
    });
  // const [selectedRow, setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
  // const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false); // To control modal visibility
  // const [modalData, setModalData] = React.useState<any[]>([]);
  // const [annexuremodalData, annexuresetModalData] = React.useState<any[]>([]);

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

  const toggleDropdown = (id: number) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleDropdownAction = (action: string, id: number) => {
    console.log(`Action: ${action}, Row ID: ${id}`);
    // Placeholder for dropdown action logic
    setSubmitIdRow(id);
    setIsSupplierSubmitModalOpen(true);

  };

  const closeSupplierSubmitModal = () => {
    setIsSupplierSubmitModalOpen(false);
  };

  
  function formatDate(d:string) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 

    return `${day}-${month}-${year}`; 
}

  

  const approveSubmit = (item: any) => {
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
    const url = `${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}RetroPay/AccountsApprovalWorkflow`;
    fetch(url, {
      method: 'POST',
      body: jsondata,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => {
        abp.ui.clearBusy();
        message.success(`Approve Mail Sent to - ${item.buyerName}`);
      })
      .catch((error) => {
        abp.ui.clearBusy();
        abp.message.error(error.message || error);
      });

  };
  const rejectSubmit = (item: any) => {
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
    const url = `${process.env.REACT_APP_REMOTE_SERVICE_BASE_URL}RetroPay/AccountsRejectionWorkflow`;
    fetch(url, {
      method: 'POST',
      body: jsondata,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => {
        abp.ui.clearBusy();
        message.success(`Approve Mail Sent to - ${item.buyerName}`);
      })
      .catch((error) => {
        abp.ui.clearBusy();
        abp.message.error(error.message || error);
      });

  };


  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      

      <div style={{ marginTop: "20px" }}>
        
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
        value: supplier.id,
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
      placeholder="Select one or more Parts"
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
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>
              {[
                "S.No",
                "Document",
                "Date",
                "Value",
                "Ageing",
                "Documents",
                "Accountant Number",
                "Acc Date",
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

              <td  colSpan={9}>

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
               /// onClick={() => handleRowClick(row)} // Add click event here
                // onMouseEnter={() => setHoveredRowId(row.id)}
                // onMouseLeave={() => setHoveredRowId(null)}
                // style={{
                //   backgroundColor: hoveredRowId === row.id ? "#f1f1f1" : row.id % 2 === 0 ? "#f9f9f9" : "#ffff",
                //   cursor: "pointer",
                // }}
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.id}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.document}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(row.createtime)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.value}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.ageing}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.Documents}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.accountantnumber}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.AccountDate}</td>
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
                      onClick={() => toggleDropdown(row.id)}
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
                          width: "150px",
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
                          onClick={() => handleDropdownAction("Action 1", row.id)}
                        >
                          Approve/Reject
                        </button>                       
                      </div>
                    )}
                  </div>
                </td>                          
                <td style={{ padding: "10px", border: "1px solid #ddd" }} colSpan={3}>
  <div className="progress-tube">
    <div className="progress-segment approved" style={{ width: "33%" }}></div>
    <div className="progress-segment rejected" style={{ width: "33%" }}></div>
    <div className="progress-segment pending" style={{ width: "33%" }}></div>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ApproveorRejectModal isOpen={isSupplierSubmitModalOpen} onClose={closeSupplierSubmitModal} submitIdRow={submitIdRow}
        approveSubmit={approveSubmit} rejectSubmit={rejectSubmit} />
        
     {/* {isModalOpen && modalData && Suppliermodalview(selectedRow)} */}
    </div>
  );
};

export default PayRetroAccountsDashboard;

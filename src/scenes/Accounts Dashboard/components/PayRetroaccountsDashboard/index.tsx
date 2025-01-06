import * as React from "react";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import { AccountDashboardInput } from "./AccountsDashboardInput";
import { Row, Col,Select, message} from 'antd';
import  DashboardCards  from "../PayRetroaccountsDashboard/DashboardCards";
import ApproveorRejectModal from "../ApproveorRejectModal"


declare var abp: any;

const PayRetroAccountsDashboard: React.SFC = () => {
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
  const [selectedsuppliers, setselectedsuppliers] =React.useState<any[]>([]);  
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
      const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [isSupplierSubmitModalOpen, setIsSupplierSubmitModalOpen] = React.useState<boolean>(false); // To control modal visibility
  
  
  
  const [dashboardinput, setdashboardinput] = React.useState<AccountDashboardInput>({
    Buyerids: [0],
    Supplierids: [0],
    Partids:[0],
    invoicetype:0, 
    Date:new Date,
    Document:'',
    });
  // const [selectedRow, setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
  // const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false); // To control modal visibility
  // const [modalData, setModalData] = React.useState<any[]>([]);
  // const [annexuremodalData, annexuresetModalData] = React.useState<any[]>([]);

  //var userid='0';

  React.useEffect(() => {
    
    

    

     const fetchData = async () => {
          try {
    
           
            const suppliers = await supplementarySummariesService.GetAllSuppliersaccountsdashboard([0]);
            console.log('suppliers',suppliers)
            setSuppliers(suppliers.data.result || []);
            setselectedsuppliers([]);
           
            const buyers = await supplementarySummariesService.GetAllBuyers('0');
            console.log('buyers',buyers)
            setBuyers(buyers.data.result || []);
            setselectedsuppliers([]);
           
            setselectedcategory(0);
              
    
              
              getparts([0],[0])
              setselectedcategory(0);
    
              var accountsdashboardinput : AccountDashboardInput = {
                Supplierids: [0],
                Buyerids: [0],
                Partids: [0],
                invoicetype:0,
                Date:null,
                Document:null

              };
    
              setdashboardinput(accountsdashboardinput);
    
              await AccountsDashboardSummaries(accountsdashboardinput);
          
            console.log('Suppliers',suppliers.data.result);
            
          } catch (error) {
            console.error("Error fetching supplementary summaries:", error);
          }
        };

    fetchData();
  }, []);

  const handlesupplierchange =async  (selectedValues: any[]) => {
        
        setselectedsuppliers(selectedValues);
        console.log('selectedsuppliers',selectedValues)
    
        getparts(selectedValues,selectedbuyers);
    
        var   accountDashboardInput: AccountDashboardInput = {
          Supplierids: selectedsuppliers,
        Buyerids: selectedbuyers,
        Partids: selectedValues,
        invoicetype:selectedcategory,
        Date:null,
        Document : ''
        };
        setdashboardinput(accountDashboardInput);
        await AccountsDashboardSummaries(accountDashboardInput);
      };
  
  
    const handlebuyerChange =async  (selectedValues: any[]) => {
        
        setselectedbuyers(selectedValues);
        console.log('selectedbuyers',selectedValues)
    
        getparts(selectedsuppliers,selectedValues);

        getsuppliers(selectedValues)
    
        var   accountDashboardInput: AccountDashboardInput = {
          Supplierids: selectedsuppliers,
        Buyerids: selectedbuyers,
        Partids: selectedValues,
        invoicetype:selectedcategory,
        Date:new Date,
        Document : ''
        };
        setdashboardinput(accountDashboardInput);
        await AccountsDashboardSummaries(accountDashboardInput);
      };
  const handledatechange = async (value:any)=>{
     console.log('Selected Date',value)
      
  
      const dateObject =value && value.trim() !== "" ? new Date(value) : null;
  
      setSelectedDate(value);

      var   accountDashboardInput: AccountDashboardInput = {
        Supplierids:selectedsuppliers,
        Buyerids:selectedbuyers,
        Partids: selectedparts,
        invoicetype:selectedcategory,
        Date:dateObject,
        Document:null
      };
  
      setdashboardinput(accountDashboardInput);
        await AccountsDashboardSummaries(accountDashboardInput);
  
    };
  
    
    
    
    const AccountsDashboardSummaries=async (accountDashboardInput:AccountDashboardInput)=>
    {
  
    var  result = await supplementarySummariesService.accountsDashboardSummaries(accountDashboardInput);
      setTableData(result.data.result || []);
      console.log("Supplementary_top_table", result.data.result);
  
      const carddetails = await supplementarySummariesService.accounntcarddetails(accountDashboardInput);
  
      setrowsupplierstatus(carddetails.data.result.supplierpending.toFixed(2));
      setrowBuyerstatus(carddetails.data.result.buyerpending.toFixed(2));
      setrowAccountsStatus(carddetails.data.result.accountspending.toFixed(2));
  
      
  
  
  
    }
  
    const getsuppliers =async  (supplybuyers: any[]) => {
          
          
      
          const suppliers = await supplementarySummariesService.GetAllSuppliersaccountsdashboard(supplybuyers);
              setSuppliers(suppliers.data.result || []);
              setselectedsuppliers([]);
              
      
            
              
      
        };
  
    const getparts=async  (partsuppliers: any[],partbuyers: any[]) => {
      
           const parts = await supplementarySummariesService.AccountDashboardGetAllPartNumbersList(partbuyers,partsuppliers);
               setParts(parts.data.result || []);
               console.log('parts',parts.data.result) 
               setselectedparts([]);
      
      
        };
  
  
    const handlepartChange =async  (selectedValues: any[]) => {
      
      setselectedparts(selectedValues);
      console.log('selectedparts',selectedValues)
  
      var   accountDashboardInput: AccountDashboardInput = {
        Supplierids: selectedsuppliers,
        Buyerids: selectedbuyers,
        Partids: selectedValues,
        invoicetype:selectedcategory,
        Date:new Date,
        Document : ''
      };
      setdashboardinput(accountDashboardInput);
      await AccountsDashboardSummaries(accountDashboardInput);
    };
  
   
  
    const handlecategorychange = async(selectedValues: any[]) => {
      console.log('selected', selectedValues);
      setselectedcategory(selectedValues);
  
      var   accountDashboardInput: AccountDashboardInput = {
        Supplierids: selectedsuppliers,
        Buyerids: selectedbuyers,
        Partids: selectedValues,
        invoicetype:selectedcategory,
        Date:new Date,
        Document : ''
      };
      setdashboardinput(accountDashboardInput);
      await AccountsDashboardSummaries(accountDashboardInput);
      
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
        
        <DashboardCards AccountDashboardInput={dashboardinput} />
        <br></br>

        <Row gutter={11}>
            <Col className="gutter-row" span={4}>
              <div style={{ textAlign: 'left' }}>
              <h3>Buyer</h3>
              <Select
              mode="multiple"
              style={{ width: '200px' }}
              placeholder="Select one or more Buyers"
              options={buyers.map((buyer) => ({
                label: buyer.name,
                value: buyer.value,
              }))}
              value={selectedbuyers} 
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

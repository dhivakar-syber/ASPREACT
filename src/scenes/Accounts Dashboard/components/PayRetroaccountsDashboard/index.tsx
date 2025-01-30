import * as React from "react";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import { AccountDashboardInput } from "./AccountsDashboardInput";
import { Row, Col,Select, message,Tabs,Button,Modal,Card, Tooltip} from 'antd';
import  DashboardCards  from "../PayRetroaccountsDashboard/DashboardCards";
import ApproveorRejectModal from "../ApproveorRejectModal"
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import AccountQueryModal from "./AccountsQueryModal"
import DisputedataStore from "../../../../stores/DisputesStrore";
import settingsIcon from "../../../../images/Setting.svg";


const PayRetroAccountsDashboard: React.SFC = () => {
  const [tableData, setTableData] = React.useState<any[]>([]);
  // const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
  const [selectedsuppliers, setselectedsuppliers] =React.useState<any[]>([]);  
  const [suppliers, setSuppliers] =React.useState<any[]>([]);
  const [selectedcategory, setselectedcategory] =React.useState<any>(String);
  const [selectedstatus, setselectedstatus] =React.useState<number|null>(0);
  const [buyers, setBuyers] =React.useState<any[]>([]);
    const [selectedbuyers, setselectedbuyers] =React.useState<any[]>([]);
  const [parts, setParts] =React.useState<any[]>([]);
  const [selectedparts, setselectedparts] =React.useState<any[]>([]);
  const [rowsupplierstatus, setrowsupplierstatus] = React.useState<number | null>(0); 
  const [rowBuyerstatus, setrowBuyerstatus] = React.useState<number | null>(0); 
  const [rowAccountsStatus, setrowAccountsStatus] = React.useState<number | null>(0);
    const [submitIdRow,setSubmitIdRow] = React.useState<number>(0);
      const [selectedDate, setSelectedDate] = React.useState<Date|null>(null);
      const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);  
      const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [isSupplierSubmitModalOpen, setIsSupplierSubmitModalOpen] = React.useState<boolean>(false); // To control modal visibility
  const SettingsIcon = () => (
    <span role="img" aria-label="home" className="anticon">
    <img src={settingsIcon} alt="Settings" />
    </span>
  );
  
  
  
  const [dashboardinput, setdashboardinput] = React.useState<AccountDashboardInput>({
    Buyerids: [0],
    Supplierids: [0],
    Partids:[0],
    invoicetype:0, 
    Date:selectedDate,
    DocumentStatusFilter:selectedstatus ,
    });

  React.useEffect(() => {
    
    

    

     const fetchData = async () => {
          try {
    
           
            const suppliers = await supplementarySummariesService.GetAllSuppliersaccountsdashboard([0]);
            console.log('suppliers',suppliers)
            setSuppliers(suppliers.data.result || []);
            setselectedsuppliers([]);
           
            const buyers = await supplementarySummariesService.GetAllBuyersList(0);
            console.log('buyers',buyers)
            setBuyers(buyers.data.result || []);
            setselectedbuyers([]);
           
            setselectedcategory(0);
              
    
              
              getparts([0],[0])
              setselectedcategory(0);
    
              var accountsdashboardinput : AccountDashboardInput = {
                Supplierids: [0],
                Buyerids: [0],
                Partids: [0],
                invoicetype:0,
                Date:selectedDate,
                DocumentStatusFilter:selectedstatus

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
        Date:selectedDate,
        DocumentStatusFilter:selectedstatus
        };
        setdashboardinput(accountDashboardInput);
        await AccountsDashboardSummaries(accountDashboardInput);
      };
  
  
    const handlebuyerChange =async  (selectedValues: any[]) => {
        
        setselectedbuyers(selectedValues);
        console.log('selectedbuyers',selectedValues)
    
        getparts(selectedparts,selectedValues);

        getsuppliers(selectedValues)
    
        var   accountDashboardInput: AccountDashboardInput = {
          Supplierids: selectedsuppliers,
        Buyerids: selectedValues,
        Partids: selectedparts,
        invoicetype:selectedcategory,
        Date:selectedDate,
        DocumentStatusFilter:selectedstatus
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
        DocumentStatusFilter:selectedstatus
      };
  
      setdashboardinput(accountDashboardInput);
        await AccountsDashboardSummaries(accountDashboardInput);
  
    };
  
    
    
    
    const AccountsDashboardSummaries=async (accountDashboardInput:AccountDashboardInput)=>
    {
  
    var  result = await supplementarySummariesService.accountsDashboardSummaries(accountDashboardInput);
      setTableData(result.data.result || []);
      console.log("Account_Supplementary_top_table", result.data.result);
  
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
        Date:selectedDate,
        DocumentStatusFilter :selectedstatus
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
        Date:selectedDate,
        DocumentStatusFilter:selectedstatus
      };
      setdashboardinput(accountDashboardInput);
      await AccountsDashboardSummaries(accountDashboardInput);
      
    };
    const handlestatuschange = async(selectedValues:number) => {
      console.log('selected', selectedValues);
      setselectedstatus(selectedValues);
  
      var   accountDashboardInput: AccountDashboardInput = {
        Supplierids: selectedsuppliers,
        Buyerids: selectedbuyers,
        Partids: selectedparts,
        invoicetype:selectedcategory,
        Date:selectedDate,
        DocumentStatusFilter : selectedstatus
      };
      setdashboardinput(accountDashboardInput);
      await AccountsDashboardSummaries(accountDashboardInput);
      
    };
  

  // const handleClickOutside = (event: MouseEvent) => {
  //   const target = event.target as HTMLElement;
  //   if (!target.closest(".dropdown-container")) {
  //     setOpenDropdownId(null);
  //   }
  // };

  // React.useEffect(() => {
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  // const toggleDropdown = (id: number,event: React.MouseEvent) => {
  //   setOpenDropdownId((prevId) => (prevId === id ? null : id));
  // };

  // const handleDropdownAction = (action: string, id: number) => {
  //   console.log(`Action: ${action}, Row ID: ${id}`);
  //   // Placeholder for dropdown action logic
  //   setSubmitIdRow(id);
  //   setIsSupplierSubmitModalOpen(true);

  // };

  const handleClickAction = ( id: number) => {
    console.log(` Row ID: ${id}`);
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
  const handleSupplementrypdfButtonClick = async (pdfPath: string) => {
        try {
            // Fetch file data from the API
            const response = await supplementarySummariesService.GetFile(pdfPath);
    
            if (response && response.fileBytes && response.fileType) {
                // Convert the fileBytes (base64 string) into a data URL
                const dataUrl = `data:${response.fileType};base64,${response.fileBytes}`;
                
                // Set the generated data URL to display in the iframe
                setPdfUrl(dataUrl);
                setIsModalVisible(true); // Open the modal
            } else {
                console.error("Invalid file response:", response);
            }
        } catch (error) {
            console.error("Error fetching the PDF file:", error);
        }
    };
    const handleSupplementryPathCancel = () => {
      setIsModalVisible(false); // Close the modal
    };
    const handleAnnexurepdfButtonClick = async (pdfPath: string) => {
        try {
            // Fetch file data from the API
            const response = await supplementarySummariesService.GetFile(pdfPath);
    
            if (response && response.fileBytes && response.fileType) {
                // Convert the fileBytes (base64 string) into a data URL
                const dataUrl = `data:${response.fileType};base64,${response.fileBytes}`;
                
                // Set the generated data URL to display in the iframe
                setPdfUrl(dataUrl);
                setIsModalVisible(true); // Open the modal
            } else {
                console.error("Invalid file response:", response);
            }
        } catch (error) {
            console.error("Error fetching the PDF file:", error);
        }
    };
    async function downloadFile({ path }: { path: string }): Promise<void> {
      try {
        // Call the service method to get the file details
        const file = await supplementarySummariesService.DownloadExcel(path);
    
        // Check if the required properties exist
        if (!file.fileContent || !file.fileType || !file.fileName) {
          throw new Error("Invalid file data received.");
        }
    
        // Convert the file content (Base64) into a Blob
        const byteCharacters = atob(file.fileContent);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: file.fileType });
    
        // Create a temporary anchor element to trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // Create a Blob URL
        link.download = file.fileName || "Annexure.xlsx"; // Use provided filename or default
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        // Revoke the Blob URL to free up memory
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
    }
    
    
      const handleAnnexurePathCancel = async () => {
        setIsModalVisible(false); // Close the modal
      };

  const approveSubmit = async (item: any) => {

    message.success(` Document Approved Successfully & Mail Sent to ${item.supplierName}`);
    
      var   accountDashboardInput: AccountDashboardInput = {
        Supplierids: selectedsuppliers,
        Buyerids: selectedbuyers,
        Partids: selectedparts,
        invoicetype:selectedcategory,
        Date:selectedDate,
        DocumentStatusFilter : selectedstatus
      };
      setdashboardinput(accountDashboardInput);
        await AccountsDashboardSummaries(accountDashboardInput);

  };
  const rejectSubmit = async (item: any) => {

    message.success(` Document Rejected Successfully & Mail Sent to ${item.supplierName}`);
    
      var   accountDashboardInput: AccountDashboardInput = {
        Supplierids: selectedsuppliers,
        Buyerids: selectedbuyers,
        Partids: selectedparts,
        invoicetype:selectedcategory,
        Date:selectedDate,
        DocumentStatusFilter : selectedstatus
      };
      setdashboardinput(accountDashboardInput);
       AccountsDashboardSummaries(accountDashboardInput);

  };


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
                <p>Account Dashboard</p>
              </Row>
            </div>
      

        
        <DashboardCards AccountsDashboardInputs={dashboardinput} />
        
       <Card style={{ backgroundColor:"#fafafa", fontSize: "12px" }}>
        <Row gutter={11} style={{ marginRight:'-200.5px'}} >
            <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
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
              onChange={handlebuyerChange} 
              showSearch 
              optionLabelProp="label"
              filterOption={(input:any, buyers:any) =>
                buyers?.label.toLowerCase().includes(input.toLowerCase())
              } 
            />
            </div>
              </Col>
              <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
              <div style={{ textAlign: 'left' }}>
              <span style={{padding: "2px"}}>Suppliers</span>
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
              <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
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
        
                }
              ]}
              value={selectedcategory}
                onChange={handlecategorychange}
                optionLabelProp="label"
              />
            </div>
              </Col>
              
              <Col className="gutter-row" span={2} style={{ maxWidth: '250px' }}>
              <div style={{ textAlign: 'left' }}>
              <span style={{padding: "2px"}}>Parts</span>
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
              
              <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '215px', margin: '4px' }}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ padding: "2px" }}>Date</span>
          <div style={{
            border: '1px solid #d9d9d9',
            borderRadius: '5px',
            padding: '4px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
            transition: 'border 0.3s ease, box-shadow 0.3s ease', // Smooth transition
          }}
        onFocus={(e) => {
          e.currentTarget.style.border = '1px solid #3cb48c';
          e.currentTarget.style.boxShadow = '0 0 5px #3cb48c';
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = '1px solid #d9d9d9';
          e.currentTarget.style.boxShadow = 'none';
        }}
        tabIndex={0} // Ensures div can receive focus events
          >
            <input
              type="date"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''} // Convert Date to string (YYYY-MM-DD)
              onChange={(e) => handledatechange(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>
      </Col>
              <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
              <div style={{ textAlign: 'left' }}>
              <span style={{padding: "2px"}}>Document Status</span>
              
              <Select<number>
                
                style={{ width: '200px' }}
                placeholder="Select one or more options"
                options={[
                  {
                    label: 'Select All',
                    value: 0,
                  },
                {
                  label: 'Pending',
                  value: 1,
        
                },
                {
                  label: 'Approved',
                  value: 2,
                },
                {
                  label: 'Rejected',
                  value: 3,
                },

              ]}
              value={selectedstatus ?? undefined}
                onChange={handlestatuschange}
                optionLabelProp="label"
              />
            </div>
              </Col>
            </Row>


            <Tabs defaultActiveKey="1">
    <Tabs.TabPane tab="Home" key="1">
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px" ,whiteSpace:"nowrap"}}>
          <thead>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left",fontWeight: 'normal' }}>
              {[
                "S.No",
                "Document",
                "Document Number",
                "Date",
                "Value",
                "Ageing",
                "Documents",
                "Accounting  Number",
                "Acc Date",
                "Action",
                "Supplier",
                "Buyer",
                "F&C",
              ].map((header) => (
                <th key={header} style={{ padding: "10px", border: "1px solid #ffffff1a",fontWeight: 'normal' }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left",fontWeight: 'normal' }}>

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
                key={row.id}
               /// onClick={() => handleRowClick(row)} // Add click event here
                // onMouseEnter={() => setHoveredRowId(row.id)}
                // onMouseLeave={() => setHoveredRowId(null)}
                // style={{
                //   backgroundColor: hoveredRowId === row.id ? "#f1f1f1" : row.id % 2 === 0 ? "#f9f9f9" : "#ffff",
                //   cursor: "pointer",
                // }}
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index+1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.document}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.supplementaryInvoiceNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(row.supplementaryInvoiceDate)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.total}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.ageing}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", width: "175px" }}>
                  <span>
                  {row.supplementaryInvoicePath && (
                      <Tooltip title="Supplementary Invoice/Credit Note">
                        <Button
                          type="link"
                          onClick={() => handleSupplementrypdfButtonClick(row.supplementaryInvoicePath)}
                        >
                          <FilePdfOutlined />
                        </Button>
                      </Tooltip>
                    )}

                    {row.annecurePath && (
                      <Tooltip title="Annexure">
                      <Button
                        type="link"
                        onClick={() => handleAnnexurepdfButtonClick(row.annecurePath)}
                      >
                        <FilePdfOutlined />
                      </Button>
                      </Tooltip>
                    )}
                    {row.supplementaryInvoicePath3 && (
                     <Tooltip title="Annexure Attachment">
                      <Button
                        type="link"
                        onClick={() =>downloadFile({path: row.supplementaryInvoicePath3 })}>
                        <FileExcelOutlined />
                      </Button>
                      </Tooltip>
                    )}
                  </span>
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.accountingNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>{row.accountingDate?formatDate(row.accountingDate):''}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
                  <div className="dropdown-container" style={{ position: "relative" }}>
                  <Tooltip title="Approve or Reject">

                  {row.accountantApprovalStatus==1&&<button
                      style={{
                        backgroundColor: "transparent", // Fixed from "none" to "transparent"
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                       onClick={(event) => handleClickAction(row.id)}
                    >
                      <SettingsIcon   />
                    </button>}
                    </Tooltip>                

                    {/* {openDropdownId === row.id && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          zIndex: 999,
                          padding: "10px",
                          //width: "150px",
                        }}
                      >
                        <button
                          style={{
                            width: "100%",
                            backgroundColor: "#fff",
                            color: "#071437",
                            border: "none",
                            //padding: "10px",
                            marginBottom: "5px",
                            textAlign: 'left',
                            cursor: 'pointer', // Add pointer cursor for a better user experience
                            transition: 'background-color 0.3s', // Smooth transition for background color change
                          }}
                          onMouseEnter={(e) => {
                            const target = e.target as HTMLButtonElement; // Type assertion
                            target.style.backgroundColor = '#f3efef'; // Change background on hover
                          }}
                          onMouseLeave={(e) => {
                            const target = e.target as HTMLButtonElement; // Type assertion
                            target.style.backgroundColor = '#fff'; // Revert background when hover ends
                          }}
                         // onClick={() => handleDropdownAction("Action 1", row.id)}
                        >
                          Approve/Reject
                        </button>       
                      </div>
                    )} */}
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
        <ApproveorRejectModal isOpen={isSupplierSubmitModalOpen} onClose={closeSupplierSubmitModal} submitIdRow={submitIdRow}
        approveSubmit={approveSubmit} rejectSubmit={rejectSubmit} />
        <Modal
        title="View PDF"
        visible={isModalVisible}
        onCancel={handleSupplementryPathCancel}
        footer={null}
        width="60%"
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: 'none' }}
          />
        )}
      </Modal>
      <Modal
        title="View PDF"
        visible={isModalVisible}
        onCancel={handleAnnexurePathCancel}
        footer={null}
        width="60%"
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: 'none' }}
          />
        )}
      </Modal>
      	</Tabs.TabPane>
    <Tabs.TabPane tab="Queries" key="3">
    <AccountQueryModal disputesStore={new DisputedataStore}
                         AccountDashboardInput ={dashboardinput} />

    </Tabs.TabPane>
  </Tabs> 
     
  </Card> 
     
    </div>
  );
};

export default PayRetroAccountsDashboard;

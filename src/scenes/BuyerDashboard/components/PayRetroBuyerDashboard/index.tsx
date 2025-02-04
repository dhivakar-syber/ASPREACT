import * as React from "react";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";

import  DashboardCards  from "./BuyerDashboardCards";
import { Row, Col,Select, Tabs,Button,Modal,message,Card, Tooltip,Spin } from 'antd';
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import { BuyerDashboardInput } from "./BuyerDashboardInput";
import BuyerQueryModal from "./BuyerQueryModal"
//import DisputedataStore from "../../../../stores/DisputesStrore";
//import { keys } from "mobx";
import settingsIcon from "../../../../images/Setting.svg";
import SessionStore from "../../../../stores/sessionStore";
import { inject, observer } from "mobx-react"; // Import MobX utilities

import ApproveorRejectModal from "../ApproveorRejectModal"

declare var abp: any;
const SettingsIcon = () => (
  <span role="img" aria-label="home" className="anticon">
  <img src={settingsIcon} alt="Settings" />
  </span>
);
  const PayRetroBuyerDashboard:React.FC<{ sessionStore?: SessionStore }> = ({
    sessionStore,
  }) => {
  const [tableData, setTableData] = React.useState<any[]>([]);
  // const [openDropdownId, setOpenDropdownId] = React.useState<number | null>(null);
  const [suppliers, setSuppliers] =React.useState<any[]>([]);
  const [selectedsuppliers, setselectedsuppliers] =React.useState<any[]>([]);   
  const [buyers, setBuyers] =React.useState<any[]>([]);
  const [selectedbuyers, setselectedbuyers] = React.useState({ name: '', value:0 });
  const [parts, setParts] =React.useState<any[]>([]);
  const [selectedparts, setselectedparts] =React.useState<any[]>([]);
  const [selectedcategory, setselectedcategory] =React.useState<any>(String);
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);  
  const [selectedstatus, setselectedstatus] =React.useState<number|null>(0);
 // const [isQueryModalVisible, setIsQueryModalVisible] = React.useState<boolean>(false);  
  const [submitIdRow,setSubmitIdRow] = React.useState<number>(0);
  const [rowsupplierstatus, setrowsupplierstatus] = React.useState<number | null>(0); 
  const [rowBuyerstatus, setrowBuyerstatus] = React.useState<number | null>(0); 
  const [rowAccountsStatus, setrowAccountsStatus] = React.useState<number | null>(0); 
  const [selectedDate, setSelectedDate] = React.useState("");
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [isApproveRejectModalOpen, setIsApproveRejectModalOpen] = React.useState<boolean>(false); // To control modal visibility
  const [hasRole, setHasRole] = React.useState<boolean>(false);
  const [loading, setloading] = React.useState<boolean>(false);

  const [dashboardinput, setdashboardinput] = React.useState<BuyerDashboardInput>({
    Supplierids:[0],
    Buyerid:0,
    Partids:[0],
    DocumentStatusFilter : selectedstatus,
    invoicetype:0,
    Date:null,
    });
    // const disputedataStoreInstance = new DisputedataStore(); // Move outside render


  var userid='0';
  
  

  React.useEffect(() => {
    

    const fetchData = async () => {
      try {

        const roles = sessionStore?.currentLogin?.user?.roles || [];
        const requiredRoles = ["admin", "PayRetroAdmin","Admin","payretroadmin"];
        const hasRole = roles.some(role => requiredRoles.includes(role));
        setHasRole(hasRole);
         if (roles.includes('admin') || roles.includes('PayRetroAdmin') || roles.includes('Admin')|| roles.includes('payretroadmin')) {
          userid = '0';
        } else {
          userid = abp.session.userId;
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
          setselectedbuyers({name:buyers.data.result[0].name,value:buyers.data.result[0].id});
          getsuppliers(buyers.data.result[0].id)
          setselectedcategory(0);
          getparts([],buyers.data.result)

          var   buyerdashboard: BuyerDashboardInput = {
            Supplierids:[0],
            Buyerid:buyers.data.result[0].id,
            Partids: [0],
            invoicetype:0,
            Date:null,
            DocumentStatusFilter : selectedstatus,
          };
      
          setdashboardinput(buyerdashboard);
            await LoadsupplementarySummary(buyerdashboard);
      
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
      DocumentStatusFilter : selectedstatus,
    };

    setdashboardinput(buyerdashboard);
      await LoadsupplementarySummary(buyerdashboard);

  };


  const handlebuyerchange = async  (value:any, option:any) => {
      
      console.log('selectedbuyers',option,value)
      setselectedbuyers({name:option.label,value:value});
  
  
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
        DocumentStatusFilter : selectedstatus,
        
        

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
        DocumentStatusFilter : selectedstatus,
        Date:null
      };
      setdashboardinput(buyerdashboardinput);
      await LoadsupplementarySummary(buyerdashboardinput);
    };
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
    
    const approveSubmit = async(item: any) => {
      
      setloading(true);

     


        var   buyerdashboard: BuyerDashboardInput = {
          Supplierids:selectedsuppliers,
          Buyerid:selectedbuyers.value,
          Partids: selectedparts,
          invoicetype:selectedcategory,
          Date:null,
          DocumentStatusFilter : selectedstatus,
        };
    
        setdashboardinput(buyerdashboard);
          await LoadsupplementarySummary(buyerdashboard);   
          setloading(false)    
          message.success(`${item.document} Approval Mail sent to Accounts`);   
    };
    const rejectSubmit = async(item: any) => {

        setloading(true);
       

        var   buyerdashboard: BuyerDashboardInput = {
          Supplierids:selectedsuppliers,
          Buyerid:selectedbuyers.value,
          Partids: selectedparts,
          invoicetype:selectedcategory,
          Date:null,
          DocumentStatusFilter : selectedstatus,
        };
    
        setdashboardinput(buyerdashboard);
          await LoadsupplementarySummary(buyerdashboard);   
          setloading(false);  
          message.success(`${item.document} Rejected Mail sent to ${item.suppliername}`);
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
  
     // const disput = new DisputedataStore();

      //await disput.buyergetAll(buyerdashboardinput);
        
  
  
    }
  
    
  
    const getparts=async  (partsuppliers: any[],partbuyers: number) => {
  
       const parts = await supplementarySummariesService.BuyerDashboardGetAllPartNumbersList(partbuyers,partsuppliers);
           setParts(parts.data.result || []);
           console.log('parts',parts.data.result) 
           setselectedparts([]);
  
  
    };
  
  
    const handlepartChange =async  (selectedValues: any[]) => {
      
      // console.log(isModalVisible,currentRowId);
      setselectedparts(selectedValues);
      console.log('selectedparts',selectedValues)
  
      var   buyerdashboardinput: BuyerDashboardInput = {
        Supplierids: selectedsuppliers,
        Buyerid: selectedbuyers.value,
        Partids: selectedValues,
        invoicetype:selectedcategory,
        DocumentStatusFilter : selectedstatus,
        Date:null
      };
      setdashboardinput(buyerdashboardinput);
      await LoadsupplementarySummary(buyerdashboardinput);
    };
  
        const handlestatuschange = async(selectedValues:number) => {
          console.log('selected', selectedValues);
          setselectedstatus(selectedValues);
      
          var   buyerdashboardinput: BuyerDashboardInput = {
            Supplierids: selectedsuppliers,
            Buyerid: selectedbuyers.value,
            Partids: selectedparts,
            invoicetype:selectedcategory,
            DocumentStatusFilter : selectedValues,
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
        DocumentStatusFilter : selectedstatus,
        Date:null

      };
      setdashboardinput(buyerdashboardinput);
      await LoadsupplementarySummary(buyerdashboardinput);
      
    };


  
  const handleClickAction = ( id: number) => {
    console.log(` Row ID: ${id}`);
    // Placeholder for dropdown action logic
    setSubmitIdRow(id);
    setIsApproveRejectModalOpen(true);

  };
  const closeApproveRejectModal = () => {
    setIsApproveRejectModalOpen(false);
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
    position: 'fixed', // Keeps it at the center without affecting scrolling
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', // Centering trick
    textAlign: 'center',
  }}
>
  <Spin size="large" />
  
</div >

);


  return (
    <div>
      {!loading&&<div>
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
                <p>Buyer Dashboard</p>
              </Row>
            </div>
        <DashboardCards BuyerDashboardinputs={dashboardinput} />

              <Card style={{ backgroundColor:"#fafafa", fontSize: "12px" }}>
        
              <Row gutter={16} style={{ marginRight: '0', display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
              {hasRole?(
  <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
    <div style={{ textAlign: 'left' }}>
      <span style={{ padding: '2px' }}>Buyers</span>
      <Select
        style={{ width: '100%' }}
        placeholder="Select Buyer"
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
):''}
  <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
    <div style={{ textAlign: 'left' }}>
      <span style={{ padding: '2px' }}>Suppliers</span>
      <Select
        style={{ width: '100%' }}
        placeholder="Select one or more suppliers"
        mode="multiple"
        options={suppliers.map((supplier) => ({
          label: supplier.name,
          value: supplier.value,
        }))}
        value={selectedsuppliers}
        onChange={handlesupplierchange}
        optionLabelProp="label"
      />
    </div>
  </Col>
  <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
    <div style={{ textAlign: 'left' }}>
      <span style={{ padding: '2px' }}>Category</span>
      <Select
        style={{ width: '100%' }}
        placeholder="Select a category"
        options={[
          { label: 'Select All', value: 0 },
          { label: 'Supplementary Invoice', value: 1 },
          { label: 'Credit Note', value: 2 },
        ]}
        value={selectedcategory}
        onChange={handlecategorychange}
        optionLabelProp="label"
      />
    </div>
  </Col>
  <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
    <div style={{ textAlign: 'left' }}>
      <span style={{ padding: '2px' }}>Parts</span>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select one or more parts"
        options={parts.map((part) => ({
          label: part.name,
          value: part.value,
        }))}
        value={selectedparts}
        onChange={handlepartChange}
        filterOption={(input:any, parts:any) =>
          parts?.label.toLowerCase().includes(input.toLowerCase())
        }
        optionLabelProp="label"
      />
    </div>
  </Col>
  <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
    <div style={{ textAlign: 'left' }}>
      <span style={{ padding: '2px' }}>Date</span>
      <div
  style={{
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
        value={selectedDate}
        onChange={(e) => handledatechange(e.target.value)}
        style={{ width: '100%',
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
    
<br></br>
<Tabs defaultActiveKey="1">
    <Tabs.TabPane tab="Home" key="1">
      <div style={{ marginTop: "20px" }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",whiteSpace:'nowrap',
              borderRadius: '5px', }}>
          <thead>
          <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left', borderRadius: '2px' }}>
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
                <th key={header} style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px' }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>

            <td  colSpan={6}>
  
</td>
              
            <td style={{  border: "1px solid #ffffff1a" }} colSpan={3}>
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

    </Tabs.TabPane>
    <Tabs.TabPane tab="Approvals" key="2">
      <div style={{ marginTop: "20px", overflowX: 'auto' }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
              borderRadius: '5px', }}>
          <thead>
          <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left', borderRadius: '2px' }}>
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
                <th key={header} style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px' }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>

            <td  colSpan={10}>
  
</td>
              
            <td style={{  border: "1px solid #ffffff1a" }} colSpan={3}>
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

                <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
  {row.accountingNo}
</td>
<td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
  {row.accountingDate ? formatDate(row.accountingDate) : ''}
</td>
<td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "center" }}>
  <div className="dropdown-container" style={{ position: "relative"}}>
  <Tooltip title="Approve or Reject">
    {row.buyerApprovalStatus==1&&<button
      style={{
        backgroundColor: "transparent", // Fixed from "none" to "transparent"
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        position: "relative", // This ensures the dropdown is positioned relative to this button
        //zIndex: openDropdownId === row.id ? 10 : 1, // Higher z-index for active dropdown
      }}
      onClick={(event) => handleClickAction(row.id)}
    >
      <SettingsIcon />
    </button>}
    </Tooltip>                

    
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
        <ApproveorRejectModal isOpen={isApproveRejectModalOpen} onCancel={closeApproveRejectModal} submitIdRow={submitIdRow}
        approveSubmit={approveSubmit} rejectSubmit={rejectSubmit} />
      </div>
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
    <BuyerQueryModal 
                     BuyerDashboardInput={dashboardinput}
    />
</Tabs.TabPane>

  </Tabs>
  </Card>
      
          
  </div>}
    {loading&&Loading()}
    </div>
  );
};

export default inject("sessionStore")(observer(PayRetroBuyerDashboard));

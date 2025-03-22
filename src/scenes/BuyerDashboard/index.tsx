import * as React from "react";
import supplementarySummariesService from "../../services/SupplementarySummaries/supplementarySummariesService";

import  DashboardCards  from "./components/BuyerDashboardCards";
import { Row, Col,Select, Tabs,Button,Modal,message,Card, Tooltip ,Table} from 'antd';
import { FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import { BuyerDashboardInput } from "./BuyerDashboardInput";
import BuyerQueryModal from "./BuyerQueryModal"
import settingsIcon from "../../images/Setting.svg";
import SessionStore from "../../stores/sessionStore";
import { inject, observer } from "mobx-react"; // Import MobX utilities

import ApproveorRejectModal from "./components/ApproveorRejectModal"

// declare var abp: any;
//const skipCount=0;
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
  const [selectedbuyers, setselectedbuyers] = React.useState({ name: 'Select All', value:0 });
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
    // const [isLoading, setIsLoading] = React.useState(false);
  // const [queryloading, setqueryloading] = React.useState<boolean>(false);
  const [dashboardinput, setdashboardinput] = React.useState<BuyerDashboardInput>({
    Supplierids:[0],
    Buyerid:0,
    Partids:[0],
    DocumentStatusFilter : selectedstatus,
    invoicetype:0,
    Date:null,
    });
  

  React.useEffect(() => {
    

    const fetchData = async () => {
      try {

        const roles = sessionStore?.currentLogin?.user?.roles || [];
        const requiredRoles = ["admin", "PayRetroAdmin","Admin","payretroadmin"];
        const hasRole = roles.some(role => requiredRoles.includes(role));
        setHasRole(hasRole);
        
        const buyers = await supplementarySummariesService.GetLoginBuyer();

          const buyerslist = buyers.data.result ||[]
          // Define the "Select All" option
          const selectAllOption = { id: 0, name: 'Select All' };

          // Add the "Select All" option to the beginning of the buyers list
          buyerslist.unshift(selectAllOption);

          setBuyers(buyerslist || []);

          // console.log(buyers.data.result)
          setselectedbuyers({name:buyers.data.result[0].name,value:buyers.data.result[0].id});
          getsuppliers(buyers.data.result[0].id)
          setselectedcategory(0);
          getparts([],0)

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
        //console.log('buyers',buyers.data.result);
        
      } catch (error) {
        console.error("Error fetching supplementary summaries:", error);
      }
    };

    fetchData();
  }, []);


  
  const handledatechange = async (value:any)=>{
   //console.log('Selected Date',value)
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
      
      //console.log('selectedbuyers',option,value)
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
      //console.log('selectedsuppliers',selectedValues)
  
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
      

      message.success(`${item.document} Approval Mail sent to Accounts`);


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
    };
    const rejectSubmit = async(item: any) => {

        
        message.success(`${item.document} Rejected Mail sent to ${item.suppliername}`);

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
    };
    const getsuppliers =async  (supplybuyers: number) => {
      
      
  
      const suppliers = await supplementarySummariesService.GetAllSupplierListBuyerDashboard(supplybuyers);
          setSuppliers(suppliers.data.result || []);
          // console.log(suppliers.data.result)
          setselectedsuppliers([]);
          
  
        
          
  
    };
  
    const LoadsupplementarySummary=async (buyerdashboardinput:BuyerDashboardInput)=>
    {
  
    var  result = await supplementarySummariesService.BuyerdashboardloadsupplementarySummary(buyerdashboardinput);
      setTableData(result.data.result || []);
      // console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
  
      const carddetails = await supplementarySummariesService.Buyerdashboardcarddetails(buyerdashboardinput);
  
      setrowsupplierstatus(carddetails.data.result.supplierpending.toFixed(2));
      setrowBuyerstatus(carddetails.data.result.buyerpending.toFixed(2));
      setrowAccountsStatus(carddetails.data.result.accountspending.toFixed(2));
  
    // const disput = new DisputedataStore();
      // setqueryloading(true)
     // await disput.buyergetAll(buyerdashboardinput,skipCount);
        
  
  
    }
  
    
  
    const getparts=async  (partsuppliers: any[],partbuyers: number) => {
  
       const parts = await supplementarySummariesService.BuyerDashboardGetAllPartNumbersList(partbuyers,partsuppliers);
           setParts(parts.data.result || []);
           //console.log('parts',parts.data.result) 
           setselectedparts([]);
  
  
    };
  
  
    const handlepartChange =async  (selectedValues: any[]) => {
      
      // //console.log(isModalVisible,currentRowId);
      setselectedparts(selectedValues);
      //console.log('selectedparts',selectedValues)
  
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
          //console.log('selected', selectedValues);
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
      //console.log(`selected ${value}`);
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
    //console.log(` Row ID: ${id}`);
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

// const handleSupplementrypdfButtonClick = async (pdfPath: string) => {
//     try {
        
//         const response = await supplementarySummariesService.GetFile(pdfPath);

//         if (response && response.fileBytes && response.fileType) {
//             // Convert the fileBytes (base64 string) into a data URL
//             const dataUrl = `data:${response.fileType};base64,${response.fileBytes}`;
            
//             // Set the generated data URL to display in the iframe
//             setPdfUrl(dataUrl);
//             setIsModalVisible(true); // Open the modal
//         } else {
//             console.error("Invalid file response:", response);
//         }
//     } catch (error) {
//         console.error("Error fetching the PDF file:", error);
//     }
// };

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
                <p>Buyer Dashboard</p>
              </Row>
            </div>
        <DashboardCards BuyerDashboardinputs={dashboardinput} />

              <Card style={{ backgroundColor:"#fafafa", fontSize: "12px" }}>
        
              <Row gutter={16} style={{ marginRight: '0', display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
              {hasRole ?(
  <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
    <div style={{ textAlign: 'left' }}>
      <span style={{ padding: '2px' }}>Buyers</span>
      <Select
        style={{ width: '100%' }}
        placeholder="Select Buyer"
        options={(() => {
          const buyerOptions = buyers.map((buyer) => ({
            label: buyer.name,
            value: buyer.id,
          }));
          buyerOptions.unshift({ label: 'Select All', value: 0 });
          return buyerOptions;
        })()}
        value={selectedbuyers.value}
        onChange={handlebuyerchange}
        showSearch
        optionLabelProp="label"
        filterOption={(input:any, buyers:any) =>
          buyers?.label.toLowerCase().includes(input.toLowerCase())
        }
      />
    </div>
  </Col>
) : ''}
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
        filterOption={(input:any, buyers:any) =>
          buyers?.label.toLowerCase().includes(input.toLowerCase())
        }
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
        <Card>
          <Row>
            <Col
                        xs={{ span: 14, offset: 0 }}
                        sm={{ span: 15, offset: 0 }}
                        md={{ span: 15, offset: 0 }}
                        lg={{ span: 1, offset: 21 }}
                        xl={{ span: 1, offset: 21 }}
                        xxl={{ span: 1, offset: 21 }}
                      >
                      </Col>
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
    rowKey="id"// Ensure unique key
    scroll={{ x: 'max-content' }}
    columns={[
      { 
        title: 'S.No', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'index', 
        render: (_, __, index) => index + 1, // Index starts from 0, so adding 1
        width: 80 
      },
      { 
        title: 'Part No - Version', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'partno', 
        render: (_, row) => `${row.partno}-${row.partversionNo}`,
        width: 150 
      },
      { title: 'Annexure Group',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'versionNo', width: 120 },

      { title: 'Buyer Name', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'buyerName', width: 200 }, // Fixed duplicate suppliername field
      
       { 
        title: 'Supplier Name', 
        dataIndex: 'suppliername', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        render: (_, row) => `${row.suppliername}-${row.suppliercode}`, 
        width: 150 
      },
      { title: 'From',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'contractFromDate', render: formatDate, width: 120 },
      { title: 'To',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'contractToDate', render: formatDate, width: 120 },
      {
        title: 'Supplier',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        children: [
          {
            title: rowsupplierstatus,
            onHeaderCell: () => ({
              style: {
                backgroundColor: '#005f7f', // Set header background color for this column
                color: '#fff',
              },
            }),
            dataIndex: 'documentStatus',
            className: 'no-border-column',
            render: (_, row) => (
              <div className="progress-tube">
                <div className={supplierstatus(row.documentStatus)} style={{ width: '50px', height: '10px' }}></div>
              </div>
            ),
            width: 100,
          },
        ],
      },
      {
        title: 'Buyer',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        children: [
          {
            title: rowBuyerstatus,
            onHeaderCell: () => ({
              style: {
                backgroundColor: '#005f7f', // Set header background color for this column
                color: '#fff',
              },
            }),
            dataIndex: 'buyerApprovalStatus',
            className: 'no-border-column',
            render: (_, row) => (
              <div className="progress-tube">
                <div className={barstatus(row.buyerApprovalStatus)} style={{ width: '50px', height: '10px' }}></div>
              </div>
            ),
            width: 100,
          },
        ],
      },
      {
        title: 'F&C',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        children: [
          {
            title: rowAccountsStatus,
            onHeaderCell: () => ({
              style: {
                backgroundColor: '#005f7f', // Set header background color for this column
                color: '#fff',
              },
            }),
            dataIndex: 'accountantApprovalStatus',
            className: 'no-border-column',
            render: (_, row) => (
              <div className="progress-tube">
                <div className={barstatus(row.accountantApprovalStatus)} style={{ width: '50px', height: '10px' }}></div>
              </div>
            ),
            width: 100,
          },
        ],
      },
    ]}
    dataSource={tableData}
    className="custom-table"
    pagination={{ pageSize: 10 }}
    bordered
  />
  </Col>
            </Row>
        </Card>
            
</Tabs.TabPane>

<Tabs.TabPane tab="Approvals" key="2">
<Card>
          <Row>
            <Col
                        xs={{ span: 14, offset: 0 }}
                        sm={{ span: 15, offset: 0 }}
                        md={{ span: 15, offset: 0 }}
                        lg={{ span: 1, offset: 21 }}
                        xl={{ span: 1, offset: 21 }}
                        xxl={{ span: 1, offset: 21 }}
                      >
                      </Col>
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
    rowKey={(row) => row.supplementaryInvoiceNo || row.id}
    dataSource={tableData}
    className="custom-table"
    pagination={{ pageSize: 10 }}
    bordered
    scroll={{ x: 'max-content' }}
    columns={[
      { 
        title: 'S.No', 
        dataIndex: 'index', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        render: (_, __, index) => index + 1, 
        width: 60 
      },
      { title: 'Document', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'document', width: 170 },
      { title: 'Document Number',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'supplementaryInvoiceNo', width: 150 },
      { 
        title: 'Date', 
        dataIndex: 'supplementaryInvoiceDate', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        render: (date) => date ? formatDate(date) : '', 
        width: 120 
      },
      { title: 'Value', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'total', width: 120 },
      { title: 'Ageing',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'ageing', width: 100 },
      { 
        title: 'Documents', 
        dataIndex: 'documents',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }), 
        render: (_, row) => (
          <span>
            {row.supplementaryInvoicePath && (
              <Tooltip title="Supplementary Invoice/Credit Note">
                <Button type="link" onClick={() => handleSupplementrypdfButtonClick(row.supplementaryInvoicePath)}>
                  <FilePdfOutlined />
                </Button>
              </Tooltip>
            )}
            {row.annecurePath && (
              <Tooltip title="Annexure">
                <Button type="link" onClick={() => handleAnnexurepdfButtonClick(row.annecurePath)}>
                  <FilePdfOutlined />
                </Button>
              </Tooltip>
            )}
            {row.supplementaryInvoicePath3 && (
              <Tooltip title="Annexure Attachment">
                <Button type="link" onClick={() => downloadFile({ path: row.supplementaryInvoicePath3 })}>
                  <FileExcelOutlined />
                </Button>
              </Tooltip>
            )}
          </span>
        ),
        width: 175
      },
      { title: 'Accounting Number',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'accountingNo', width: 150 },
      { 
        title: 'Accounting Date', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'accountingDate', 
        render: (date) => date ? formatDate(date) : '', 
        width: 120 
      },
      { 
        title: 'Action', 
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        dataIndex: 'action', 
        render: (_, row) => (
          row.buyerApprovalStatus === 1 && (
            <Tooltip title="Approve or Reject">
              <Button type="link" onClick={() => handleClickAction(row.id)}>
                <SettingsIcon />
              </Button>
            </Tooltip>
          )
        ),
        width: 100
      },
      {
        title: 'Supplier',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        children: [
          {
            title: rowsupplierstatus,
            onHeaderCell: () => ({
              style: {
                backgroundColor: '#005f7f', // Set header background color for this column
                color: '#fff',
              },
            }),
            dataIndex: 'documentStatus',
            className: 'no-border-column',
            render: (_, row) => (
              <div className="progress-tube">
                <div className={supplierstatus(row.documentStatus)} style={{ width: '50px', height: '10px' }}></div>
              </div>
            ),
            width: 100,
          },
        ],
      },
      {
        title: 'Buyer',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        children: [
          {
            title: rowBuyerstatus,
            onHeaderCell: () => ({
              style: {
                backgroundColor: '#005f7f', // Set header background color for this column
                color: '#fff',
              },
            }),
            dataIndex: 'buyerApprovalStatus',
            className: 'no-border-column',
            render: (_, row) => (
              <div className="progress-tube">
                <div className={barstatus(row.buyerApprovalStatus)} style={{ width: '50px', height: '10px' }}></div>
              </div>
            ),
            width: 100,
          },
        ],
      },
      {
        title: 'F&C',
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#005f7f', // Set header background color for this column
            color: '#fff',
          },
        }),
        children: [
          {
            title: rowAccountsStatus,
            onHeaderCell: () => ({
              style: {
                backgroundColor: '#005f7f', // Set header background color for this column
                color: '#fff',
              },
            }),
            dataIndex: 'accountantApprovalStatus',
            className: 'no-border-column',
            render: (_, row) => (
              <div className="progress-tube">
                <div className={barstatus(row.accountantApprovalStatus)} style={{ width: '50px', height: '10px' }}></div>
              </div>
            ),
            width: 100,
          },
        ],
      },
    ]}
                          />
          </Col>
        </Row>
        <ApproveorRejectModal isOpen={isApproveRejectModalOpen} onCancel={closeApproveRejectModal} submitIdRow={submitIdRow}
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
      </Card>
    </Tabs.TabPane>
    <Tabs.TabPane tab="Queries" key="3">
    <BuyerQueryModal 
                     BuyerDashboardInput={dashboardinput}
    />
</Tabs.TabPane>

  </Tabs>
  </Card>
      
          
    </div>
  );
};

export default inject("sessionStore")(observer(PayRetroBuyerDashboard));

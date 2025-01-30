import * as React from "react";
import supplementarySummariesService from "../../services/SupplementarySummaries/supplementarySummariesService";

import { Row, Col, Tabs,Card, Input } from 'antd';
//import { keys } from "mobx";
//import settingsIcon from "../../../../images/Setting.svg";
import SessionStore from "../../stores/sessionStore";
import { inject, observer } from "mobx-react"; // Import MobX utilities


declare var abp: any;

  const PayRetroBuyerDashboard:React.FC<{ sessionStore?: SessionStore }> = ({
    sessionStore,
  }) => {
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [procurelogtableData, setprocurelogTableData] = React.useState<any[]>([]);
  const [cbfclogtableData, setcbfclogTableData] = React.useState<any[]>([]);
  const [grnlogtableData, setgrnlogTableData] = React.useState<any[]>([]);
  const [workflowInstancesData, setworkflowIsntancesData] = React.useState<any[]>([]);
  const [selectedparts, setselectedparts] =React.useState<any>(null);
  
  
  const [selectedDate, setSelectedDate] = React.useState("");
  // const [dashboardinput, setdashboardinput] = React.useState<BuyerDashboardInput>({
  //   Supplierids:[0],
  //   Buyerid:0,
  //   Partids:[0],
  //   DocumentStatusFilter:null,
  //   invoicetype:0,
  //   Date:null,
  //   });

  var userid='0';
  
  

  React.useEffect(() => {
    

    const fetchData = async () => {
      try {

        
       
        

        const buyers = await supplementarySummariesService.GetLoginBuyer(userid);
        //setBuyers(buyers.data.result || []);
        if(abp.session.userId===1||abp.session.userId===2)
        {
          
         // setBuyers(buyers.data.result || []);
         await Promise.all([
          LoadsupplementarySummary(selectedDate),
          procurelogSummary(selectedDate),
          cbfclogSummary(selectedDate),
          grnlogSummary(selectedDate),
          workflowIsntances(selectedparts),
        ]);
                
         
         
        }
        else{

         // setBuyers(buyers.data.result || []);


          await Promise.all([
            LoadsupplementarySummary(selectedDate),
            procurelogSummary(selectedDate),
            cbfclogSummary(selectedDate),
            grnlogSummary(selectedDate),
            workflowIsntances(selectedparts),
          ]);

      
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

    const dateObject =value && value.trim() !== "" ? value : null;

    

    setSelectedDate(dateObject);
    await Promise.all([
      LoadsupplementarySummary(dateObject),
      procurelogSummary(dateObject),
      cbfclogSummary(dateObject),
      grnlogSummary(dateObject),
      workflowIsntances(selectedparts),
    ]);
      
      


  };

  const handleCorelationChange =async  (selectedValues: any) => {
      
      setselectedparts(selectedValues);
      console.log('selectedparts',selectedValues)
  
      
      await Promise.all([
        
        workflowIsntances(selectedValues),
      ]);
    };

   
  
    const LoadsupplementarySummary=async (ReportDate :any)=>
    {
  
    var  result = await supplementarySummariesService.GetSyncData(ReportDate);
      setTableData(result || []);
     // console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
                    
    }


    const procurelogSummary=async (ReportDate : any)=>
      {
    
      var  result = await supplementarySummariesService.GetProcurLogData(ReportDate);
        setprocurelogTableData(result || []);
       // console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
                      
      }

      const cbfclogSummary=async (ReportDate : any)=>
        {
      
        var  result = await supplementarySummariesService.GetCBFCLogData(ReportDate);
        setcbfclogTableData(result || []);
        //  console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
                        
        }

        const grnlogSummary=async (ReportDate : any)=>
          {
        
          var  result = await supplementarySummariesService.GetGRNLogData(ReportDate);
          setgrnlogTableData(result || []);
           // console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
                          
          }

          const workflowIsntances=async (correlationId : any)=>
            {
          
            var  result = await supplementarySummariesService.workflowIsntances(correlationId);
            setworkflowIsntancesData(result || []);
                            
            }
    
           
  
    
    
             

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
    //  setOpenDropdownId(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  

  
  
  
  


function workflowStatus(status : any) 
{
    switch(status){
      case 1:
        return 'Suspended';
      case 2:
        return 'Finished';
      case 3:
        return 'Faulted';
      case 4:
        return 'Cancelled';
      case 5:
        return 'Idle';  
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
                <p>BackGroundJobs Dashboard</p>
              </Row>
            </div>

              <Card style={{ backgroundColor:"#fafafa", fontSize: "12px" }}>
        
              <Row gutter={16} style={{ marginRight: '0', display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
              
      
  <Col className="gutter-row" span={4} style={{ flex: '1', maxWidth: '250px' }}>
    <div style={{ textAlign: 'left' }}>
      <span style={{ padding: '2px' }}>Date</span>
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
    <Tabs.TabPane tab="Sync Data" key="1">
      <div style={{ marginTop: "20px" }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",whiteSpace:'nowrap',
              borderRadius: '5px', }}>
          <thead>
          <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left', borderRadius: '2px' }}>
          {[
                "S.No",            
                "ReportDate",
                "Status",
                "PartsCount",
                "CreationTime",
                "LastModificationTime",
                
              ].map((header) => (
                <th key={header} style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px' }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>

            <td  colSpan={6}></td>
              
                        </tr>
          </thead>
          <tbody>
            {tableData.map((row,index) => (
              <tr>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{index+1}</td>                
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.reportDate}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.status}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.partsCount}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.creationTime }</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.lastModificationTime}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Tabs.TabPane>
    <Tabs.TabPane tab="Import Procure Log" key="2">
      <div style={{ marginTop: "20px", overflowX: 'auto' }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
              borderRadius: '5px', }}>
          <thead>
          <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left', borderRadius: '2px' }}>
          {[
                 "S.No",
                "File Name",
                "Status",
                "Creation Time",
                "Last Modification Time",
                
              ].map((header) => (
                <th key={header} style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px' }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>

            <td  colSpan={10}>
  
</td>
              
           
            </tr>
          </thead>
          <tbody>
            {procurelogtableData.map((row,index) => (
              <tr
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index+1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.filename}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.status}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.creationTime?row.creationTime:''}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.lastModificationTime?row.lastModificationTime:''}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>

</Tabs.TabPane>
<Tabs.TabPane tab="Import CBFC Log" key="3">
      <div style={{ marginTop: "20px", overflowX: 'auto' }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
              borderRadius: '5px', }}>
          <thead>
          <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left', borderRadius: '2px' }}>
          {[
                "S.No",
                "File Name",
                "Status",
                "Creation Time",
                "Last Modification Time",
                
              ].map((header) => (
                <th key={header} style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px' }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>

            <td  colSpan={10}>
  
</td>
              
           
            </tr>
          </thead>
          <tbody>
            {cbfclogtableData.map((row,index) => (
              <tr
              >
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{index+1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.filename}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.status}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.creationTime?row.creationTime:''}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.lastModificationTime?row.lastModificationTime:''}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>

</Tabs.TabPane>

<Tabs.TabPane tab="Import GRN Log" key="4">
      <div style={{ marginTop: "20px", overflowX: 'auto' }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
              borderRadius: '5px', }}>
          <thead>
          <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'left', borderRadius: '2px' }}>
          {[
                "S.No",
                "File Name",
                "Status",
                "Creation Time",
                "Last Modification Time",
                
              ].map((header) => (
                <th key={header} style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px' }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>

            <td  colSpan={10}>
  
</td>
              
           
            </tr>
          </thead>
          <tbody>
            {grnlogtableData.map((row,index) => (
              <tr
              >
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{index+1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.filename}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.status}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.creationTime?row.creationTime:''}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.lastModificationTime?row.lastModificationTime:''}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>

</Tabs.TabPane>

<Tabs.TabPane tab="Work Flow Instances" key="5">

<Col className="gutter-row" span={5}>
    <div style={{ textAlign: 'left' }}>
      <span style={{ padding: "2px" }}>Correlation Id</span>
      <Input
        type="text"
        style={{ width: '200px' }}
        value={selectedparts}
        onChange={(e) => handleCorelationChange(e.target.value)} // Fixed function call
        
      />
    </div>
  </Col>
      <div style={{ marginTop: "20px", overflowX: 'auto' }}>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
              borderRadius: '5px', }}>
          <thead>
          <tr style={{ backgroundColor: '#005f7f', color: '#fff', textAlign: 'center', borderRadius: '2px' }}>
          {[
                "S.No",
                "WorkFlow Name",
                "Corelation Id",
                "WorkFlow Status",
                "Created At",
                "Finished At",
                "Faulted At",
                "Cancelled At",
                
              ].map((header) => (
                <th key={header} style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px' }}>
                  {header}
                </th>
              ))}
            </tr>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>

            <td  colSpan={10}>
  
</td>
              
           
            </tr>
          </thead>
          <tbody>
            {workflowInstancesData.map((row,index) => (
              <tr
              >
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{index+1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.workFlowName}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.correlationId}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{workflowStatus(row.workflowStatus)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.createdAt}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.lastExecutedAt}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.finishedAt}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.faultedAt}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>

</Tabs.TabPane>
  </Tabs>
  </Card>
      
          
    </div>
  );
  
};

export default inject("sessionStore")(observer(PayRetroBuyerDashboard));

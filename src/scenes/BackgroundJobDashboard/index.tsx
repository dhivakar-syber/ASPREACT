import * as React from "react";
import supplementarySummariesService from "../../services/SupplementarySummaries/supplementarySummariesService";

import { Row, Col, Tabs,Card } from 'antd';
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
  
  const [selectedDate, setSelectedDate] = React.useState("");
  
  
  

  React.useEffect(() => {
    

    const fetchData = async () => {
      try {
                   
        if(abp.session.userId===1||abp.session.userId===2)
        {
          
         // setBuyers(buyers.data.result || []);
         await Promise.all([
          LoadsupplementarySummary(selectedDate),
          procurelogSummary(selectedDate),
          cbfclogSummary(selectedDate),
          grnlogSummary(selectedDate),
        ]);
                
         
         
        }
        else{

         // setBuyers(buyers.data.result || []);

          
      
          await Promise.all([
            LoadsupplementarySummary(selectedDate),
            procurelogSummary(selectedDate),
            cbfclogSummary(selectedDate),
            grnlogSummary(selectedDate),
          ]);

      
        }
        
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

    

    await Promise.all([
      LoadsupplementarySummary(dateObject),
      procurelogSummary(dateObject),
      cbfclogSummary(dateObject),
      grnlogSummary(dateObject),
    ]);
      
      


  };

   
  
    const LoadsupplementarySummary=async (selectedDate : any)=>
    {
  
    var  result = await supplementarySummariesService.GetSyncData(selectedDate);
      setTableData(result || []);
     // console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
                    
    }


    const procurelogSummary=async (selectedDate : any)=>
      {
    
      var  result = await supplementarySummariesService.GetProcurLogData(selectedDate);
        setprocurelogTableData(result || []);
       // console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
                      
      }

      const cbfclogSummary=async (selectedDate:any)=>
        {
      
        var  result = await supplementarySummariesService.GetCBFCLogData(selectedDate);
        setcbfclogTableData(result || []);
        //  console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
                        
        }

        const grnlogSummary=async (selectedDate : any)=>
          {
        
          var  result = await supplementarySummariesService.GetGRNLogData(selectedDate);
          setgrnlogTableData(result || []);
           // console.log("BuyerDashboard_Supplementary_top_table", result.data.result);
                          
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

  

  
  
  
//   function formatDate(d:string) {
//     const date = new Date(d);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); 
//     const day = String(date.getDate()).padStart(2, '0'); 

//     return `${day}-${month}-${year}`; 
// }



  



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
                <td style={{ padding: "10px", border: "1px solid #ddd",textAlign:"center" }}>{row.creationTime}</td>
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

  </Tabs>
  </Card>
      
          
    </div>
  );
};

export default inject("sessionStore")(observer(PayRetroBuyerDashboard));

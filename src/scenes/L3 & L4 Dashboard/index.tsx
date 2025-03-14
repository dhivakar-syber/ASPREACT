import React from "react";
import { Row, Col,Select, Tabs, Table, Card } from 'antd';
// import  DashboardCards  from "../Dashboard/components/PayRetroSupplierDashboard/DashboardCards";
import { l4dashboardinput } from "../L3 & L4 Dashboard/l4dashboardinput";
import supplementarySummariesService from "../../services/SupplementarySummaries/supplementarySummariesService";
import AnalysisDonutChart from "./DonutChart";
import AnalysisBarChart from "./BarChart";
import AnalysisCreditNoteBarChart from "./CreditNoteBarChart";
import AnalysisCreditNoteDonutChart from "./CreditNoteDonutChart";
import AnalysisPieChart from "./PieChart";
import AnalysisCreditNotePieChart from "./CreditNotePieChart";
//../../../../../../PayRetroSupplierDashboard/DashboardCards
//declare var abp: any;

const L4dashboard: React.FC = () => {

const [TableData, setTableData] =React.useState<any[]>([]); 
const [teams, setteams] =React.useState<any[]>([]);  
const [selectedteams, setselectedteams] =React.useState<any[]>([]);  
const [buyers, setBuyers] =React.useState<any[]>([]);
const [selectedbuyers, setselectedbuyers] =React.useState<any[]>([]);
const [suppliers, setSuppliers] =React.useState<any[]>([]);
const [selectedsuppliers, setselectedsuppliers] = React.useState<any[]>([]);
const [selectedcategory, setselectedcategory] =React.useState<any>(String);
// const [dashboardinput, setdashboardinput] = React.useState<l4dashboardinput>({
//   Teams: [],   
//   Buyerids: [],
//   Supplierids: [], 
//   invoicetype: 0
// });


    React.useEffect(() => {
    
        
    
         
      
        const fetchData = async () => {
    
          
          try {
    
            
            const Teams = await supplementarySummariesService.GetAllTeams();
            setteams(Teams.data.result || []);
            setselectedteams([]);

            const Buyers = await supplementarySummariesService.GetAllBuyersforL4Dashboard([]);
                        //console.log('buyers',Buyers)
                        setBuyers(Buyers.data.result || []);
                       // setselectedbuyers([]);


    
            const suppliers = await supplementarySummariesService.GetAllSuppliersaccountsdashboard([]);
            //console.log('suppliers',suppliers)
            
            setSuppliers(suppliers.data.result || []);
           // setselectedsuppliers([]);
            setselectedcategory(0);
              
    
              var l4dashboardinput: l4dashboardinput = {
                Teams:[],
                Supplierids: [],
                Buyerids: [],
                invoicetype:0
              };
    
              //setdashboardinput(l4dashboardinput);
    
              await LoadsupplementarySummary(l4dashboardinput);
            
            
          } catch (error) {
            console.error("Error fetching supplementary summaries:", error);
          }
        };
    
        fetchData();
      }, []);

      const handleteamchange =async  (selectedValues: any[]) => {
              
        setselectedteams(selectedValues);
        //console.log('selectedteams',selectedValues)
    
        

        getbuyers(selectedValues)
    
        var   l4dashboardinput: l4dashboardinput = {
          Supplierids: [],
          Buyerids: [],
          Teams:selectedValues,
          invoicetype:selectedcategory,
        
        };
        //setdashboardinput(l4dashboardinput);
        await LoadsupplementarySummary(l4dashboardinput);
      };


      const handlebuyerChange =async  (selectedValues: any[]) => {
              
              setselectedbuyers(selectedValues);
              //console.log('selectedbuyers',selectedValues)
          
              
      
              getsuppliers(selectedValues)
          
              var   l4dashboardinput: l4dashboardinput = {
                Supplierids: selectedsuppliers,
                Buyerids: selectedValues,
                Teams:selectedteams,
                invoicetype:selectedcategory,
              
              };
              //setdashboardinput(l4dashboardinput);
              await LoadsupplementarySummary(l4dashboardinput);
            };


      const handlesupplierchange =async  (selectedValues: any[]) => {
              
              setselectedsuppliers(selectedValues);
              //console.log('selectedsuppliers',selectedValues)
            var   l4dashboardinput: l4dashboardinput = {
                Supplierids: selectedValues,
                Buyerids: selectedbuyers,
                Teams:selectedteams,
                invoicetype:selectedcategory,
              
              };
              //setdashboardinput(l4dashboardinput);
              await LoadsupplementarySummary(l4dashboardinput);
            };
               
            
            
      const getsuppliers =async  (supplybuyers: any[]) => {
                
                const suppliers = await supplementarySummariesService.GetAllSuppliersaccountsdashboard(supplybuyers);
                    setSuppliers(suppliers.data.result || []);
                    setselectedsuppliers([]);
              };   
              
              const getbuyers =async  (teams: any[]) => {
                
                const buyers = await supplementarySummariesService.GetAllBuyersforL4Dashboard(teams);
                    setBuyers(buyers.data.result || []);
                    setselectedbuyers([0]);
              };       

              const handlecategorychange = async(selectedValues: number) => {
                    //console.log('selected', selectedValues);
                    setselectedcategory(selectedValues);
                
                    var   l4dashboardinput: l4dashboardinput = {
                      Supplierids: selectedsuppliers,
                      Buyerids: selectedbuyers,
                      Teams: selectedteams,
                      invoicetype:selectedValues,
                      
                    };
                   // setdashboardinput(l4dashboardinput);
                    await LoadsupplementarySummary(l4dashboardinput);
                    
                  };
      const LoadsupplementarySummary=async (l4dashboardinput:l4dashboardinput)=>
        {
      
        var  result = await supplementarySummariesService.loadl4supplementarySummary(l4dashboardinput);
          setTableData(result.data.result || []);
          //console.log("l3Dashboard_top_table", result.data.result);
      
          //const carddetails = await supplementarySummariesService.carddetails(supplierDashboardInput);
      
          //setrowsupplierstatus(carddetails.data.result.supplierpending.toFixed(2));
          //setrowBuyerstatus(carddetails.data.result.buyerpending.toFixed(2));
          //setrowAccountsStatus(carddetails.data.result.accountspending.toFixed(2));
      
          
      
      
      
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
                      <p>L3 & L4 Dashboard</p>
                    </Row>
                  </div>
        {/* <DashboardCards SupplierDashboardInputs={dashboardinput} /> */}
        <Row gutter={16}>
          
        </Row>
        <Card style={{ backgroundColor:"#fafafa", fontSize: "12px" }}>
        <Row gutter={11} style={{ marginRight: '-200.5px' }}>
        <Col className="gutter-row" span={5}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{padding: "2px"}}>Teams</span>
                      <Select
                        mode="multiple"
                        style={{ width: '200px' }}
                        placeholder="Select one or more Teams"
                        options={teams.map((team) => ({
                          label: team.name,
                          value: team.value,
                        }))}
                        value={selectedteams}
                        //value={[]}
                        onChange={handleteamchange}
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
                      <span style={{padding: "2px"}}>Suppliers</span>
                      <Select
                        style={{ width: '200px' }}
                        mode="multiple"
                        placeholder="Select suppliers"
                        options={suppliers.map((supplier) => ({
                          label: supplier.name,
                          value: supplier.value,
                        }))}
                        value={selectedsuppliers}
                        
                        onChange={handlesupplierchange}
                        optionLabelProp="label"
                        filterOption={(input: any, suppliers: any) =>
                          suppliers?.label.toLowerCase().includes(input.toLowerCase())
                        }
                      />
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
                 
                </Row>
                </Card>
                <Card>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Summary" key="1">
                  <Tabs>
       <Tabs.TabPane tab="SupplementaryInvoice" key="1">
       <div
    style={{
      display: 'flex', // To display elements side by side
       justifyContent: 'center', // Space between the charts
      gap: '10px', // Reduced gap between charts
    }}
  >
    <div style={{ width: '500px', height: '400px' }}>
      <AnalysisDonutChart supplementaryDocStatus={TableData} />
    </div>
    <div style={{ height: '500px' }}>
      <AnalysisPieChart supplementaryDocStatus={TableData} />
    </div>

  </div>

    <div style={{ flex: 1, height: '500px' }}>
      <AnalysisBarChart supplementaryDocStatus={TableData} />
    </div>
      </Tabs.TabPane>

      <Tabs.TabPane tab="Credit Note" key="2">
      <div
    style={{
      display: 'flex', // To display elements side by side
       justifyContent: 'center', // Space between the charts
      gap: '10px', // Reduced gap between charts
    }}
  >
    <div style={{ flex: 'none', width: '500px', height: '400px' }}>
      <AnalysisCreditNoteDonutChart supplementaryDocStatus={TableData} />
    </div>

    <div style={{ height: '500px' }}>
      <AnalysisCreditNotePieChart supplementaryDocStatus={TableData} />
    </div>
  </div>
  <div style={{ flex: 1, height: '500px' }}>
      <AnalysisCreditNoteBarChart supplementaryDocStatus={TableData} />
    </div>
      </Tabs.TabPane>

    </Tabs>

                  </Tabs.TabPane>
  <Tabs.TabPane tab="Home" key="2">
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
  rowKey="id"
  columns = {[
      {
        title: "S.No",
        dataIndex: "serialNo",
        key: "serialNo",
        render: (_, __, index) => index + 1,
        width: 70,
      },
      {
        title: "Team",
        dataIndex: "team",
        key: "team",
        width: 120,
      },
      {
        title: "Buyer",
        dataIndex: "buyer",
        key: "buyer",
        width: 120,
      },
      {
        title: "Supplier Name",
        dataIndex: "supplierName",
        key: "supplierName",
        width: 200,
      },
      {
        title: "Supplier Code",
        dataIndex: "suppliercode",
        key: "suppliercode",
        width: 120,
      },
      {
        title: 'Value',
        children: [
          {
            title: (<div  style={{  width: "50px",textAlign:"center" ,fontWeight: 'bold'}}>{(TableData.reduce((acc, row) => acc + (row.value || 0), 0) / 10000000).toFixed(2)} Cr</div>
          ),
            dataIndex: 'value',
            
            render: (_, row) => (
              row.value
            ),
            width: 100,
          },
        ],
      },
      {
        title: 'Supplier',
        children: [
          {
            title: (<div  style={{  width: "50px",textAlign:"right",fontWeight: 'bold' }}>{(TableData.reduce((acc, row) => acc + (row.supplierPendingValue || 0), 0) / 10000000).toFixed(2)} Cr</div>
          ),
            dataIndex: 'supplierPendingValue',
            render: (_, row) => (
              row.supplierPendingValue
            ),
            width: 100,
          },
        ],
      },
      {
        title: 'Buyer',
        children: [
          {
            title: (<div  style={{ width: "50px",textAlign:"right",fontWeight: 'bold' }}>{(TableData.reduce((acc, row) => acc + (row.buyerPendingValue || 0), 0) / 10000000).toFixed(2)} Cr</div>
          ),
            dataIndex: 'buyerPendingValue',
            render: (_, row) => (
              row.buyerPendingValue
            ),
            width: 100,
          },
        ],
      },
      {
        title: 'F&C',
        children: [
          {
            title: (<div  style={{ width: "50px",textAlign:"right" ,fontWeight: 'bold'}}>{(TableData.reduce((acc, row) => acc + (row.fandCPendingValue || 0), 0) / 10000000).toFixed(2)} Cr</div>
          ),
            dataIndex: 'accountantApprovalStatus',
            render: (_, row) => (
              row.fandCPendingValue
            ),
            width: 100,
          },
        ],
      },


  ]}
  dataSource={TableData}
    className="custom-ant-table"
    pagination={{ pageSize: 10 }}
    scroll={{ x: 'max-content' }}
    bordered
  />
  </Col>
  </Row>
  </Card>
 
</Tabs.TabPane>
                </Tabs>
                </Card>
    </div>
  );
};

export default L4dashboard;

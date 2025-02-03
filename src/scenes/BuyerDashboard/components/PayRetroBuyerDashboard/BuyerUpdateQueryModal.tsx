import React, { useState } from 'react';
import { Form, Input, Modal, Col, Row, Button,message, Tooltip  } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../../lib/abpUtility';
import DisputesStrore from '../../../../stores/DisputesStrore';
import supplementarySummariesService from '../../../../services/SupplementarySummaries/supplementarySummariesService';
import SupplierModalView from './supplierModalView';

export interface ICreateOrUpdateDahBoardDisputesDataProps {
  visible: boolean;
  modalType: string;
  onCreate: (item: any) => void;
  onsubmit: (item: any) => void;
  onclose: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  disputesStrore: DisputesStrore;
}

const CreateOrUpdateDahBoardDisputedata: React.FC<ICreateOrUpdateDahBoardDisputesDataProps> = ({
  visible,
  onCreate,
  onsubmit,
  onclose,
  formRef,
  initialData,
}) => {
    // const [tableData, setTableData] = React.useState<any[]>([]);
    // const [ setTableData] = React.useState<any[]>([]);
    const [actionType, setActionType] = useState<'forward' | 'close' | null>(null);
    const [annexuremodalData, annexuresetModalData] = React.useState<any[]>([]);
    const [modalData, setModalData] = React.useState<any[]>([]);
    const [supplementaryData, setSupplementaryData] = React.useState<any[]>([]);
    // const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);
    const [ selectedRow,setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
    // const [ setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false); // To control modal visibility
    // const [rowsupplierstatus, setrowsupplierstatus] = React.useState<number | null>(0); 
    // const [rowBuyerstatus, setrowBuyerstatus] = React.useState<number | null>(0); 
    // const [rowAccountsStatus, setrowAccountsStatus] = React.useState<number | null>(0);
    // const [ setrowsupplierstatus] = React.useState<number | null>(0); 
    // const [ setrowBuyerstatus] = React.useState<number | null>(0); 
    // const [ setrowAccountsStatus] = React.useState<number | null>(0);
  // console.log(selectedRow);

      // const [dashboardinput, setdashboardinput] = React.useState<SupplierDashboardInput>({
      //   Supplierid: 0,
      //   Buyerids: [0],
      //   Partids: [0],
      //   invoicetype:0
      // });
      // const [dashboardinput] = React.useState<SupplierDashboardInput>({
      //   Supplierid: 0,
      //   Buyerids: [0],
      //   Partids: [0],
      //   invoicetype:0
      // });
      console.log(selectedRow)
      console.log(isModalOpen)
      
      // console.log(setHoveredRowId)

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return 'Open';
      case 1:
        return 'Forwarded To FandC';
      case 2:
        return 'Close';
      case 3:
        return 'Inimated To Buyer';
      default:
        return 'Unknown';
    }
  };

    // const LoadsupplementarySummary=async (supplierDashboardInput:SupplierDashboardInput)=>
    // {
  
    // var  result = await supplementarySummariesService.loadsupplementarySummary(supplierDashboardInput);
    //   setTableData(result.data.result || []);
    //   console.log("Supplementary_top_table", result.data.result);
  
    //   const carddetails = await supplementarySummariesService.carddetails(supplierDashboardInput);
  
    //   setrowsupplierstatus(carddetails.data.result.supplierpending.toFixed(2));
    //   setrowBuyerstatus(carddetails.data.result.buyerpending.toFixed(2));
    //   setrowAccountsStatus(carddetails.data.result.accountspending.toFixed(2));

    // }

  //   function formatDate(d:Date) {
  //     const date = new Date(d);
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, '0'); 
  //     const day = String(date.getDate()).padStart(2, '0'); 
  
  //     return `${day}-${month}-${year}`; 
  //  }
    const handleRowClick = async (row: number) => {
      // if ((e.target as HTMLElement).tagName !== 'INPUT') {
      setSelectedRow(row); // Set the clicked row data
      setIsModalOpen(true); // Open the modal

      try {
        const result = await supplementarySummariesService.GetAllsupplementarySummarybyId(row); // Await the Promise
        console.log('ImplementationDateChange',result[0]);
        setSupplementaryData([]);
        setSupplementaryData(result[0]);
        // console.log('SupplementaryData',result) // Assuming the result contains the data in 'data' field
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const result = await supplementarySummariesService.grndata(row); // Await the Promise
        setModalData(result);
        console.log('setmodaldata',result) // Assuming the result contains the data in 'data' field
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const annexureresult = await supplementarySummariesService.annexuredata(row); // Await the Promise
        annexuresetModalData(annexureresult);
        console.log('annexuresetmodaldata',annexureresult) // Assuming the result contains the data in 'data' field
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    // } 
  };
  //const { Item } = Form;

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedRow(null);  // Clear the selected row data
  };

  //const disputestores = new DisputesStore;

  // const handleRaiseQueryAction = (actionName: string, entityId: number) => {
    
  //   disputestores.createDisputeData();
  // }

  // const Suppliermodalview = (selectedRow: any) => {
  //   const handleInsideClick = (e: React.MouseEvent) => {
  //     // Prevent modal from closing when clicking inside the modal
  //     e.stopPropagation();
  //   };
   
  //   return (
  //     <Modal
  //       visible={isModalOpen}
        
  //       title="Contract Details"
  //       onCancel={handleModalClose}
  //       footer={[
  //         <Button key="close" onClick={handleModalClose}>
  //           Close
  //         </Button>,
  //       ]}
  //       centered
  //       width="80%"
  //       bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
  //       maskClosable={true}  // This ensures it will close when clicking outside
  //     >
  //     console.log(isModalOpen)
  //       <div onClick={handleInsideClick}> {/* Prevent close on inside click */}
  //         <Row gutter={[14, 10]}>
  //           {/* Column 1 */}
  //           <Col span={6}>
  //             <div>
  //               <Row gutter={[14, 10]}>
  //                 <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
  //                   <p>Part Number</p>
  //                   <p>Description</p>
  //                   <p>Buyer Name</p>
  //                   <p>Supplier Code</p>
  //                   <p>Supplier Name</p>
  //                 </Col>
  //                 <Col span={12} style={{ fontSize: '12px' }}>
  //                   <p><span>: {selectedRow?.partno}</span></p>
  //                   <p><span>: {selectedRow?.partdescription}</span></p>
  //                   <p><span>: {selectedRow?.buyerName}</span></p>
  //                   <p><span>: {selectedRow?.suppliercode}</span></p>
  //                   <p><span>: {selectedRow?.suppliername}</span></p>
  //                 </Col>
  //               </Row>
  //             </div>
  //           </Col>
  
  //           {/* Column 2 */}
  //           <Col span={6}>
  //             <div>
  //               <Row gutter={[14, 10]}>
  //                 <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
  //                   <p>Valid From</p>
  //                   <p>Valid To</p>
  //                   <p>Contract No</p>
  //                   <p>Released Date</p>
  //                   <p>Plant</p>
  //                 </Col>
  //                 <Col span={12} style={{ fontSize: '12px' }}>
  //                   <p><span>: {formatDate(selectedRow?.contractFromDate)}</span></p>
  //                   <p><span>: {formatDate(selectedRow?.contractToDate)}</span></p>
  //                   <p><span>: {selectedRow?.contractNo}</span></p>
  //                   <p><span>: {formatDate(selectedRow?.approvalDate)}</span></p>
  //                   <p><span>: {selectedRow?.plantCode}</span></p>
  //                 </Col>
  //               </Row>
  //             </div>
  //           </Col>
  
  //           {/* Column 3 */}
  //           <Col span={6}>
  //             <div>
  //               <Row gutter={[14, 10]}>
  //                 <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
  //                   <p>Old Value</p>
  //                   <p>New Value</p>
  //                   <p>Delta</p>
  //                   <p>Qty</p>
  //                   <p>Total</p>
  //                 </Col>
  //                 <Col span={12} style={{ fontSize: '12px' }}>
  //                   <p><span>: {selectedRow?.oldValue}</span></p>
  //                   <p><span>: {selectedRow?.newValue}</span></p>
  //                   <p><span>: {selectedRow?.delta}</span></p>
  //                   <p><span>: {selectedRow?.grnQty}</span></p>
  //                   <p><span>: {selectedRow?.total}</span></p>
  //                 </Col>
  //               </Row>
  //             </div>
  //           </Col>
  
  //           {/* Column 4 */}
  //           <Col span={6}>
  //             <div>
  //               <Row gutter={[14, 10]}>
  //                 <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
  //                   <p>Accounted Price</p>
  //                   <p>Accounted Value</p>
  //                   <p>Version No</p>
  //                   <p>Implementation Date</p>
  //                   <p>Change</p>
  //                 </Col>
  //                 <Col span={12} style={{ fontSize: '12px' }}>
  //                   <p><span>: {selectedRow?.accoutedPrice}</span></p>
  //                   <p><span>: {selectedRow?.accountedValue}</span></p>
  //                   <p><span>: {selectedRow?.versionNo}</span></p>
  //                   {/* <p><span>: {formatDate(selectedRow.implementationDate)}</span></p> */}
                   
  //                 </Col>
  //               </Row>
  //             </div>
  //           </Col>
  //         </Row>
  
  //         <InvoiceTable data={modalData} />
  //         <AnnexureTable data={annexuremodalData} />
  //       </div>
  //     </Modal>
  //   );
  // };
    

  // const loadgrndata = (supplementaryid: number) => {
  //   const result =  supplementarySummariesService.grndata(supplementaryid);
  //   InvoiceTable(result);
  //   console.log('grndata-',result)
  // };
  


  // const AnnexureTable = ({ data }: { data: any[] }) => {
  //   console.log('AnnexureTable',data);
  //   return (
  //     <div >
  //       <br></br>
  //       <h3>Annexure Details</h3>
  //       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

  // </div>
  //       <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
  //             borderRadius: '5px' }}>
  //         <thead>
  //         <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left", borderRadius: '2px' }}>
          
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>S.No</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Annexure Group</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Part No</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Invoice No</th>
  //           <th style={{width:"120px",padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>InvoiceDate</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Old Contract</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>New Contract</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Price(CBFC)</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Diff Value</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Qty</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Total</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Currency</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Supp.Inv.No/Credit Note</th>
  //           <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Supp.Inv.Date/Credit Note Date</th>
  //         </tr>
            
  //         </thead>
  //         <tbody >
  //           {data && data.length > 0 ? (
  //             data.map((item:any, index:any) => (
  //               <tr key={index} 
  //               style={{
  //                 backgroundColor:
  //                 index % 2 === 0 ? '#f9f9f9' : '#fff',
  //               }}>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.versionNo}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.partno}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.invoiceNo}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.invoiceDate)}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.oldValue}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.newValue}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}></td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.diffValue}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.qty}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.total}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.currency}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplementaryInvoiceNo}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.supplementaryInvoiceDate)}</td>
  //               </tr>
  //             ))
  //           ):''}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // };

  // const InvoiceTable = ({ data }: { data: any[] }) => {
  //   console.log('invoiceTable',data);
  //   return (
  //     <div >
  //       <h3>CBFC Information</h3>
  //       <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
  //             borderRadius: '5px' }}>
  //         <thead>
  //         <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" , borderRadius: '2px'}}>
  //             <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>S.no</th>
  //             <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>PartNo</th>
  //             <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Invoice No</th>
  //             <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>InvoiceDate</th>
  //             <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Qty</th>
  //             <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Price (GRN)</th>
  //             <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Price (CBFC)</th>
  //             <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Amount (CBFC)</th>
  //           </tr>
  //         </thead>
  //         <tbody >
  //           {data && data.length > 0 ? (
  //             data.map((item:any, index:any) => (
  //               <tr key={index} style={{
  //                 backgroundColor:
  //                 index % 2 === 0 ? '#f9f9f9' : '#fff',
  //               }}>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.partNo}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.invoiceNo}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.invoicedate)}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.quantity}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
  //                 <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
  //               </tr>
  //             ))
  //           ):''}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // };

 

 

  return (
    <Modal
      visible={visible}
      onCancel={onclose}
      title={L('Disputes')}
      width={550}
      footer={[
                // Add a "View Contract Details" button in the footer.
                <Tooltip title="Click here to view the contract details" key="view-details">
                <Button
                  key="viewDetails"
                  type="default"
                  onClick={() => {
                    // Call your function to load contract details using the supplementary summary id
                    handleRowClick(initialData.supplementarySummaryId);
                  }}
                >
                  View Contract Details
                </Button>
              </Tooltip>,
        initialData?.status !== 3 && (  // Button will show only when status is not 3
          <Button
            key="forward"
            type="primary"
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure? You want to forward the Query to F&C?',
                onOk: async () => {
                  try {
                    setActionType('forward');// Set action type before submitting
                     await formRef.current?.submit(); // This triggers the form's onFinish
                    message.success('Query Forwarded to F&C');
                  } catch (error) {
                    console.error('Error when forwarding query:', error);
                    message.error('Failed to Forward the query to F&C');
                  }
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
          Forward to F&C
        </Button>
        ),
<Button
  key="close"
  type="primary"
  onClick={() => {
    Modal.confirm({
      title: 'Are you sure? You want to close the Query?',
      onOk: async () => {
        try {
          setActionType('close'); // Set action type before submitting
          await formRef.current?.submit(); // Ensure submission is awaited if needed
          message.success('Query Closed');
        } catch (error) {
          console.error('Error when closing query:', error);
          message.error('Failed to close the query');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }}
>
  Close
</Button>
      ]}
    >
      <Form
        ref={formRef}
        initialValues={initialData}
        onFinish={(values) => {
          if (actionType === 'forward') {
            onCreate(values); // Handle Forward to F&C
          } else if (actionType === 'close') {
            onsubmit(values); // Handle Close
          }
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={L('SupplierName')} name="supplierName" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <Input disabled value={initialData ? initialData.supplierName : ''} style={{ color: 'black' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={L('BuyerName')} name="buyerName" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <Input disabled value={initialData.buyerName || ''} style={{ color: 'black' }} />
            </Form.Item>
          </Col>
        </Row>
  
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={L('Pre-Defined Query')} name="supplierRejection" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <Input disabled value={initialData.supplierRejection || ''} style={{ color: 'black' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={L('Additional Query')} name="query" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <Input disabled value={initialData.query || ''} style={{ color: 'black' }} />
            </Form.Item>
          </Col>
        </Row>
  
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item label={L('Status')} name="status" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <Input disabled value={getStatusLabel(initialData.status) || ''} style={{ color: 'black' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={L('Buyer Remarks')} name="buyerRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <textarea value={initialData.buyerRemarks || ''} style={{                       
                border: '1px solid #d9d9d9',
                      borderRadius: '5px',
                      padding: '4px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease',  }} 
                      
                      onFocus={(e) => {
                        e.currentTarget.style.border = '1px solid #3cb48c';
                        e.currentTarget.style.boxShadow = '0 0 5px #3cb48c';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = '1px solid #d9d9d9';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      />
            </Form.Item>
          </Col>


        </Row>
  
        <Row gutter={16}>
        {/* <Col span={12}>
        <Tooltip title="Click Here to View the Contract Details!">
            <div
              onClick={() => handleRowClick(initialData.supplementarySummaryId)}
              onMouseEnter={() => setHoveredRowId(initialData.supplementarySummaryId)}
              onMouseLeave={() => setHoveredRowId(null)}
              style={{
                backgroundColor:
                  hoveredRowId === initialData.supplementarySummaryId
                    ? '#f1f1f1'
                    : Number(initialData.supplementarySummaryId) % 2 === 0
                    ? '#f9f9f9'
                    : '#fff',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '5px',
              }}
            >
              <Form.Item
                label={L('Supplementary Summary')}
                name="supplementarySummaryId"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ fontWeight: 'bold' }}
              >
                {/* <Input disabled value={initialData.supplementarySummaryId} style={{ color: 'black' }} /> */}
              {/* </Form.Item>
            </div>
            </Tooltip>
          </Col> */} 
          <Col span={12}>
            <Form.Item label={L('Accounts Remarks')} name="accountsRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }} hidden>
              <Input disabled value={initialData.accountsRemarks || ''} style={{ color: 'black' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item
                label={L('Supplementary Summary')}
                name="supplementarySummaryId"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ fontWeight: 'bold' ,display:"none"}}
              >
                <Input disabled value={initialData.supplementarySummaryId} style={{ color: 'black' }} /> 
             </Form.Item>
          </Col>
        </Row>
  
        <Form.Item label={L('Id')} name="id" style={{ display: 'none' }}>
          <Input />
        </Form.Item>
      </Form>
  
      {/* Supplier Modal inside the same Modal */}
      {isModalOpen && (
        <SupplierModalView
          // selectedRow={selectedRow}
          modalData={modalData}
          annexureModalData={annexuremodalData}
          supplementaryData = {supplementaryData}
          onClose={handleModalClose}
        />
      )}
    </Modal>
  );
  
  
};
export default CreateOrUpdateDahBoardDisputedata

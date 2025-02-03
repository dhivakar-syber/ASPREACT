import React from 'react';
import { Modal, Button, Row, Col } from 'antd';
// import { message } from 'antd';
// Import any helper functions you need (for example, formatDate)

// Define the props for the modal component
interface SupplierModalViewProps {
  // supplementaryData: any;
  modalData: any;
  annexureModalData: any;
  supplementaryData: any;
  // onDateChange: (date: any, dateString: string) => void;
  onClose: () => void;
}
const SupplierModalView: React.FC<SupplierModalViewProps> = ({
  supplementaryData,
  modalData,
  annexureModalData,
  // onDateChange,
  onClose,
}) => {
  // Prevent the modal from closing when clicking inside its content
  const handleInsideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  console.log(supplementaryData)
  console.log(supplementaryData.partdescription)

  function formatDate(d:Date) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 

    return `${day}-${month}-${year}`; 
}

const AnnexureTable = ({ data }: { data: any[] }) => {
  console.log('AnnexureTable',data);
  return (
    <div >
      <br></br>
      <h3>Annexure Details</h3>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

</div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
            borderRadius: '5px' }}>
        <thead>
        <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left", borderRadius: '2px' }}>
        
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>S.No</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Annexure Group</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Part No</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Invoice No</th>
          <th style={{width:"120px",padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>InvoiceDate</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Old Contract</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>New Contract</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Price(CBFC)</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Diff Value</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Qty</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Total</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Currency</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Supp.Inv.No/Credit Note</th>
          <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Supp.Inv.Date/Credit Note Date</th>
        </tr>
          
        </thead>
        <tbody >
          {data && data.length > 0 ? (
            data.map((item:any, index:any) => (
              <tr key={index} 
              style={{
                backgroundColor:
                index % 2 === 0 ? '#f9f9f9' : '#fff',
              }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.versionNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.partno}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.invoiceNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.invoiceDate)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.oldValue}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.newValue}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}></td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.diffValue}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.qty}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.total}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.currency}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplementaryInvoiceNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplementaryInvoiceDate ? formatDate(item.supplementaryInvoiceDate) : ""}</td>
              </tr>
            ))
          ):''}
        </tbody>
      </table>
    </div>
  );
};

const InvoiceTable = ({ data }: { data: any[] }) => {
  console.log('invoiceTable',data);
  return (
    <div >
      <h3>CBFC Information</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "12px",
            borderRadius: '5px' }}>
        <thead>
        <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" , borderRadius: '2px'}}>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>S.no</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>PartNo</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Invoice No</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>InvoiceDate</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Qty</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Price (GRN)</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Price (CBFC)</th>
            <th style={{ padding: '10px', border: '1px solid #ffffff1a', fontWeight: 'normal', borderRadius: '2px'}}>Paid Amount (CBFC)</th>
          </tr>
        </thead>
        <tbody >
          {data && data.length > 0 ? (
            data.map((item:any, index:any) => (
              <tr key={index} style={{
                backgroundColor:
                index % 2 === 0 ? '#f9f9f9' : '#fff',
              }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{index + 1}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.partNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.invoiceNo}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{formatDate(item.invoicedate)}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.quantity}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.paidAmount}</td>
              </tr>
            ))
          ):''}
        </tbody>
      </table>
    </div>
  );
};
  return (
    <Modal
      visible={true}
      title="Contract Details"
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      centered
      width="80%"
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
      maskClosable={true}
      
    >
      <div onClick={handleInsideClick}>
        <Row gutter={[14, 10]}>
          {/* Column 1 */}
          <Col span={6}>
            <div>
              <Row gutter={[14, 10]}>
                <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
                  <p>Part Number</p>
                  <p>Description</p>
                  <p>Buyer Name</p>
                  <p>Supplier Code</p>
                  <p>Supplier Name</p>
                </Col>
                <Col span={12} style={{ fontSize: '12px' }}>
                  <p>
                    <span>: {supplementaryData.partno}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.partdescription}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.buyerName}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.suppliercode}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.suppliername}</span>
                  </p>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Column 2 */}
          <Col span={6}>
            <div>
              <Row gutter={[14, 10]}>
                <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
                  <p>Valid From</p>
                  <p>Valid To</p>
                  <p>Contract No</p>
                  <p>Released Date</p>
                  <p>Plant</p>
                </Col>
                <Col span={12} style={{ fontSize: '12px' }}>
                  <p>
                    <span>: {formatDate(supplementaryData.contractFromDate)}</span>
                  </p>
                  <p>
                    <span>: {formatDate(supplementaryData?.contractToDate)}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.contractNo}</span>
                  </p>
                  <p>
                    <span>: {formatDate(supplementaryData?.approvalDate)}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.plantCode}</span>
                  </p>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Column 3 */}
          <Col span={6}>
            <div>
              <Row gutter={[14, 10]}>
                <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
                  <p>Old Value</p>
                  <p>New Value</p>
                  <p>Delta</p>
                  <p>Qty</p>
                  <p>Total</p>
                </Col>
                <Col span={12} style={{ fontSize: '12px' }}>
                  <p>
                    <span>: {supplementaryData?.oldValue}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.newValue}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.delta}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.grnQty}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.total}</span>
                  </p>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Column 4 */}
          <Col span={6}>
            <div>
              <Row gutter={[14, 10]}>
                <Col span={12} style={{ textAlign: 'right', fontSize: '12px' }}>
                  <p>Accounted Price</p>
                  <p>Accounted Value</p>
                  <p>Version No</p>
                  <p>Implementation Date</p>
                  {/* <p>Change</p> */}
                </Col>
                <Col span={12} style={{ fontSize: '12px' }}>
                  <p>
                    <span>: {supplementaryData?.accoutedPrice}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.accountedValue}</span>
                  </p>
                  <p>
                    <span>: {supplementaryData?.versionNo}</span>
                  </p>
                  <p>
                    <span>: {formatDate(supplementaryData?.implementationDate)}</span>
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

                 <InvoiceTable data={modalData} />
                 <AnnexureTable data={annexureModalData} />
      </div>
    </Modal>
  );
};

export default SupplierModalView;

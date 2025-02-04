import React from 'react';
import { Form, Input, Row, Col } from 'antd';

const { Item } = Form;

const SupplementaryView = ({ 
  selectedRow, 
  handleModalClose, 
  loadgrndata, 
  isVisible 
}: { 
  selectedRow: any; 
  handleModalClose: () => void; 
  loadgrndata: any; 
  isVisible: boolean; 
}) => {
  if (!isVisible) return null;

  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const formatDateToInput = (date: string) => new Date(date).toISOString().split('T')[0];
  
  const InvoiceTable = (data:any) => {
    return (
      <div >
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontSize: "14px" }}>
          <thead>
          <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>
              <th>S.no</th>
              <th>PartNo</th>
              <th>Invoice No</th>
              <th>InvoiceDate</th>
              <th>Qty</th>
              <th>Price (GRN)</th>
              <th>Paid Amount (CBFC)</th>
            </tr>
          </thead>
          <tbody >
            {data && data.length > 0 ? (
              data.map((item:any, index:any) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.partNo}</td>
                  <td>{item.invoiceNo}</td>
                  <td>{item.invoicedate}</td>
                  <td>{item.quantity}</td>
                  <td>{item.invoiceRate}</td>
                  <td>{item.paidAmount}</td>
                </tr>
              ))
            ):''}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: 9999,
        width: "70%",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <button
        onClick={handleModalClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px",
          backgroundColor: "#005f7f",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Close
      </button>
      <div className="ui-container">
        <h3 className="card-title align-items-start flex-column">
          <span className="fw-bolder text-dark" style={{ fontSize: '13px', textAlign: 'left' }}>
            Contract Details
          </span>
        </h3>
        <Form layout="vertical">
          <Row gutter={[14, 10]}>
            {/* Column 1 */}
            <Col span={6}>
              <Item label="Part No:">
                <Input readOnly value={selectedRow.partno} />
              </Item>
              <Item label="Description:">
                <Input readOnly value={selectedRow.partdescription} />
              </Item>
              <Item label="Buyer:">
                <Input readOnly value={selectedRow.buyerName} />
              </Item>
              <Item label="Supplier Code:">
                <Input readOnly value={selectedRow.suppliercode} />
              </Item>
              <Item label="Supplier Name:">
                <Input readOnly value={selectedRow.suppliername} />
              </Item>
            </Col>

            {/* Column 2 */}
            <Col span={6}>
              <Item label="Valid From:">
                <Input readOnly value={formatDate(selectedRow.contractFromDate)} />
              </Item>
              <Item label="Valid To:">
                <Input readOnly value={formatDate(selectedRow.contractToDate)} />
              </Item>
              <Item label="Implemented On:">
                <Input type="Date" value={formatDateToInput(selectedRow.implementationDate)} />
              </Item>
              <Item label="Contract No:">
                <Input readOnly value={selectedRow.contractNo} />
              </Item>
              <Item label="Released Date:">
                <Input readOnly value={selectedRow.approvalDate} />
              </Item>
            </Col>

            {/* Column 3 */}
            <Col span={6}>
              <Item label="Old Value:">
                <Input readOnly value={selectedRow.oldValue} />
              </Item>
              <Item label="New Value:">
                <Input readOnly value={selectedRow.newValue} />
              </Item>
              <Item label="Delta:">
                <Input readOnly value={selectedRow.delta} />
              </Item>
              <Item label="Qty:">
                <Input readOnly value={selectedRow.grnQty} />
              </Item>
              <Item label="Total:">
                <Input readOnly value={selectedRow.total} />
              </Item>
            </Col>

            {/* Column 4 */}
            <Col span={6}>
              <Item label="Accounted Price:">
                <Input readOnly value={selectedRow.accoutedPrice} />
              </Item>
              <Item label="Accounted Value:">
                <Input readOnly value={selectedRow.accountedValue} />
              </Item>
              <Item label="Version No:">
                <Input readOnly value={selectedRow.versionNo} />
              </Item>
              <Item label="Plant:">
                <Input readOnly value={selectedRow.plantCode} />
              </Item>
            </Col>
          </Row>
        </Form>
        <InvoiceTable data={loadgrndata} />
      </div>
    </div>
  );
};

export default SupplementaryView;

import React from "react";
import { Modal } from "antd";

// Define the type for the props
interface DisputeTableProps {
  rowId: number;
  visible: boolean;
  onCancel: () => void;
  data: Array<{
    dispute: {
      query: string;
    };
    supplierRejectionCode: string;
    supplierCode: string;
    buyerShortId: string;
  }>;
}

// DisputeTable component
const DisputeTable: React.FC<DisputeTableProps> = ({ rowId, visible, onCancel, data }) => {
  return (
    <Modal
      title={`Dispute History`}
      visible={visible}
      onCancel={onCancel}
      footer={null} // Remove the default footer
      width={800} // Adjust modal width as needed
    >
      <div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#005f7f", color: "#fff", textAlign: "left" }}>
              <th>Query</th>
              <th>Rejection</th>
              <th>Buyer Name</th>
              <th>Supplier Name</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.dispute.query}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplierRejectionCode}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplierCode}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.buyerShortId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default DisputeTable;

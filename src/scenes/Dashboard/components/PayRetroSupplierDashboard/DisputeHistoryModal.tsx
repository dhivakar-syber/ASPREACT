import React from "react";
import { Modal } from "antd";
//import { EnumDisputeStatus } from "../../../../enum";

// Define the type for the props
interface DisputeTableProps {
  rowId: number;
  visible: boolean;
  onCancel: () => void;
  data: Array<{
    dispute: {
      query: string;
      status:any;
      buyerRemarks:string;
      accountsRemarks:string;
      responseTime:string;
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
              <th>BuyerShortId</th>
              <th>SupplierRejectionCode</th>
              <th>Query</th>
              <th>Status</th>
              <th>Buyer Remarks</th>
              <th>Accounts Remarks</th>
              <th>Response Time</th>
            </tr>
          </thead>
          <tbody>
  {data && data.length > 0 ? (
    data.map((item, index) => {
      // Update the dispute status based on the value
      switch (item.dispute.status) {
        case 0:
          item.dispute.status = "Open";
          break;
        case 1:
          item.dispute.status = "ForwardedToFandC";
          break;
        case 2:
          item.dispute.status = "Close";
          break;
        case 3:
          item.dispute.status = "InimatedToBuyer";
          break;
        default:
          break;
      }

      // Return the table row
      return (
        <tr key={index}>
          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.buyerShortId}</td>
          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.supplierRejectionCode}</td>
          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.dispute.query}</td>
          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.dispute.status}</td>
          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.dispute.buyerRemarks}</td>
          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.dispute.accountsRemarks}</td>
          <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.dispute.responseTime}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={7} style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
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

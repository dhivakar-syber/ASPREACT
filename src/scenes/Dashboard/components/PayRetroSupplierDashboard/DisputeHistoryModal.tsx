import React from "react";
import { Modal, Table } from "antd";

// Define the type for the props
interface DisputeTableProps {
  rowId: number;
  visible: boolean;
  onCancel: () => void;
  data: Array<{
    dispute: {
      query: string;
      status: number;
      buyerRemarks: string;
      accountsRemarks: string;
      responseTime: string;
    };
    supplierRejectionCode: string;
    supplierCode: string;
    buyerShortId: string;
  }>;
}

// Map dispute status to meaningful labels
const getStatusLabel = (status: number): string => {
  switch (status) {
    case 0:
      return "Open";
    case 1:
      return "ForwardedToFandC";
    case 2:
      return "Close";
    case 3:
      return "InimatedToBuyer";
    default:
      return "Unknown";
  }
};

// DisputeTable component
const DisputeTable: React.FC<DisputeTableProps> = ({ rowId, visible, onCancel, data }) => {
  // Columns definition for the Table component
  const columns = [
    {
      title: "Buyer Short ID",
      dataIndex: "buyerShortId",
      key: "buyerShortId",
      width: "fix-content",
      align: "center" as "center",
    },
    {
      title: "Rejection Code",
      dataIndex: "supplierRejectionCode",
      key: "supplierRejectionCode",
      width: "auto",
      align: "center" as "center",
    },
    {
      title: "Query",
      dataIndex: "dispute.query",
      key: "query",
      render: (text: any, record: any) => (
        <div>{record.dispute?.query || "No query available"}</div> // Render dispute.query directly
      ),
      width: "auto",
      align: "center" as "center",
    },
    {
      title: "Status",
      key: "status", // Use `key` instead of `dataIndex` for nested data
      render: (text: any, record: any) => {
        // Access the dispute status from the record
        const status = record.dispute?.status;
        return getStatusLabel(status); // Call the helper function to display the status label
      },
      width: "fix-content",
      align: "center" as "center",
    },
    {
      title: "Buyer Remarks",
      dataIndex: "dispute.buyerRemarks",
      key: "buyerRemarks",
      render: (text: any, record: any) => (
        <div>{record.dispute?.buyerRemarks || ""}</div> // Render dispute.query directly
      ),
      width: 100,
      align: "center" as "center",
    },
    {
      title: "Accounts Remarks",
      dataIndex: "dispute.accountsRemarks",
      key: "accountsRemarks",
      render: (text: any, record: any) => (
        <div>{record.dispute?.accountsRemarks || ""}</div> // Render dispute.query directly
      ),
      width: 100,
      align: "center" as "center",
    },
    {
      title: "Response Time",
      dataIndex: "dispute.responseTime",
      key: "responseTime",
      render: (text: any, record: any) => (
        <div>{record.dispute?.responseTime || ""}</div> // Render dispute.query directly
      ),
      width: 100,
      align: "center" as "center",
    },
  ];

  return (
    <Modal
      title={`Dispute History`}
      visible={visible}
      onCancel={onCancel}
      footer={null} // Remove the default footer
      width={800} // Adjust modal width as needed
    >
      <Table        
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 5, // Set how many rows per page you want
          total: data.length,
          showTotal: (total: number) => `Total ${total} items`, // Custom total text
        }}
        rowKey={(record) => record.supplierRejectionCode} // Use a unique key for each row
        scroll={{ y: 400 }} // Optional: set a fixed height for the table body with scroll
      />
    </Modal>
  );
};

export default DisputeTable;

import React, { useState } from "react";
import { Modal, Button, Input, Select, DatePicker, Upload, message, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { ColumnsType } from "antd/es/table";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";

interface SupplementaryInvoiceModalProps {
  rowId: string | null; // Row ID to display
  visible: boolean; // Modal visibility status
  onCancel: () => void; // Function to close the modal
}

interface TableData {
  annexureGroup: string;
  invoice: string;
  date: string;
  invoiceFile: string;
  annexureFile: string;
  attachmentFile: string;
}

const SupplementaryInvoiceModal: React.FC<SupplementaryInvoiceModalProps> = ({
  rowId,
  visible,
  onCancel,
}) => {
  const [annexureGroup, setAnnexureGroup] = useState<string | undefined>(undefined);
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string | undefined>(undefined);
  const [annexureFile, setAnnexureFile] = useState<RcFile | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<RcFile | null>(null);
  const [annexureAttachmentFile, setAnnexureAttachmentFile] = useState<RcFile | null>(null);

  const annexureOptions = [1, 2, 3]; // Example annexure groups

  const handleUpload = async () => {
    if (!invoiceNo || !invoiceDate || !annexureFile || !attachmentFile || !annexureAttachmentFile) {
      message.error("Please fill in all fields and upload files.");
      return;
    }
  
    const formData = new FormData();
    if (rowId) {
    formData.append("supplementaryid", rowId);  // append the rowId directly as a string
  }
    formData.append("invoiceNo", invoiceNo);
    formData.append("invoiceDate", invoiceDate);
    formData.append("annexureGroup", annexureGroup || "");
    
    // Ensure you append the files properly
    if (attachmentFile) {
      formData.append("attachmentFile", attachmentFile);
    }
  
    if (annexureFile) {
      formData.append("annexureFile", annexureFile);
    }
  
    if (annexureAttachmentFile) {
      formData.append("annexureAttachmentFile", annexureAttachmentFile);
    }
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
  });
    try {
      // Call your service's checkSignature method with the FormData
      const response = await supplementarySummariesService.checkSignature(formData); //ts2345
  
      if (response.hasSignature && response.success) {
        message.success("Supplementary Invoice uploaded successfully.");
        // const uploadData = await supplementarySummariesService.supplementaryuploadeddetails(Number(rowId));
        
        //onCancel(); // Close the modal
      } 
      else if(!response.hasSignature && response.success) {
        message.error("No signature found in the PDF (Attachment 1)");
      }
    } catch (error) {
      message.error("An error occurred during the upload process.");
    }
  };  

  const columns: ColumnsType<TableData> = [
    { title: "Annexure Group", dataIndex: "annexureGroup" },
    { title: "Supplementary Invoice/Credit Note", dataIndex: "invoice" },
    { title: "Date", dataIndex: "date" },
    { title: "Supplementary Invoice/Credit Note File", dataIndex: "invoiceFile" },
    { title: "Annexure File", dataIndex: "annexureFile" },
    { title: "Annexure Attachment", dataIndex: "attachmentFile" },
    {
      title: "",
      render: (_, record) => <Button type="link">Delete</Button>,
    },
  ];

  const data: TableData[] = [
    {
      annexureGroup: "Group 1",
      invoice: "INV-12345",
      date: "2023-12-28",
      invoiceFile: "Invoice.pdf",
      annexureFile: "Annexure.pdf",
      attachmentFile: "Attachment.xlsx",
    },
  ];

  return (
    <Modal
      title="Supplementary Invoice/Credit Note Upload"
      visible={visible} // Control modal visibility
      onCancel={onCancel} // Handle modal close
      footer={null}
      width={800}
    >
      <div className="row mb-4">
        <div className="col-md-3">
          <label htmlFor="annexureGroup" className="form-label">
            Annexure Group
          </label>
          <Select
            id="annexureGroup"
            value={annexureGroup}
            onChange={(value) => setAnnexureGroup(value)}
            style={{ width: "100%" }}
            placeholder="Select Annexure Group"
          >
            {annexureOptions.map((group) => (
              <Select.Option key={group} value={group}>
                {group}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="col-md-3">
          <label htmlFor="invoiceNo" className="form-label">
            Supplementary Invoice/Credit Note No
          </label>
          <Input
            id="invoiceNo"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            placeholder="Enter Reference Number"
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="invoiceDate" className="form-label">
            Supplementary Invoice Date/Credit Note Date
          </label>
          <DatePicker
            id="invoiceDate"
            onChange={(date) => setInvoiceDate(date ? date.format("YYYY-MM-DD") : undefined)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-3 text-end">
          <Button type="primary" onClick={handleUpload} style={{ marginTop: "30px" }}>
            Upload
          </Button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Supplementary Invoice/Credit Note (PDF only)</label>
          <Upload
            beforeUpload={(file) => {
              setAttachmentFile(file as RcFile);
              return false;
            }}
            accept=".pdf"
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Upload Invoice</Button>
          </Upload>
        </div>
        <div className="col-md-4">
          <label className="form-label">Annexure Upload (PDF only)</label>
          <Upload
            beforeUpload={(file) => {
              setAnnexureFile(file as RcFile);
              return false;
            }}
            accept=".pdf"
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Upload Annexure</Button>
          </Upload>
        </div>
        <div className="col-md-4">
          <label className="form-label">Annexure Attachment (Excel)</label>
          <Upload
            beforeUpload={(file) => {
              setAnnexureAttachmentFile(file as RcFile);
              return false;
            }}
            accept=".xlsx,.csv"
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}>Upload Attachment</Button>
          </Upload>
        </div>
      </div>

      <Table columns={columns} dataSource={data} pagination={false} />
    </Modal>
  );
};

export default SupplementaryInvoiceModal;
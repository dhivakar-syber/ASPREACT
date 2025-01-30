import React, { useState } from "react";
import { Modal, Button, Input, Select, DatePicker, Upload, message, Table } from "antd";
import { UploadOutlined,FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { ColumnsType } from "antd/es/table";
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import FullScreenLoader from "./fullscreenloader";

interface SupplementaryInvoiceModalProps {
  rowId: string | null;
  visible: boolean;
  AnnexureVersion:number;
  onCancel: () => void;
}

interface TableData {
  annexureVersionNo:number,
  annexuregroup:number,
  supplementaryinvoiceNo:string,
  supplementaryinvoicedate:Date,
  supplementaryinvoicepath:string,
  annexurepdfpath:string,
  annexureexcelpath:string,

}

const SupplementaryInvoiceModal: React.FC<SupplementaryInvoiceModalProps> = ({
  rowId,
  AnnexureVersion,
  visible,
  onCancel,
}) => {
  const [annexureGroup, setAnnexureGroup] = useState<string | "1"| undefined>(undefined);
  const [invoiceNo, setInvoiceNo] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string | undefined>(undefined);
  const [annexureFile, setAnnexureFile] = useState<RcFile | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<RcFile | null>(null);
  const [annexureAttachmentFile, setAnnexureAttachmentFile] = useState<RcFile | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]); 
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  const handleCancel = () => {
    setTableData([]);      // Clear table data
    onCancel();            // Call the parent-provided onCancel
  };
  let t = AnnexureVersion;
let v = [];
for (let i = 1; i <= t; i++) {
  v.push(i);
}
  const annexureOptions = v; // Example annexure groups
  const updateTableData = async (rowId: string) => {
    try {
      const uploadData = await supplementarySummariesService.supplementaryuploadeddetails(rowId);
  
      const newData: TableData[] = uploadData.list
  .filter((item: any) => 
    item.annexuregroup !== null &&
    item.supplementaryinvoiceNo !== null &&
    item.supplementaryinvoicedate !== null &&
    item.supplementaryannexurepath !== null &&
    item.annexurepath !== null &&
    item.attachment3 !== null
  )
  .map((item: any) => ({
    annexureVersionNo: uploadData.annexureVersionNo,
    annexuregroup: item.annexuregroup,
    supplementaryinvoiceNo: item.supplementaryinvoiceNo,
    supplementaryinvoicedate: item.supplementaryinvoicedate,
    supplementaryinvoicepath: item.supplementaryannexurepath,
    annexurepdfpath: item.annexurepath,
    annexureexcelpath: item.attachment3,
  }));
  
      // Use concat instead of spread
      console.log('NewData',newData);
      setTableData((prevData: TableData[]) => prevData.concat(newData));
    } catch (error) {
      message.error("Failed to fetch and update table data.");
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (visible && rowId) {
      updateTableData(rowId);
    }
  }, [visible, rowId]); 
  
  const handleUpload = async () => {
    if (!invoiceNo || !invoiceDate || !annexureFile || !attachmentFile || !annexureAttachmentFile) {
      message.error("Please fill in all fields and upload files.");
      return;
    }
    setIsLoading(true)

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
      const response = await supplementarySummariesService.checkSignature(formData);
  
      if (response.result.hasSignature && response.success) {
        message.success("Supplementary Invoice uploaded successfully.");
        setIsLoading(false)
       // const uploadData = await supplementarySummariesService.supplementaryuploadeddetails(Number(rowId));
        


        if (rowId) {
          await updateTableData(rowId);
        }

        // const uploadData = await supplementarySummariesService.supplementaryuploadeddetails(Number(rowId));
        
        //onCancel(); // Close the modal
      } 
      else if(!response.result.hasSignature && response.success) {
        message.error("No signature found in the PDF (Attachment 1)");
      }
    } catch (error) {
      message.error("An error occurred during the upload process.");
    }
  };  
  const handleSupplementrypdfButtonClick = async (pdfPath: string) => {
    try {
        // Fetch file data from the API
        const response = await supplementarySummariesService.GetFile(pdfPath);

        if (response && response.fileBytes && response.fileType) {
            // Convert the fileBytes (base64 string) into a data URL
            const dataUrl = `data:${response.fileType};base64,${response.fileBytes}`;
            
            // Set the generated data URL to display in the iframe
            setPdfUrl(dataUrl);
            setIsModalVisible(true); // Open the modal
        } else {
            console.error("Invalid file response:", response);
        }
    } catch (error) {
        console.error("Error fetching the PDF file:", error);
    }
};
  const handleSupplementryPathCancel = () => {
    setIsModalVisible(false); // Close the modal
  };
  const handleAnnexurepdfButtonClick = async (pdfPath: string) => {
    try {
        // Fetch file data from the API
        const response = await supplementarySummariesService.GetFile(pdfPath);

        if (response && response.fileBytes && response.fileType) {
            // Convert the fileBytes (base64 string) into a data URL
            const dataUrl = `data:${response.fileType};base64,${response.fileBytes}`;
            
            // Set the generated data URL to display in the iframe
            setPdfUrl(dataUrl);
            setIsModalVisible(true); // Open the modal
        } else {
            console.error("Invalid file response:", response);
        }
    } catch (error) {
        console.error("Error fetching the PDF file:", error);
    }
};
async function downloadFile({ path }: { path: string }): Promise<void> {
  try {
    // Call the service method to get the file details
    const file = await supplementarySummariesService.DownloadExcel(path);

    // Check if the required properties exist
    if (!file.fileContent || !file.fileType || !file.fileName) {
      throw new Error("Invalid file data received.");
    }

    // Convert the file content (Base64) into a Blob
    const byteCharacters = atob(file.fileContent);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.fileType });

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // Create a Blob URL
    link.download = file.fileName || "Annexure.xlsx"; // Use provided filename or default
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the Blob URL to free up memory
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
}


  const handleAnnexurePathCancel = () => {
    setIsModalVisible(false); // Close the modal
  };
  const columns: ColumnsType<TableData> = [
    { title: "Annexure Group", dataIndex: "annexuregroup" },
    { title: "Supplementary Invoice/Credit Note", dataIndex: "supplementaryinvoiceNo" },
    { title: "Date", dataIndex: "supplementaryinvoicedate" },
    {
      title: "Supplementary Invoice/Credit Note File",
      dataIndex: "supplementaryinvoicepath", // Keep the original title
      render: (_, record) => (
        <Button type="link" onClick={() => handleSupplementrypdfButtonClick(record.supplementaryinvoicepath)}>
          <FilePdfOutlined style={{ marginRight: 8 }} />
        </Button>
      ),
    },
    {
      title: "Annexure File",
      dataIndex: "annexurepdfpath", // Keep the original title
      render: (_, record) => (
        <Button type="link"onClick={() => handleAnnexurepdfButtonClick(record.annexurepdfpath)}>
          <FilePdfOutlined style={{ marginRight: 8 }} />
        </Button>
      ),
    },
    {
      title: "Annexure Attachment",
      dataIndex: "annexureexcelpath", // Keep the original title
      render: (_, record) => (
        <Button type="link"onClick={() =>
          downloadFile({
            path: record.annexureexcelpath,
          })
        }>
          <FileExcelOutlined />
        </Button>
      ),
    }
  ];

  // const data: TableData[] = [
  //   {
  //     annexureGroup: "Group 1",
  //     invoice: "INV-12345",
  //     date: "2023-12-28",
  //     invoiceFile: "Invoice.pdf",
  //     annexureFile: "Annexure.pdf",
  //     attachmentFile: "Attachment.xlsx",
  //   },
  // ];

  return (
    <Modal
      title="Supplementary Invoice/Credit Note Upload"
      visible={visible} // Control modal visibility
      onCancel={handleCancel} // Handle modal close
      footer={null}
      width={700}
    >
      <div className="row mb-4">
        <div className="col-md-3" style = {{paddingTop: '20px'}}>
          <label htmlFor="annexureGroup" className="form-label"style = {{fontSize: '12px',fontWeight: 'normal'}}>
            Annexure Group
          </label>
          <Select
            id="annexureGroup"
            value={annexureGroup}
            onChange={(value) => setAnnexureGroup(value)}
            style={{ width: '85%', borderRadius: '5px' }}
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
          <label htmlFor="invoiceNo" className="form-label"style = {{fontSize: '12px',fontWeight: 'normal'}}>
            Supplementary Invoice/Credit Note No
          </label>
          <Input
            id="invoiceNo"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
            style={{width:'85%',borderRadius: '5px'}}
            placeholder="Enter Reference Number"
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="invoiceDate" className="form-label"style = {{fontSize: '12px',fontWeight: 'normal'}}>
            Supplementary Invoice Date/Credit Note Date
          </label>
          <DatePicker
            id="invoiceDate"
            onChange={(date) => setInvoiceDate(date ? date.format("YYYY-MM-DD") : undefined)}
            style={{ width: "85%",borderRadius: '5px' }}
          />
        </div>
        <div className="col-md-3 text-end" style={{paddingRight: "50px"}}>
          <Button type="primary" onClick={handleUpload} style={{ marginTop: "30px",borderRadius: '5px'}}>
            Upload
          </Button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label"style = {{fontSize: '12px',width:'85%',fontWeight: 'normal'}}>Supplementary Invoice/Credit Note (Digitally signed PDF only)</label>
          <Upload
            beforeUpload={(file) => {
              setAttachmentFile(file as RcFile);
              return false;
            }}
            accept=".pdf"
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />} style={{borderRadius: '5px',fontSize: '12px'}}>Upload Invoice</Button>
          </Upload>
        </div>
        <div className="col-md-4"style = {{paddingTop: '25px'}}>
          <label className="form-label"style = {{fontSize: '12px',width:'85%',fontWeight: 'normal'}}>Annexure Upload (PDF only)</label>
          <Upload
            beforeUpload={(file) => {
              setAnnexureFile(file as RcFile);
              return false;
            }}
            accept=".pdf"
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />} style={{borderRadius: '5px',width:'95%',fontSize: '12px'}}>Upload Annexure</Button>
          </Upload>
        </div>
        <div className="col-md-4"style = {{paddingTop: '25px'}}>
          <label className="form-label"style = {{fontSize: '12px',fontWeight: 'normal'}}>Annexure Attachment (Excel)</label>
          <Upload
            beforeUpload={(file) => {
              setAnnexureAttachmentFile(file as RcFile);
              return false;
            }}
            accept=".xlsx,.csv"
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />}style={{borderRadius: '5px',width:'95%',fontSize: '12px'}}>Upload Attachment</Button>
          </Upload>
        </div>
      </div>

      <Table columns={columns} dataSource={tableData} pagination={false} className="custom-ant-table" 
      style={{fontSize:'12px'}}
      />
      <Modal
        title="View PDF"
        visible={isModalVisible}
        onCancel={handleSupplementryPathCancel}
        footer={null}
        width="60%"
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: 'none' }}
          />
        )}
      </Modal>
      <Modal
        title="View PDF"
        visible={isModalVisible}
        onCancel={handleAnnexurePathCancel}
        footer={null}
        width="60%"
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: 'none' }}
          />
        )}
      </Modal>
      {isLoading&&FullScreenLoader}
    </Modal>
  );
};

export default SupplementaryInvoiceModal;
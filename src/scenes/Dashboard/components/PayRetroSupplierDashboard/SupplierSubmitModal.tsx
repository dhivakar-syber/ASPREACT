import React, { useState, useRef } from "react";
import { message, Button, Spin } from "antd"; // Import Spin for the loader
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";
import submiticon from "../../../../images/Submiticon.svg";
import closeicon from "../../../../images/close.svg";



interface SupplierSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitIdRow: number; // Assuming this comes as a prop
  supplementaryInvoiceSubmit: (item: any) => void;
}

const Submiticon = () => (
  <span role="img" aria-label="home" className="anticon">
    <img src={submiticon} alt="Submit" />
  </span>
);
const Closeicon = () => (
  <span role="img" aria-label="home" className="anticon">
    <img src={closeicon} alt="close" />
  </span>
);

const SupplierSubmitModal: React.FC<SupplierSubmitModalProps> = ({
  isOpen,
  onClose,
  submitIdRow,
  supplementaryInvoiceSubmit,
}) => {
  const [submitText, setSubmitText] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const submitRemarksRef = useRef<HTMLTextAreaElement>(null);
  

  const handleSubmit = () => {
    const submitRemarks = submitRemarksRef.current?.value || ""; // Get the value from the textarea
    console.log("Submit Remarks:", submitRemarks);

    if (!submitIdRow) {
      console.error("Submit ID Row is not set.");
      return;
    }
    
    // Set loading to true before starting the submission
    setLoading(true);
    
    supplementarySummariesService
      .supplementaryInvoiceSubmit(submitIdRow, submitRemarks) // Call the API method with the necessary parameters
      .then((result: any[]) => {
        result.forEach((item) => {
          supplementaryInvoiceSubmit(item); // Process each item in the result
        });

        message.success("Submission successful.");
        onClose(); // Close the modal after successful submission
      })
      .catch((error: any) => {
        console.error("Error during submission:", error); // Handle errors
        message.error("Error during submission. Please try again.");
      })
      .finally(() => {  
        // Set loading to false after the submission is complete
        setLoading(false);
        
        
      });
  };

  if (!isOpen) return null;

  return (
    <div>
    <div
      className="modal fade show"
      style={{
        position: "fixed",
        top: "25%",
        left: "55%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: 9999,
        width: "35%", // Adjusting modal width
        maxHeight: "80vh", // Limit modal height
        overflowY: "auto",
      }}
      id="suppliersubmit"
      tabIndex={-2}
      role="modal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-md" role="document">
        <h6
          style={{
            marginLeft: "10px",
            fontSize: "larger",
            textAlign: "left",
          }}
        >
          <b>Approval Send Box</b>
        </h6>
        <div className="col-md-12">
          <div className="rm-a3-remarks-container">
            <div className="input-group">
              <textarea
                ref={submitRemarksRef}
                rows={3}
                maxLength={250}
                name="supplier-submit"
                id="supplier-submit"
                className="form-control"
                value={submitText}
                onChange={(e) => setSubmitText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-footer"
        style={{ padding: "10px", textAlign: "end" }}
      >
        <Button
          style={{
            marginRight: "10px",
            backgroundColor: "#006780",
            color: "#fff",
            borderRadius: "8px",
            width: "30%",
          }}
          className="btn btn-primary sumbit-button"
          onClick={handleSubmit}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <Spin size="default" /> // Increased spinner size
          ) : (
            <>
              <Submiticon /> send to Buyer
            </>
          )}
        </Button>
        <Button
          style={{ backgroundColor: "#FF0000", color: "white", width: "20%" }}
          className="btn btn-secondary"
          onClick={onClose}
          disabled={loading} // Disable button while loading
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginBottom: "5px",
            }}
          >
            <Closeicon /> Close
          </span>
        </Button>
      </div>
      
    </div>
    </div>
  );
};

export default SupplierSubmitModal;

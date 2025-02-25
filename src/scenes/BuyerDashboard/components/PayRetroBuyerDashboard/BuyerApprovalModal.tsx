import React, { useState ,useRef } from 'react';
import {message}from 'antd';
import supplementarySummariesService from "../../../../services/SupplementarySummaries/supplementarySummariesService";


interface BuyerApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitIdRow: number; // Assuming this comes as a prop
  BuyerApproval: (item: any) => void; 
}

const BuyerApprovalModal: React.FC<BuyerApprovalModalProps> = ({ isOpen, onClose,submitIdRow,
    BuyerApproval, }) => {
    const [submitText, setSubmitText] = useState('');
    const submitRemarksRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        const submitRemarks = submitRemarksRef.current?.value || ""; // Get the value from the textarea
        //console.log("Submit Remarks:", submitRemarks);
      
        // Validate `submitIdRow` before splitting
        if (!submitIdRow) {
          console.error("Submit ID Row is not set.");
          return;
        }

        // Ensure supplementarySummariesService is properly defined and imported
        supplementarySummariesService
          .supplementaryInvoiceSubmit(submitIdRow, submitRemarks) // Call the API method with the necessary parameters
          .then((result: any[]) => { // Use `then` for promise handling instead of `done`
            result.forEach((item) => {
                BuyerApproval(item); // Process each item in the result
            });
      
            message.success("Submission successful.");
            onClose(); // Close the modal after successful submission
          })
          .catch((error: any) => {
            console.error("Error during submission:", error); // Handle errors
          });
      };      


    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{
            position: "fixed",
            top: "25%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 9999,
            width: "35%",  // Adjusting modal width
            maxHeight: "80vh",  // Limit modal height
            overflowY: "auto",
          }} id="suppliersubmit" tabIndex={-2} role="modal" aria-hidden="true">
            <div className="modal-dialog modal-md" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        
                            <h6 style={{ marginLeft: '10px',fontSize: 'larger',textAlign: 'center' }}>Submit Model</h6>
                            <div className="col-md-12">
                                <div className="rm-a3-remarks-container">
                                    <div className="input-group">
                                        <textarea
                                            ref={submitRemarksRef}
                                            rows={5}
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
                    <div className="modal-footer" style={{ padding: '10px',textAlign: 'end' }}>
                        <button
                            style={{    marginRight: '10px',backgroundColor:'#006780',color:'#fff',borderRadius: '8px'
                            }}
                            type="button"
                            className="btn btn-primary sumbit-button"
                            onClick={handleSubmit}
                        >
                            <i className="flaticon-map" />
                            <span style={{padding: '11.075px 20.5px'}}>Submit</span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerApprovalModal;
import React, { useState ,useRef } from 'react';
import {message,Form,Input,DatePicker}from 'antd';
import supplementarySummariesService from "../../../services/SupplementarySummaries/supplementarySummariesService";



interface ApproveRejectModalModalProps {
  isOpen: boolean;
  onClose: () => void;
  submitIdRow: number; // Assuming this comes as a prop
  approveSubmit: (item: any) => void; 
  rejectSubmit: (item: any) => void; 
}

const AccountsApproval: React.FC<ApproveRejectModalModalProps> = ({ isOpen, onClose,submitIdRow,
    approveSubmit,rejectSubmit }) => {
    const [submitText, setSubmitText] = useState('');
    const submitRemarksRef = useRef<HTMLTextAreaElement>(null);
    const [accountDate, setAccountDate] = useState<string | ''>('');
    const [accountNo, setAccountNo] = useState('');
    const [form] = Form.useForm();
    


    const handleApproveSubmit = () => {
        form.validateFields()
            .then((values) => {

                const submitRemarks = submitRemarksRef.current?.value || '';

                console.log('Accountant No:', accountNo);
                console.log('Accountant Date:', accountDate);
                console.log('Submit Remarks:', submitRemarks);

                // Validate `submitIdRow` before proceeding
                if (!submitIdRow) {
                    console.error('Submit ID Row is not set.');
                    return;
                }

                // Call the API method with the necessary parameters
                supplementarySummariesService
                    .supplementaryInvoiceAccountApprove(submitIdRow,submitRemarks, accountNo,accountDate  )
                    .then((result:any) => {
                        
                            approveSubmit(result); // Process each item in the result
                        

                        message.success('Submission successful.');
                        onClose(); // Close the modal after successful submission
                    })
                    .catch((error) => {
                        console.error('Error during submission:', error); // Handle errors
                        message.error('Submission failed. Please try again.');
                    });
            })
            .catch((errorInfo) => {
                console.error('Validation Failed:', errorInfo);
            });
    };

    const handleRejectSubmit = () => {
        form.validateFields()
            .then((values) => {

                const submitRemarks = submitRemarksRef.current?.value || '';

                console.log('Accountant No:', accountNo);
                console.log('Accountant Date:', accountDate);
                console.log('Submit Remarks:', submitRemarks);

                // Validate `submitIdRow` before proceeding
                if (!submitIdRow) {
                    console.error('Submit ID Row is not set.');
                    return;
                }

                // Call the API method with the necessary parameters
                supplementarySummariesService
                    .supplementaryInvoiceAccountReject(submitIdRow,submitRemarks  )
                    .then((result:any) => {
                        
                            rejectSubmit(result); // Process each item in the result
                        

                        message.success('Rejection successful.');
                        onClose(); // Close the modal after successful submission
                    })
                    .catch((error) => {
                        console.error('Error during submission:', error); // Handle errors
                        message.error('Rejection failed. Please try again.');
                    });
            })
            .catch((errorInfo) => {
                console.error('Validation Failed:', errorInfo);
            });
    };


    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{
            position: "fixed",
            top: "40%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
           // zIndex: 9999,
            width: "35%",  // Adjusting modal width
            maxHeight: "80vh",  // Limit modal height
            overflowY: "auto",
          }} id="suppliersubmit" tabIndex={-2} role="modal" aria-hidden="true">
            <div className="modal-dialog modal-md" role="document">
                <div className="modal-content">
               
                <div className="modal-body">
    <h6
        style={{
            marginLeft: '10px',
            fontSize: 'larger',
            textAlign: 'center',
            marginBottom: '20px',
        }}
    >
        Approve/Reject Model
    </h6>
    <Form
        layout="vertical" // Improved layout for better alignment
        form={form} // Ensure `form` is defined if using hooks like `useForm`
    >
        <div style={{ marginBottom: '20px' }}>
            <Form.Item
                label="Accountant No"
                name="accNo"
               // rules={[{ required: true, message: 'Accountant No is required' }]} // Validation
            >
                <Input value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value)} placeholder="Enter Accountant No" />
            </Form.Item>
        </div>
        <div style={{ marginBottom: '20px' }}>
            <Form.Item
                label="Accountant Date"
                name="accdate"
              //  rules={[{ required: true, message: 'Accountant Date is required' }]} // Validation
            >
                <DatePicker style={{ width: '100%' }}
                        placeholder="Select Accountant Date"
                        onChange={(date) => setAccountDate(date ? date.format("YYYY-MM-DD") : "")} dropdownClassName="custom-datepicker-dropdown" />
            </Form.Item>
        </div>
        <h6
            style={{
                marginLeft: '10px',
                fontSize: 'medium',
                textAlign: 'center',
                marginBottom: '20px',
            }}
        >
            Accounts Approval
        </h6>
        <div className="col-md-12">
            <Form.Item
                label="Remarks"
                name="remarks"
                rules={[{ required: true, message: 'Remarks are required' }]} // Validation for remarks
            >
                <textarea
                    ref={submitRemarksRef}
                    rows={5}
                    maxLength={250}
                    id="supplier-submit"
                    className="form-control"
                    value={submitText}
                    onChange={(e) => setSubmitText(e.target.value)}
                    placeholder="Enter your remarks here"
                />
            </Form.Item>
        </div>
    </Form>
</div>

                    <div className="modal-footer" style={{ padding: '10px',textAlign: 'end' }}>
                        <button
                            style={{    marginRight: '10px',backgroundColor:'#006780',color:'#fff',borderRadius: '8px'
                            }}
                            type="button"
                            className="btn btn-primary sumbit-button"
                            onClick={handleApproveSubmit}
                        >
                            <i className="flaticon-map" />
                            <span style={{padding: '11.075px 20.5px'}}>Approve</span>
                        </button>
                        <button
                            style={{    marginRight: '10px',backgroundColor:'#006780',color:'#fff',borderRadius: '8px'
                            }}
                            type="button"
                            className="btn btn-primary sumbit-button"
                            onClick={handleRejectSubmit}
                        >
                            <i className="flaticon-map" />
                            <span style={{padding: '11.075px 20.5px'}}>Reject</span>
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

export default AccountsApproval;
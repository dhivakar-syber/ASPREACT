import React, { useState, useRef } from 'react';
import { message, Form, Button, Modal, Spin } from 'antd'; // Import Spin for the loader
import supplementarySummariesService from "../../../services/SupplementarySummaries/supplementarySummariesService";
import approveicon from "../../../images/Approve.svg";
import rejecticon from "../../../images/reject.svg";

interface ApproveRejectModalModalProps {
  isOpen: boolean;
  onCancel: () => void;
  submitIdRow: number;
  approveSubmit: (item: any) => void;
  rejectSubmit: (item: any) => void;
}

const Approveicon = () => (
  <span role="img" aria-label="approve" className="anticon">
    <img src={approveicon} alt="approve" />
  </span>
);

const Rejecticon = () => (
  <span role="img" aria-label="reject" className="anticon">
    <img src={rejecticon} alt="reject" />
  </span>
);

const BuyersApproval: React.FC<ApproveRejectModalModalProps> = ({
  isOpen,
  onCancel,
  submitIdRow,
  approveSubmit,
  rejectSubmit,
}) => {
  const [submitText, setSubmitText] = useState('');
  const submitRemarksRef = useRef<HTMLTextAreaElement>(null);
  const [form] = Form.useForm();

  const [approveLoading, setApproveLoading] = useState(false); // Loading state for approve
  const [rejectLoading, setRejectLoading] = useState(false); // Loading state for reject
  const [loading, setloading] = React.useState<boolean>(false);

  const handleApproveSubmit = () => {
    form.validateFields()
      .then(() => {
        const submitRemarks = submitRemarksRef.current?.value || '';
        if (!submitIdRow) {
          console.error('Submit ID Row is not set.');
          return;
        }

        setApproveLoading(true); // Start approve loading
        setloading(true); // Set loading to true before operation
        supplementarySummariesService
          .supplementaryInvoicebuyerapprove(submitIdRow, submitRemarks)
          .then((result: any) => {
            approveSubmit(result);
            message.success('Successfully Approved');
            onCancel();
          })
          .catch((error) => {
            console.error('Error during submission:', error);
            message.error('Approval failed. Please try again.');
          })
          .finally(() => {
            setApproveLoading(false); // Stop approve loading
            setloading(false); // Set loading to true before operation
          });
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  };

  const handleRejectSubmit = () => {
    form.validateFields()
      .then(() => {
        const submitRemarks = submitRemarksRef.current?.value || '';
        if (!submitIdRow) {
          console.error('Submit ID Row is not set.');
          return;
        }

        setRejectLoading(true); // Start reject loading
        setloading(true); // Set loading to true before operation
        supplementarySummariesService
          .supplementaryInvoicebuyerreject(submitIdRow, submitRemarks)
          .then((result: any) => {
            rejectSubmit(result);
            message.success('Successfully Rejected');
            onCancel();
          })
          .catch((error) => {
            console.error('Error during submission:', error);
            message.error('Rejection failed. Please try again.');
          })
          // .finally(() => {
          //   setRejectLoading(false); // Stop reject loading
          //   setloading(false); // Set loading to true before operation
          // });
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  };

    const Loading = () => (
      <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
        zIndex: 1000, // Ensure it appears above everything
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin size="large" />
      
    </div >
    
    );
    

  return (
    <div>
    {!loading ? (
      <div>
    <Modal
      title="Buyers Approve/Reject Modal"
      visible={isOpen}
      onCancel={onCancel}
      footer={null}
      centered
      width="25%"
      className="custom-modal"
      style={{
        overflow: 'hidden', // Ensure the rounded corners work
        top:-70
      }}
      >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Remarks"
          name="remarks"
          rules={[{ required: true, message: 'Remarks are required' }]}
        >
          <textarea
            ref={submitRemarksRef}
            rows={5}
            maxLength={250}
            style={{ fontSize: "18px", border: '1px solid #d9d9d9',outline: 'none',    
              transition: 'border-color 0.3s, box-shadow 0.3s' }}  // Corrected here
              onFocus={(e) => {
                e.target.style.border = '0.5px solid #3cb48c';
                e.target.style.boxShadow = '0 0 3px #3cb48c'; // Glow effect
              }}
              onBlur={(e) => {
                e.target.style.border = '0.5px solid #d9d9d9';
                e.target.style.boxShadow = 'none'; // Remove glow effect
              }}
            className="form-control"
            value={submitText}
            onChange={(e) => setSubmitText(e.target.value)}
            placeholder="Enter your remarks here"
          />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'end' }}>
        <Button
          style={{
            marginRight: '10px',
            backgroundColor: '#6EA046',
            color: '#fff',
            borderRadius: '8px',
          }}
          onClick={handleApproveSubmit}
          disabled={approveLoading || rejectLoading} // Disable if any button is loading
        >
          {approveLoading ? (
            <Spin size="small" />
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '5px' }}>
              <Approveicon /> Approve
            </span>
          )}
        </Button>
        <Button
          style={{
            marginRight: '10px',
            backgroundColor: '#FF0000',
            color: '#fff',
            borderRadius: '8px',
          }}
          onClick={handleRejectSubmit}
          disabled={approveLoading || rejectLoading} // Disable if any button is loading
        >
          {rejectLoading ? (
            <Spin size="small" />
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '5px' }}>
              <Rejecticon /> Reject
            </span>
          )}
        </Button>
      </div>
      </Modal>
    </div>
  ) : (
    Loading()
  )}
</div>
);
};

export default BuyersApproval;

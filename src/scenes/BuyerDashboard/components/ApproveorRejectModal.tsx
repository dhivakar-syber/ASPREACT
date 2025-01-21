import React, { useState, useRef } from 'react';
import { message, Form, Button, Modal } from 'antd';
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

  const handleApproveSubmit = () => {
    form.validateFields()
      .then(() => {
        const submitRemarks = submitRemarksRef.current?.value || '';
        if (!submitIdRow) {
          console.error('Submit ID Row is not set.');
          return;
        }

        supplementarySummariesService
          .supplementaryInvoicebuyerapprove(submitIdRow, submitRemarks)
          .then((result: any) => {
            approveSubmit(result);
            message.success('Approval successful.');
            onCancel();
          })
          .catch((error) => {
            console.error('Error during submission:', error);
            message.error('Approval failed. Please try again.');
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

        supplementarySummariesService
          .supplementaryInvoicebuyerreject(submitIdRow, submitRemarks)
          .then((result: any) => {
            rejectSubmit(result);
            message.success('Rejection successful.');
            onCancel();
          })
          .catch((error) => {
            console.error('Error during submission:', error);
            message.error('Rejection failed. Please try again.');
          });
      })
      .catch((errorInfo) => {
        console.error('Validation Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="Buyers Approval"
      visible={isOpen}
      onCancel={onCancel}
      footer={null}
      centered
      width="25%"
      style={{ top: -150 }}
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
        >
         <span style={{ display: 'flex', alignItems: 'center', gap: 0,marginBottom:'5px' }}>
                                <Approveicon />Approve
                            </span>
        </Button>
        <Button
          style={{
            marginRight: '10px',
            backgroundColor: '#FF0000',
            color: '#fff',
            borderRadius: '8px',
          }}
          onClick={handleRejectSubmit}
        >
         <span style={{ display: 'flex', alignItems: 'center', gap: 1,marginBottom:'5px' }}>
                                <Rejecticon />Reject
                            </span>
        </Button>
      </div>
    </Modal>
  );
};

export default BuyersApproval;

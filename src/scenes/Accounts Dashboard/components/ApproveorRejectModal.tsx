import React, { useState, useRef } from 'react';
import { Modal, Form, Input, DatePicker, message, Button } from 'antd';
import supplementarySummariesService from "../../../services/SupplementarySummaries/supplementarySummariesService";
import approveicon from "../../../images/Approve.svg";
import rejecticon from "../../../images/reject.svg";

interface ApproveRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const AccountsApproval: React.FC<ApproveRejectModalProps> = ({
  isOpen,
  onClose,
  submitIdRow,
  approveSubmit,
  rejectSubmit,
}) => {
  const [submitText, setSubmitText] = useState('');
  const [accountDate, setAccountDate] = useState<string | ''>('');
  const [accountNo, setAccountNo] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const submitRemarksRef = useRef<HTMLTextAreaElement>(null);
  const [form] = Form.useForm();

  const handleApproveSubmit = async () => {
    try {
      setIsLoading(true); // Start loading
      await form.validateFields();
      const submitRemarks = submitRemarksRef.current?.value || '';

      if (!submitIdRow) {
        console.error('Submit ID Row is not set.');
        setIsLoading(false);
        return;
      }

      const result = await supplementarySummariesService.supplementaryInvoiceAccountApprove(
        submitIdRow,
        submitRemarks,
        accountNo,
        accountDate
      );

      approveSubmit(result);
      message.success('Document Approved Successfully.');
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error during submission:', error);
      message.error('Approval failed. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleRejectSubmit = async () => {
    try {
      setIsLoading(true); // Start loading
      await form.validateFields();
      const submitRemarks = submitRemarksRef.current?.value || '';

      if (!submitIdRow) {
        console.error('Submit ID Row is not set.');
        setIsLoading(false);
        return;
      }

      const result = await supplementarySummariesService.supplementaryInvoiceAccountReject(
        submitIdRow,
        submitRemarks
      );

      rejectSubmit(result);
      message.success('Document Rejected Successfully');
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error during submission:', error);
      message.error('Rejection failed. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Modal
      title="Approve/Reject Modal"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      style={{ top: 20 }} // Moves the modal to the top
      width="35%"
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Accountant No" name="accNo">
          <Input
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            placeholder="Enter Accountant No"
          />
        </Form.Item>

        <Form.Item label="Accountant Date" name="accDate">
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Select Accountant Date"
            onChange={(date) => setAccountDate(date ? date.format('YYYY-MM-DD') : '')}
            dropdownClassName="custom-datepicker-dropdown"
          />
        </Form.Item>

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
            border: 'none',
          }}
          onClick={handleApproveSubmit}
          loading={isLoading} // Show loading spinner
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              marginBottom: '5px',
            }}
          >
            <Approveicon />
            Approve
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
          loading={isLoading} // Show loading spinner
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              marginBottom: '5px',
            }}
          >
            <Rejecticon />
            Reject
          </span>
        </Button>
      </div>
    </Modal>
  );
};

export default AccountsApproval;

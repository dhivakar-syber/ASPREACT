import React, { useState, useRef } from 'react';
import { Modal, Form, Input, DatePicker, message, Button, Tabs } from 'antd';
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
          title="Accounts Approve/Reject Modal"
          visible={isOpen}
          onCancel={onClose}
          footer={null}
          width="25%"
          className="custom-modal"
          style={{
            overflow: 'hidden', // Ensure the rounded corners work
            top: 100,  
            transition: 'height 0.8s ease-in-out', // Smooth transition effect
            minHeight: '300px', // Set a minimum height to prevent sudden jumps
          }}
        >
              <Tabs defaultActiveKey="1"
                  animated={{ tabPane: true }} // Enables smooth animation when switching tabs
              >
              <Tabs.TabPane tab="Approve" key="1">

          <Form>
          <Form.Item label="Accounting No" name="accNo">
            <Input
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              placeholder="Enter Accounting No"
            />
          </Form.Item>
  
          <Form.Item label="Accounting Date" name="accDate">
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Select Accounting Date"
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
                style={{
                  border: '1px solid #d9d9d9',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s', // Smooth transition
                }}
                onFocus={(e) => {
                  e.target.style.border = '0.5px solid #5097AB';
                  e.target.style.boxShadow = '0 0 3px #5097AB'; // Glow effect
                }}
                onBlur={(e) => {
                  e.target.style.border = '0.5px solid #d9d9d9';
                  e.target.style.boxShadow = 'none'; // Remove glow effect
                }}
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
            
          </div>
      </Tabs.TabPane>
  
      <Tabs.TabPane tab="Reject" key="3">
        <Form layout="vertical" form={form}>

          <Form>
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
                style={{
                  border: '1px solid #d9d9d9',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s', // Smooth transition
                }}
                onFocus={(e) => {
                  e.target.style.border = '0.5px solid #5097AB';
                  e.target.style.boxShadow = '0 0 3px #5097AB'; // Glow effect
                }}
                onBlur={(e) => {
                  e.target.style.border = '0.5px solid #d9d9d9';
                  e.target.style.boxShadow = 'none'; // Remove glow effect
                }}
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
        </Form>
      </Tabs.TabPane>
    </Tabs>
    </Modal>

  );
  
};

export default AccountsApproval;

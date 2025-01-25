import React, { useState } from 'react';
import { Form, Input, Modal, Col, Row, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../../lib/abpUtility';
import DisputesStrore from '../../../../stores/DisputesStrore';

export interface ICreateOrUpdateDahBoardDisputesDataProps {
  visible: boolean;
  modalType: string;
  onCreate: (item: any) => void;
  onsubmit: (item: any) => void;
  onclose: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  disputesStrore: DisputesStrore;
}

const CreateOrUpdateDahBoardDisputedata: React.FC<ICreateOrUpdateDahBoardDisputesDataProps> = ({
  visible,
  onCreate,
  onsubmit,
  onclose,
  formRef,
  initialData,
}) => {
  const [actionType, setActionType] = useState<'forward' | 'close' | null>(null);

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return 'Open';
      case 1:
        return 'Forwarded To FandC';
      case 2:
        return 'Close';
      case 3:
        return 'Inimated To Buyer';
      default:
        return 'Unknown';
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onclose}
      title={L('Disputes')}
      width={550}
      footer={[
        <Button
          key="forward"
          type="primary"
          onClick={() => {
            setActionType('forward');
            formRef.current?.submit(); // This triggers the form's onFinish
          }}
        >
          Forward to F&C
        </Button>,
        <Button
          key="close"
          type="primary"
          onClick={() => {
            setActionType('close');
            formRef.current?.submit(); // This triggers the form's onFinish
          }}
        >
          Close
        </Button>,
      ]}
    >
      <Form
        ref={formRef}
        initialValues={initialData}
        onFinish={(values) => {
          if (actionType === 'forward') {
            onCreate(values); // Handle Forward to F&C
          } else if (actionType === 'close') {
            onsubmit(values); // Handle Close
          }
        }}
      >
       <Row gutter={16}>
      <Col span={12}>
        <Form.Item label={L('SupplierName')} name="supplierName" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
          <Input disabled value={initialData ? initialData.supplierName : ''} style={{ color: 'black' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label={L('BuyerName')} name="buyerName" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
          <Input disabled value={initialData.buyerName || ''} style={{ color: 'black' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label={L('Pre-Defined Query')} name="supplierRejection" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
          <Input disabled value={initialData.supplierRejection || ''} style={{ color: 'black' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label={L('Additional Query')} name="query" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
          <Input disabled value={initialData.query || ''} style={{ color: 'black' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label={L('Supplementary Summary')} name="supplementarySummaryId" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
          <Input disabled value={initialData.supplementarySummary} style={{ color: 'black' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label={L('Status')} name="status" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
          <Input disabled value={getStatusLabel(initialData.status) || ''} style={{ color: 'black' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item label={L('Buyer Remarks')} name="buyerRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
          <Input value={initialData.buyerRemarks || ''} style={{ color: 'black' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label={L('Accounts Remarks')} name="accountsRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
          <Input disabled value={initialData.accountsRemarks || ''} style={{ color: 'black' }} />
        </Form.Item>
      </Col>
    </Row>
    
    <Form.Item label={L('Id')} name="id" style={{ display: 'none' }}>
      <Input />
    </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateDahBoardDisputedata;

import * as React from 'react';
import { Form, Input, Modal,Col,Row,Button} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../../lib/abpUtility';
import DisputesStrore from '../../../../stores/DisputesStrore';

export interface ICreateOrUpdateDahBoardDisputesDataProps {
  visible: boolean;
  modalType: string;
  onCreate: (item: any) => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;

  disputesStrore: DisputesStrore;
}

class CreateOrUpdateDahBoarddisputedata extends React.Component<ICreateOrUpdateDahBoardDisputesDataProps> {
  render() {
    const { visible, onCancel, onCreate, formRef, initialData } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const getStatusLabel = (status: number): string => {
        switch (status) {
          case 0:
            return "Open";
          case 1:
            return "Forwarded To FandC";
          case 2:
            return "Close";
          case 3:
            return "Inimated To Buyer";
          default:
            return "Unknown";
        }
      };


      

    return (
      <div>
        <Modal
          visible={visible}
          onCancel={onCancel}
          onOk={() => formRef.current?.submit()}
          title={L('Disputes')}
          width={550}
          okText="Initiate to Account"  // Change OK button text
          cancelText="Close"
          footer={[
            <Button key="ok" type="primary" onClick={() => formRef.current?.submit()}>
            Inimate To Buyer
          </Button>,
           
          ]}
        
        >
          <Form
            ref={formRef}
            initialValues={initialData}
            onFinish={onCreate}
          >
           <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label={L('SupplierName')} name="supplierName"  labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input disabled  value={initialData ? initialData.supplierName : ''}  style={{ color: 'black' }}  />
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label={L('BuyerName')} name="buyerName" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}  style={{ fontWeight: 'bold' }}>
                    <Input  disabled  value={initialData.buyerName || ''}  style={{ color: 'black' }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                <Form.Item label={L('Category Of Queries')} name="supplierRejection" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input disabled value={initialData.supplierRejection || ''} style={{  color: 'black' }}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label={L('Additional Query')} name="query" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input disabled value={initialData.query || ''} style={{  color: 'black' }}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                <Form.Item label={L('Supplementary Summary')} name="supplementarySummaryId" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input disabled value = {initialData.supplementarySummaryId} style={{  color: 'black' }}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label={L('Status')} name="status" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input disabled value={getStatusLabel(initialData.status) || ''} style={{  color: 'black' }}/>
                    </Form.Item>
                </Col>
           </Row>
           <Row gutter={16}>
                <Col span={12}>
                <Form.Item label={L('Buyer Remarks')} name="buyerRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input disabled value={initialData.buyerRemarks || ''} style={{  color: 'black' }} onChange={(e) => {
              formRef.current?.setFieldsValue({
                buyerRemarks: e.target.value,
              });
            }}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                 <Form.Item label={L('Accounts Remarks')} name="accountsRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input  value={initialData.accountsRemarks || ''} style={{  color: 'black' }}/>
                    </Form.Item>
                </Col>
           </Row>
                                                          
            
            <Form.Item label={L('Id')} name="id" {...formItemLayout} style={{ display: 'none' }}>
            <Input />
            </Form.Item>

          </Form>
        </Modal>
      </div>
    );
  }
}

export default CreateOrUpdateDahBoarddisputedata;

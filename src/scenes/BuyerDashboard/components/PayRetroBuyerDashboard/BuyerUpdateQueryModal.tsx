import React, { useState } from 'react';
import { Form, Input, Modal, Col, Row, Button  } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../../lib/abpUtility';
import DisputesStrore from '../../../../stores/DisputesStrore';
import supplementarySummariesService from '../../../../services/SupplementarySummaries/supplementarySummariesService';
import SupplierModalView from './supplierModalView';

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
    // const [tableData, setTableData] = React.useState<any[]>([]);
    // const [ setTableData] = React.useState<any[]>([]);
  const [actionType, setActionType] = useState<'forward' | 'close' | null>(null);
  const [annexuremodalData, annexuresetModalData] = React.useState<any[]>([]);
  const [modalData, setModalData] = React.useState<any[]>([]);
  const [supplementaryData, setSupplementaryData] = React.useState<any[]>([]);
  const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);
  const [ selectedRow,setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false); // To control modal visibility
    
      console.log(selectedRow)
      console.log(isModalOpen)
      console.log(setHoveredRowId)

  
    const handleRowClick = async (row: number) => {
      
      setSelectedRow(row); 
      setIsModalOpen(true);

      try {
        const result = await supplementarySummariesService.GetAllsupplementarySummarybyId(row); // Await the Promise
        console.log('ImplementationDateChange',result[0]);
        setSupplementaryData([]);
        setSupplementaryData(result[0]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const result = await supplementarySummariesService.grndata(row); // Await the Promise
        setModalData(result);
        console.log('setmodaldata',result) 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const annexureresult = await supplementarySummariesService.annexuredata(row); // Await the Promise
        annexuresetModalData(annexureresult);
        console.log('annexuresetmodaldata',annexureresult) 
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
  
  };
  

  const handleModalClose = () => {
    setIsModalOpen(false); 
    setSelectedRow(null);  
  };


  return (
    <Modal
      visible={visible}
      onCancel={onclose}
      title={L('Disputes')}
      width={550}
      footer={[
        (initialData.status!=3) && (
          <Button
            key="forward"
            type="primary"
            onClick={() => {
              setActionType('forward');
              formRef.current?.submit();
            }}
          >
            Forward to F&C
          </Button>
        ),
         
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setActionType('close');
              formRef.current?.submit();
            }}
          >
            Close
          </Button>
        ,
      ].filter(Boolean)} 
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
            <div
              onClick={() => handleRowClick(initialData.supplementarySummaryId)}
              onMouseEnter={() => setHoveredRowId(initialData.supplementarySummaryId)}
              onMouseLeave={() => setHoveredRowId(null)}
              style={{
                backgroundColor:
                  hoveredRowId === initialData.supplementarySummaryId
                    ? '#f1f1f1'
                    : Number(initialData.supplementarySummaryId) % 2 === 0
                    ? '#f9f9f9'
                    : '#fff',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '5px',
              }}
            >
              <Form.Item
                label={L('Supplementary Summary')}
                name="supplementarySummaryId"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ fontWeight: 'bold' }}
              >
                <Input disabled value={initialData.supplementarySummaryId} style={{ color: 'black' }} />
              </Form.Item>
            </div>
          </Col>
          <Col span={12}>
            <Form.Item label={L('Status')} name="status" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <Input disabled value='asedwfdwefw' style={{ color: 'black' }} />
            </Form.Item>
          </Col>
        </Row>
  
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={L('Buyer Remarks')} name="buyerRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <textarea value={initialData.buyerRemarks || ''} style={{ color: 'black' }} />
            </Form.Item>
          </Col>
          {initialData.status==3 && <Col span={12}>
            <Form.Item label={L('Accounts Remarks')} name="accountsRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }} >
              <textarea disabled value={initialData.accountsRemarks || ''} style={{ color: 'black' }} />
            </Form.Item>
          </Col>} 
        </Row>
  
        <Form.Item label={L('Id')} name="id" style={{ display: 'none' }}>
          <Input />
        </Form.Item>
      </Form>
  
      
      {isModalOpen && (
        <SupplierModalView
      
          modalData={modalData}
          annexureModalData={annexuremodalData}
          supplementaryData = {supplementaryData}
          onClose={handleModalClose}
        />
      )}
    </Modal>
  );
  
  
};
export default CreateOrUpdateDahBoardDisputedata

import React, { useState } from 'react';
import { Form, Input, Modal, Col, Row, Button,message, Tooltip  } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../../lib/abpUtility';
import DisputesStrore from '../../../../stores/DisputesStrore';
import supplementarySummariesService from '../../../../services/SupplementarySummaries/supplementarySummariesService';
import SupplierModalView from './supplierModalView';

export interface ICreateOrUpdateDahBoardDisputesDataProps {
  visible: boolean;
  setloading: (value: boolean) => void; // Expecting a function
  modalType: string;
  onCreate: (item: any) => void;
  onsubmit: (item: any) => void;
  onclose: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  disputesStrore: DisputesStrore;
  onUpdate: () => void;
}

const CreateOrUpdateDahBoardDisputedata: React.FC<ICreateOrUpdateDahBoardDisputesDataProps> = ({
  visible,
  setloading,
  onCreate,
  onsubmit,
  onclose,
  formRef,
  initialData,
  onUpdate
}) => {
    // const [tableData, setTableData] = React.useState<any[]>([]);
    // const [ setTableData] = React.useState<any[]>([]);
  const [actionType, setActionType] = useState<'forward' | 'close' | null>(null);
  const [annexuremodalData, annexuresetModalData] = React.useState<any[]>([]);
  const [modalData, setModalData] = React.useState<any[]>([]);
  const [supplementaryData, setSupplementaryData] = React.useState<any[]>([]);
  // const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);
  const [ selectedRow,setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false); // To control modal visibility
        // const [loading, setloading] = React.useState<boolean>(false);
    
      console.log(selectedRow)
      //console.log(isModalOpen)
      
      // //console.log(setHoveredRowId)

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

    
    const handleRowClick = async (row: number) => {
      
      setSelectedRow(row); 
      setIsModalOpen(true);

      try {
        const result = await supplementarySummariesService.GetAllsupplementarySummarybyId(row); // Await the Promise
        //console.log('ImplementationDateChange',result[0]);
        setSupplementaryData([]);
        setSupplementaryData(result[0]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const result = await supplementarySummariesService.grndata(row); // Await the Promise
        setModalData(result);
        //console.log('setmodaldata',result) 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const annexureresult = await supplementarySummariesService.annexuredata(row); // Await the Promise
        annexuresetModalData(annexureresult);
        //console.log('annexuresetmodaldata',annexureresult) 
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
  
  };
  

  const handleModalClose = () => {
    setIsModalOpen(false); 
    setSelectedRow(null);  
  };

  
    const handleIntimateToFandC = async () => {
    
  
    Modal.confirm({
      title: 'Are you sure? You want to forward the Query to F&C?',
      onOk: async () => {
        try {
          
          
          setloading(true);           
          setActionType('forward'); // Set action type before submitting
          await formRef.current?.submit();
          setIsModalOpen(false);
          await onUpdate(); 
        } catch (error) {
          console.error('Error when forwarding query:', error);
          message.error('Failed to Forward the query to F&C');
        } 
        finally {
           
          //setloading(false); 
        }
      },
      
    });
    };
    const handleQueryClose = async () => {
    // const { setloading } = this.props; // Access setloading from props
  
    Modal.confirm({
      title: 'Are you sure? You want to close the Query?',
      onOk: async () => {
        try {
          setloading(true);          
          setActionType('close'); // Set action type before submitting
          await formRef.current?.submit();
          setIsModalOpen(false); 
          // setloading(true);
          await onUpdate();
        } catch (error) {
          console.error('Error when closing query:', error);
          message.error('Failed to close the query');
        }
        finally {
        //  setloading(false); 
        }
      },

    });
    };

  return (
  <div>
    
  <div>
    <Modal  
      visible={visible}
      onCancel={onclose}
      // onOk={() => formRef.current?.submit()}
      title={L('Queries')}
      width={550}
      footer={[
        <div key="footer-buttons" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {/* Left-aligned button */}
          <Tooltip title="Click here to view the contract details">
            <Button
              key="viewDetails"
              type="default"
              onClick={() => handleRowClick(initialData.supplementarySummaryId)}
            >
              View Contract Details
            </Button>
          </Tooltip>
      
          {/* Right-aligned buttons */}
          <div>
            {initialData?.status !== 3 && (
              <Button
                key="forward"
                type="primary"
                onClick={handleIntimateToFandC} // Call the new function
              >
                Forward to F&C
              </Button>
            )}
      
            <Button
              key="close"
              type="primary"
              onClick={handleQueryClose}
            >
              Close
            </Button>
          </div>
        </div>
      ]}
      
    >
      <Form
        ref={formRef}
        initialValues={{...initialData,status: getStatusLabel(initialData.status) }}
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
            <Form.Item label={L('Status')} name="status" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <Input disabled style={{ color: 'black' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={L('Buyer Remarks')} name="buyerRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
              <textarea value={initialData.buyerRemarks || ''} style={{                       
                border: '1px solid #d9d9d9',
                      borderRadius: '5px',
                      padding: '4px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease',  }} 
                      
                      onFocus={(e) => {
                        e.currentTarget.style.border = '1px solid #5097AB';
                        e.currentTarget.style.boxShadow = '0 0 5px #5097AB';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = '1px solid #d9d9d9';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      />
            </Form.Item>
          </Col>


        </Row>
  
        <Row gutter={16}>
        
{initialData?.status === 3 && (
  <Col span={12}>
    <Form.Item
      label={L('Accounts Remarks')}
      name="accountsRemarks"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      style={{ fontWeight: 'bold' }}
    >
      <Input disabled value={initialData.accountsRemarks || ''} style={{ color: 'black' }} />
    </Form.Item>
  </Col>
)}
          <Col span={12}>
          <Form.Item
                label={L('Supplementary Summary')}
                name="supplementarySummaryId"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ fontWeight: 'bold' ,display:"none"}}
              >
                <Input disabled value={initialData.supplementarySummaryId} style={{ color: 'black' }} /> 
             </Form.Item>
          </Col>
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
    </div>
  
</div>
);
  
};
export default CreateOrUpdateDahBoardDisputedata

import * as React from 'react';
import { Form, Input, Modal,Col,Row,Button, Tooltip, message, Spin} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../../lib/abpUtility';
import DisputesStrore from '../../../../stores/DisputesStrore';
import supplementarySummariesService from '../../../../services/SupplementarySummaries/supplementarySummariesService';
import SupplierModalView from './supplierModalView';

export interface ICreateOrUpdateDahBoardDisputesDataProps {
  visible: boolean;
  modalType: string;
  onCreate: (item: any) => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;

  disputesStrore: DisputesStrore;
}

const CreateOrUpdateDahBoarddisputedata: React.FC<ICreateOrUpdateDahBoardDisputesDataProps> =({

  visible,
  modalType,
  onCreate,
  onCancel,
  formRef,
  initialData,
}) => {

    const [annexuremodalData, annexuresetModalData] = React.useState<any[]>([]);
    const [modalData, setModalData] = React.useState<any[]>([]);
    const [supplementaryData, setSupplementaryData] = React.useState<any[]>([]);
    // const [hoveredRowId, setHoveredRowId] = React.useState<number | null>(null);
    const [ selectedRow,setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
    // const [ setSelectedRow] = React.useState<any | null>(null); // To manage selected row for modal
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false); // To control modal visibility
    const [loading, setloading] = React.useState<boolean>(false);

    console.log(selectedRow)
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

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
    // if ((e.target as HTMLElement).tagName !== 'INPUT') {
    setSelectedRow(row); // Set the clicked row data
    setIsModalOpen(true); // Open the modal

    try {
      const result = await supplementarySummariesService.GetAllsupplementarySummarybyId(row); // Await the Promise
      console.log('ImplementationDateChange',result[0]);
      setSupplementaryData([]);
      setSupplementaryData(result[0]);
      // console.log('SupplementaryData',result) // Assuming the result contains the data in 'data' field
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const result = await supplementarySummariesService.grndata(row); // Await the Promise
      setModalData(result);
      console.log('setmodaldata',result) // Assuming the result contains the data in 'data' field
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    try {
      const annexureresult = await supplementarySummariesService.annexuredata(row); // Await the Promise
      annexuresetModalData(annexureresult);
      console.log('annexuresetmodaldata',annexureresult) // Assuming the result contains the data in 'data' field
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  // } 
};
//const { Item } = Form;

const handleModalClose = () => {
  setIsModalOpen(false); // Close the modal
  setSelectedRow(null);  // Clear the selected row data
};

  const handleIntimateToBuyer = async () => {
  // const { setloading } = this.props; // Access setloading from props

  Modal.confirm({
    title: 'Are you sure? You want to Intimate the Buyer?',
    onOk: async () => {
      try {
        // Optionally, you can set action type or other logic before submitting
        await formRef.current?.submit();
        setloading(true); // Set loading to true before operation
        message.success('Intimated to Buyer');
      } catch (error) {
        console.error('Error when Intimated the Buyer:', error);
        message.error('Failed to Intimate the Buyer');
      } 
      finally {
        setloading(false); // Set loading to false after operation completes
      }
    },
    onCancel() {
      console.log('Cancel');
    },
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
          visible={visible}
          onCancel={onCancel}
          onOk={() => formRef.current?.submit()}
          title={L('Disputes')}
          width={550}
          okText="Initiate to Account"  // Change OK button text
          cancelText="Close"
          footer={[
          <div key="footer-buttons" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Tooltip title="Click here to view the contract details" key="view-details">
            <Button
              key="viewDetails"
              type="default"
              onClick={() => {
                // Call your function to load contract details using the supplementary summary id
                handleRowClick(initialData.supplementarySummaryId);
              }}
            >
              View Contract Details
            </Button>
          </Tooltip>
          <Button
                key="ok"
                type="primary"
                onClick={handleIntimateToBuyer} // Call the new function
              >
                Intimate To Buyer
              </Button>
          </div>
           
          ]}
        
        >
          <Form
            ref={formRef}
            initialValues={{...initialData,status: getStatusLabel(initialData.status) }}
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
                <Form.Item label={L('Status')} name="status" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input disabled  style={{  color: 'black' }}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label={L('Buyer Remarks')} name="buyerRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' }}>
                    <Input disabled value={initialData.buyerRemarks || ''} style={{  color: 'black' }} onChange={(e) => {
              formRef.current?.setFieldsValue({
                buyerRemarks: e.target.value,
              });
            }}/>
                    </Form.Item>
                </Col>


           </Row>
           <Row gutter={16}>

                <Col span={12}>
                 <Form.Item label={L('Accounts Remarks')} name="accountsRemarks" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} 
                 style={{ fontWeight: 'bold', // Smooth transition
                  }}>
                    <textarea  value={initialData.accountsRemarks || ''} style={{  
                      border: '1px solid #d9d9d9',
                      // borderRadius: '5px',
                      padding: '4px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease', }}
                      
                      onFocus={(e) => {
                        e.currentTarget.style.border = '1px solid #3cb48c';
                        e.currentTarget.style.boxShadow = '0 0 5px #3cb48c';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = '1px solid #d9d9d9';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      />
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label={L('Supplementary Summary')} name="supplementarySummaryId" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} style={{ fontWeight: 'bold' ,display:'none'}} >
                    <Input disabled value = {initialData.supplementarySummaryId} style={{  color: 'black' }}/>
                    </Form.Item>
                </Col>
           </Row>
                                                          
            
            <Form.Item label={L('Id')} name="id" {...formItemLayout} style={{ display: 'none' }}>
            <Input />
            </Form.Item>

          </Form>
                {/* Supplier Modal inside the same Modal */}
      {isModalOpen && (
        <SupplierModalView
          // selectedRow={selectedRow}
          modalData={modalData}
          annexureModalData={annexuremodalData}
          supplementaryData = {supplementaryData}
          onClose={handleModalClose}
          />
        )}
      </Modal>
    </div>
  ) : (
    Loading()
  )}
</div>
);
}

export default CreateOrUpdateDahBoarddisputedata;

import React, { useEffect } from 'react';
import { Form, Input, Modal,Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';

interface ICreateOrUpdateDahBoardDisputesDataProps {
  visible: boolean;
  modalType: string;
  onCreate: (item: any) => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData: {
    buyerName: string;
    supplierName: string;
  };
  disputesStrore: any; // Replace `any` with the correct type for `DisputesStrore`
}



const CreateOrUpdateDahBoardDisputesData: React.FC<ICreateOrUpdateDahBoardDisputesDataProps> = ({
  visible,
  onCreate,
  onCancel,
  formRef,
  initialData,
  disputesStrore,
}) => {
  const [rejectionData, setRejectionData] = React.useState<any[]>([]);
  

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!disputesStrore) {
        console.error('disputesStore is undefined');
        return;
      }

      try {
        const [rejections] = await Promise.all([
          
          disputesStrore.getAllsupplierrejectionForLookupTable({ skipCount: 0, maxResultCount: 10 }),
        ]);

        
        setRejectionData(rejections?.items || []);
      } catch (error) {
        console.error('Error fetching lookup data:', error);
      }
    };

    fetchData();
  }, [disputesStrore]);

  

  return (
    <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Disputes')} width={550}>
      <Form ref={formRef} initialValues={initialData}>
      <Form.Item label={L('BuyerName')} name="buyerName" {...formItemLayout}  >
              <Input disabled value={initialData ? initialData.buyerName : ''} style={{color:'#000000D9'}}/>
            </Form.Item>   
            <Form.Item label={L('Supplier Code')} name="supplierName" {...formItemLayout} >
              <Input  disabled value={initialData ? initialData.supplierName : ''} style={{color:'#000000D9'}}/>
            </Form.Item>
        
        <Form.Item label={L('Query')} name="SupplierRejectionId" {...formItemLayout}>
            <Select
                placeholder={L('Select Query')}
                onChange={(value) => {
                const selectedOption = rejectionData.find((option) => option.id === value);
                console.log(selectedOption);
                
                formRef.current?.setFieldsValue({ rejectionId: value });
                }}
            >
                {rejectionData.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                    {item.displayName}
                </Select.Option>
                ))}
            </Select>                   
            </Form.Item>
        <Form.Item label={L('Additional Query')} name={'query'} {...formItemLayout}>
              <textarea/>
            </Form.Item> 
            <Form.Item label={L('SupplementarySummaryId')} name={'supplementarySummaryId'} {...formItemLayout} style={{ display: 'none' }}>
            <Input />
            </Form.Item>

            <Form.Item label={L('Id')} name={'id'} {...formItemLayout} style={{ display: 'none' }}>
            <Input />
            </Form.Item>
      </Form>

      
    </Modal>
  );
};

export default CreateOrUpdateDahBoardDisputesData;

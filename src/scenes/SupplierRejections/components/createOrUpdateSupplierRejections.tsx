import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
import supplierRejectionStore from '../../../stores/supplierRejectionStore';

export interface ICreateOrUpdateSupplierRejectionsProps {
  visible: boolean;
  modalType: string;
  onCreate: () => void;
  onCancel: () => void;
  formRef: React.RefObject<FormInstance>;
  initialData?: any;
  supplierRejectionStore: supplierRejectionStore;
}

class CreateOrUpdateSupplierRejections extends React.Component<ICreateOrUpdateSupplierRejectionsProps> {
  
  // Fetch data from the store when component mounts
  pagedFilterAndSortedRequest = {
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name',
    keyword:''
  };
  render() {
    

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { visible, onCancel, onCreate, formRef } = this.props;
    return (
      <div>
        <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('SupplementarySummaries')} width={550}>
          <Form ref={formRef}>      
            <Form.Item label={L('Code')} name={'code'} {...formItemLayout}>
              <Input/>
            </Form.Item>
            <Form.Item label={L('Description')} name={'description'} {...formItemLayout}>
              <Input/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default CreateOrUpdateSupplierRejections;
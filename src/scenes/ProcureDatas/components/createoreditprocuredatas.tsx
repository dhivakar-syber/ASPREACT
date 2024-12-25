import * as React from 'react';

import {Form, Input, Modal,DatePicker, } from 'antd';

import { FormInstance } from 'antd/lib/form';
import { L } from '../../../lib/abpUtility';
//import rules from './createOrUpdateTenant.validation';

export interface ICreateOrEditProcureProps {
 visible: boolean;
  onCancel: () => void;
  modalType: string;
  onCreate: () => void;
  //roles: GetRoles[];
  formRef: React.RefObject<FormInstance>;
  initialData?:any;
}

class CreateOrEditProcureDatas extends React.Component<ICreateOrEditProcureProps> {
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
        md: { span: 6 },
        lg: { span: 6 },
        xl: { span: 6 },
        xxl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
        md: { span: 18 },
        lg: { span: 18 },
        xl: { span: 18 },
        xxl: { span: 18 },
      },
    };

    const { visible, onCancel, onCreate, formRef } = this.props;

    return (
      <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Crerate ProcureData')} width={550}>
        <Form ref={formRef}>   
            
          <Form.Item label={L('PartPartNo')} name={'partPartNo'}  {...formItemLayout}>
            <Input />
          </Form.Item>
          <Form.Item label={L('Buyer')} name={'buyerName'}  {...formItemLayout}>
            <Input />
          </Form.Item>         
            <Form.Item label={L('ValidFrom')} name={'validFrom'}  {...formItemLayout}>
              <DatePicker />
            </Form.Item>         
          {this.props.modalType === 'edit' ? (
            <Form.Item label={L('ValidTo')} name={'validTo'} {...formItemLayout}>
              <DatePicker />
            </Form.Item>
          ) : null}
          <Form.Item label={L('ContractNo')} name={'contractNo'}  {...formItemLayout}>
            <Input />
          </Form.Item>
          <Form.Item label={L('ContractDate')} name={'contractDate'}  {...formItemLayout}>
            <DatePicker />
          </Form.Item>
          <Form.Item label={L('ApprovalDate')} name={'approvalDate'}  {...formItemLayout}>
            <DatePicker />
          </Form.Item>
          <Form.Item label={L('PlantCode')} name={'plantCode'}  {...formItemLayout}>
            <Input />
          </Form.Item>
          <Form.Item label={L('VersionNo')} name={'versionNo'}  {...formItemLayout}>
            <Input />
          </Form.Item>
                    
        </Form>
      </Modal>
    );
  }
}

export default CreateOrEditProcureDatas;

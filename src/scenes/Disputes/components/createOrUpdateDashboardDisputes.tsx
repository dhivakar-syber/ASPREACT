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

// type LookupItem = {
//   id: number;
//   displayName: string;
// };

const CreateOrUpdateDahBoardDisputesData: React.FC<ICreateOrUpdateDahBoardDisputesDataProps> = ({
  visible,
  onCreate,
  onCancel,
  formRef,
  initialData,
  disputesStrore,
}) => {
  const [rejectionData, setRejectionData] = React.useState<any[]>([]);
  // const [supplierData, setSupplierData] = useState<LookupItem[]>([]);
  // const [buyerData, setBuyerData] = useState<LookupItem[]>([]);
  // const [summariesData, setSummariesData] = useState<LookupItem[]>([]);
  // const [visibleLookup, setVisibleLookup] = useState({
  //   summaries: false,
  //   supplier: false,
  //   buyer: false,
  // });
  // const [selectedLookupItem, setSelectedLookupItem] = useState<{
  //   summaries: LookupItem | null;
  //   supplier: LookupItem | null;
  //   buyer: LookupItem | null;
  // }>({
  //   summaries: null,
  //   supplier: null,
  //   buyer: null,
  // });

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

  // const handleSelect = (type: 'summaries' | 'supplier' | 'buyer', item: LookupItem) => {
  //   setSelectedLookupItem((prev) => ({ ...prev, [type]: item }));
  //   setVisibleLookup((prev) => ({ ...prev, [type]: false }));

  //   // Update form field values
  //   const fieldMap: Record<string, string> = {
  //     summaries: 'summaries',
  //     supplier: 'supplierName',
  //     buyer: 'buyerName',
  //   };
  //   formRef.current?.setFieldsValue({
  //     [fieldMap[type]]: item.displayName,
  //     [`${fieldMap[type]}Id`]: item.id,
  //   });
  // };

  // const columns = (type: 'summaries' | 'supplier' | 'buyer') => [
  //   { title: 'ID', dataIndex: 'id', key: 'id' },
  //   { title: 'Name', dataIndex: 'displayName', key: 'displayName' },
  //   {
  //     title: 'Action',
  //     key: 'action',
  //     render: (_: any, record: LookupItem) => (
  //       <Button onClick={() => handleSelect(type, record)}>Select</Button>
  //     ),
  //   },
  // ];

  return (
    <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title={L('Disputes')} width={550}>
      <Form ref={formRef} initialValues={initialData}>
      <Form.Item label={L('BuyerName')} name="buyerName" {...formItemLayout}  >
              <Input disabled value={initialData ? initialData.buyerName : ''} style={{color:'#000000D9'}}/>
            </Form.Item>   
            <Form.Item label={L('SupplierName')} name="supplierName" {...formItemLayout} >
              <Input  disabled value={initialData ? initialData.supplierName : ''} style={{color:'#000000D9'}}/>
            </Form.Item>
        {/* <Form.Item label={L('Summaries')} name="summaries">
          <Input readOnly onClick={() => setVisibleLookup((prev) => ({ ...prev, summaries: true }))} />
        </Form.Item> */}
        <Form.Item label={L('Rejection')} name="SupplierRejectionId" {...formItemLayout}>
            <Select
                placeholder={L('Select Rejection')}
                onChange={(value) => {
                const selectedOption = rejectionData.find((option) => option.id === value);
                console.log(selectedOption);
                //({ selectedRejectionLookupItem: selectedOption });
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
        <Form.Item label={L('Query')} name={'query'} {...formItemLayout}>
              <Input/>
            </Form.Item> 
            <Form.Item label={L('SupplementarySummaryId')} name={'supplementarySummaryId'} {...formItemLayout} style={{ display: 'none' }}>
            <Input />
            </Form.Item>

            <Form.Item label={L('Id')} name={'id'} {...formItemLayout} style={{ display: 'none' }}>
            <Input />
            </Form.Item>
      </Form>

      {/* Lookup Modals */}
      {/* <Modal
        visible={visibleLookup.summaries}
        title={L('Select Summary')}
        footer={null}
        onCancel={() => setVisibleLookup((prev) => ({ ...prev, summaries: false }))}
      >
        <Table dataSource={summariesData} columns={columns('summaries')} rowKey="id" />
      </Modal>
      <Modal
        visible={visibleLookup.supplier}
        title={L('Select Supplier')}
        footer={null}
        onCancel={() => setVisibleLookup((prev) => ({ ...prev, supplier: false }))}
      >
        <Table dataSource={supplierData} columns={columns('supplier')} rowKey="id" />
      </Modal>
      <Modal
        visible={visibleLookup.buyer}
        title={L('Select Buyer')}
        footer={null}
        onCancel={() => setVisibleLookup((prev) => ({ ...prev, buyer: false }))}
      >
        <Table dataSource={buyerData} columns={columns('buyer')} rowKey="id" />
      </Modal> */}
    </Modal>
  );
};

export default CreateOrUpdateDahBoardDisputesData;

import { L } from '../../../lib/abpUtility';

const rules = {
  name: [{ required: true, message: L('This Field is Required') }],
  displayName: [{ required: true, message: L('This Field is Required') }]
};

export default rules;

import { L } from '../../../lib/abpUtility';

const rules = {
  tenancyName: [{ required: true, message: L('This Field is Required') }],
  name: [{ required: true, message: L('This Field is Required') }],
  adminEmailAddress: [
    { required: true, message: L('This Field is Required') },
    {
      type: 'email',
      message: 'The input is not valid E-mail!',
    }
  ],
};

export default rules;

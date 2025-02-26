import { L } from '../../lib/abpUtility';

const rules = {
  userNameOrEmailAddress: [
    {
      required: true,
      message: L('This Field is Required'),
    },
  ],
  password: [{ required: true, message: L('This Field is Required') }],
};

export default rules;

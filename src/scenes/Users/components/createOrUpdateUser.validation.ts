import { L } from '../../../lib/abpUtility';

const rules = {
  name: [{ required: true, message: L('This Field is Required') }],
  surname: [{ required: true, message: L('This Field is Required') }],
  userName: [{ required: true, message: L('This Field is Required') }],
  emailAddress: [
    { required: true, message: L('This Field is Required') },
    {
      type: 'email',
      message: 'The input is not valid E-mail!',
    },
  ],
};

export default rules;

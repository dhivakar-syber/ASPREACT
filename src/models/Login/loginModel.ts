import { observable } from 'mobx';

class LoginModel {
  tenancyName!: string;
  userNameOrEmailAddress!: string;
  password!: string;
  @observable rememberMe!: boolean;
  @observable showModal!: boolean;

  toggleRememberMe = (checked: boolean) => {
    this.rememberMe = checked;
  };

  toggleShowModal = () => {
    this.showModal = !this.showModal;
  };
}

export default LoginModel;

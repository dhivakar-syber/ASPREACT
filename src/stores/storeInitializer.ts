import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import CBFCDataStore from './cbfcdataStore';
import ProcureStore from './procuredatastore';
import SupplierStore from './supplierStore';
import disputeStore from './disputeStore';

export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    tenantStore: new TenantStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    cbfcdataStore: new CBFCDataStore(),
    procureStore: new ProcureStore(),
    supplierStore:new SupplierStore(),
    disputeStore:new disputeStore(),
  };
}

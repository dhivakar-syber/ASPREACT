import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import CBFCDataStore from './cbfcdataStore';
import GRNDataStore from './grndataStore';
import ProcureStore from './procuredatastore';
import SupplementarySummariesStore from './supplementarySummariesStore';
import FileMasterStore from './fileMasterStore';



export default function initializeStores() {
  return {
    authenticationStore: new AuthenticationStore(),
    roleStore: new RoleStore(),
    tenantStore: new TenantStore(),
    userStore: new UserStore(),
    sessionStore: new SessionStore(),
    accountStore: new AccountStore(),
    cbfcdataStore: new CBFCDataStore(),
    grndataStore: new GRNDataStore(),
    procureStore: new ProcureStore(),
    supplementarySummariesStore: new SupplementarySummariesStore(),
    filemasterStore: new FileMasterStore(),

  };
}

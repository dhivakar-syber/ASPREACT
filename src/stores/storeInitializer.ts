import RoleStore from './roleStore';
import TenantStore from './tenantStore';
import UserStore from './userStore';
import SessionStore from './sessionStore';
import AuthenticationStore from './authenticationStore';
import AccountStore from './accountStore';
import CBFCDataStore from './cbfcdataStore';
import GRNDataStore from './grndataStore';
import ProcureStore from './procuredatastore';
import BuyerStore from './buyerstore';
import SupplementarySummariesStore from './supplementarySummariesStore';
import FileMasterStore from './fileMasterStore';
import AnnexureDetailsStore from './annexureDetailsStore';
import PartsStore from './partsStore';
import PlantsStore from './PlantStore';
import SupplierRaisedQueryStore from './supplierRaisedQueryStore';
import SupplierRejectionStore from './supplierRejectionStore';
import DisputesStore from './DisputesStrore';
import ApprovalWorkflowStore from './approvalWorkflowStore';
import SupplierStore from './supplierStore';






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
    buyerStore: new BuyerStore(),
    supplierStore: new SupplierStore(),


    supplementarySummariesStore: new SupplementarySummariesStore(),
    filemasterStore: new FileMasterStore(),
    annexureDetailsStore: new AnnexureDetailsStore(),
    partsStore: new PartsStore(),
    plantsStore: new PlantsStore(),
    supplierRaisedQueryStore: new SupplierRaisedQueryStore(),
    supplierRejectionStore: new SupplierRejectionStore(),
    disputesStore: new DisputesStore(),
    approvalWorkflowStore: new ApprovalWorkflowStore(),
  };
}


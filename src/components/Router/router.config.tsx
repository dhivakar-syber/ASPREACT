import LoadableComponent from '../Loadable/index';
import React from 'react';
import { HomeOutlined, UserOutlined, TagsOutlined, AppstoreOutlined, ShoppingCartOutlined, DatabaseFilled, SnippetsFilled, FileFilled, SettingOutlined, GlobalOutlined, DiffFilled, QuestionCircleOutlined, DeleteOutlined, WarningOutlined, StarOutlined,} from '@ant-design/icons';
import SupplierSvg from '../../images/Frame.svg';
import AccountsSvg from '../../images/Accounts.svg';
import BuyerSvg from '../../images/Buyer.svg';

const SupplierIcon = () => (
  <span role="img" aria-label="home" className="anticon">
  <img src={SupplierSvg} alt="Supplier Dashboard" />
  </span>
);

const BuyerIcon = () => (
  <span role="img" aria-label="home" className="anticon">
  <img src={BuyerSvg} alt="Buyer Dashboard" />
  </span>
);

const AccountsIcon = () => (
  <span role="img" aria-label="home" className="anticon">
  <img src={AccountsSvg} alt="Accounts Dashboard" />
  </span>
);
export const userRouter: any = [
  {
    path: '/user',
    name: 'user',
    title: 'User',
    component: LoadableComponent(() => import('../Layout/UserLayout')),
    isLayout: true,
    showInMenu: false,
  },
  // {
  //   path: '/user/login',
  //   name: 'login',
  //   title: 'LogIn',
  //   component: () => {
  //     window.location.replace('https://www.digitalsupplychain.bharatbenz.com/dicvscar/DaimDISC/#/login');
  //     return null;
  //   },
  //   showInMenu: false,
  // },
  {
    path: '/user/login',
    name: 'login',
    title: 'LogIn',
    // component: LoadableComponent(() => import('../../scenes/Login')),
    component: () => {
      window.location.replace('https://www.digitalsupplychain.bharatbenz.com/dicvscar/DaimDISC/#/login');
      // window.location.replace('https://www.digitalsupplychain-qa.bharatbenz.com/dicvscar/DaimDISC/#/login');
       return null;
   },
    showInMenu: false,
  },
];

export const discRoute: any =[
{
  
    path: '/fetchData', 
    name: 'fetchData',
    title: 'Fetch Data',
    permission: '',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/DiscRoute')), 
  

}

];

export const appRouters: any = [
  {
    path: '/',
    exact: true,
    name: 'home',
    permission: '',
    title: 'Home',
    component: LoadableComponent(() => import('../Layout/AppLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/backgroundJobsDashboard',
    name: 'dashboard',
    permission: 'Pages.Administration.BackgroundJobs',
    title: 'Background Jobs Dashboard',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/BackgroundJobDashboard')),
  },
  {
    path: '/l4dashboard',
    name: 'L4 & L3 Dashboard',
    permission: 'Pages.SectionHead.Dashboard',
    title: 'L4 & L3 Dashboard',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/L3 & L4 Dashboard')),
  },
  {
    path: '/SQLqueryExecution',
    name: 'SQL Window',
    permission: 'Pages.Administration.SQLExecutor',
    title: 'SQL Window',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/SQLqueryExecution')),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    permission: 'Pages.Tenant.Dashboard',
    title: 'Supplier Dashboard',
    icon: SupplierIcon,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Dashboard')),
  },
  {
    path: '/buyerdashboard',
    name: 'buyerdashboard',
    permission: 'Pages.Buyer.Dashboard',
    title: 'Buyer Dashboard',
    icon: BuyerIcon,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/BuyerDashboard')),
  },
  {
    path: '/accountsdashboard',
    name: 'accountsdashboard',
    permission: 'Pages.Accounts.Dashboard',
    title: 'Accounts Dashboard',
    icon: AccountsIcon,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Accounts Dashboard')),
  },
  {
    path: '/users',
    permission: 'Pages.Administration.Users',
    title: 'Users',
    name: 'user',
    icon: UserOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Users')),
  },
  {
    path: '/roles',
    permission: 'Pages.Administration.Roles',
    title: 'Roles',
    name: 'role',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Roles')),
  },
  {
    path: '/Buyers',
    permission: 'Pages.Administration.Buyers',
    title: 'Buyers',
    name: 'buyer',
    icon: ShoppingCartOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Buyers')),
  },
  {
    path: '/CBFCdatas',
    permission: 'Pages.Administration.CBFCdatas',
    title: 'CBFCdatas',
    name: 'cbfcdatas',
    icon: DatabaseFilled,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/CBFCdatas')),
  },
  {
    path: '/GRNdatas',
    permission: 'Pages.Administration.GRNMasters',
    title: 'GRNdatas',
    name: 'grndatas',
    icon: DatabaseFilled,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/GRNdatas')),
  },
  {
    path: '/Suppliers',
    permission: 'Pages.Administration.Suppliers',
    title: 'Suppliers',
    name: 'supplier',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Suppliers')),
  },
  {
    path: '/procuredatas',
    name: 'procuredatas',
    permission: 'Pages.Administration.ProcureDatas',
    title: 'ProcureDatas',
    icon: DatabaseFilled,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/ProcureDatas')),
  },
  {
    path: '/SupplementarySummaries',
    name: 'SupplementarySummaries',
    permission: 'Pages.Administration.SupplementarySummaries',
    title: 'SupplementarySummaries',
    icon: SnippetsFilled,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/SupplementarySummaries')),
  },
  {
    path: '/FileMasters',
    name: 'FileMasters',
    permission: 'Pages.Administration.FileMasters',
    title: 'FileMasters',
    icon: FileFilled,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/FileMaster')),
  },
  {
    path: '/Parts',
    name: 'Parts',
    permission: 'Pages.Administration.Parts',
    title: 'Parts',
    icon: SettingOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Parts')),
  },

  {
    path: '/Plants',
    name: 'Plants',
    permission: 'Pages.Administration.Plants',
    title: 'Plants',
    icon: GlobalOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Plant')),
  },
  
{
    path: '/AnnexureDetails',
    name: 'AnnexureDetails',
    permission: 'Pages.Administration.AnnexureDetails',
    title: 'AnnexureDetails',
    icon: DiffFilled,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/AnnexureDetails')),
  },
  {
    path: '/SupplierRaisedQueries',
    name: 'SupplierRaisedQueries',
    permission: 'Pages.Administration.SupplierRaisedQueries',
    title: 'SupplierRaisedQueries',
    icon: QuestionCircleOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/SupplierRaisedQueries')),
  },
  {
    path: '/SupplierRejections',
    name: 'SupplierRejections',
    permission: 'Pages.Administration.SupplierRejections',
    title: 'SupplierRejections',
    icon: DeleteOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/SupplierRejections')),
  },

  {
    path: '/Queries',
    name: 'Queries',
    permission: 'Pages.Administration.Disputes',
    title: 'Queries',
    icon: WarningOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Disputes')),
  },
  {
    path: '/ApprovalWorkflows',
    name: 'ApprovalWorkflows',
    permission: 'Pages.Administration.ApprovalWorkflows',
    title: 'ApprovalWorkflows',
    icon: StarOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/ApprovalWorkflows')),
  },
  
  {
    path: '/tenants',
    permission: 'Pages.Tenants',
    title: 'Tenants',
    name: 'tenant',
    icon: AppstoreOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Tenants')),
  },
  // {
  //   path: '/about',
  //   permission: '',
  //   title: 'About',
  //   name: 'about',
  //   icon: InfoCircleOutlined,
  //   showInMenu: true,
  //   component: LoadableComponent(() => import('../../scenes/About')),
  // },
  {
    path: '/logout',
    permission: '',
    title: 'Logout',
    name: 'logout',
    showInMenu: false,
    component: LoadableComponent(() => import('../Logout')),
  },
  {
    path: '/exception?:type',
    permission: '',
    title: 'exception',
    name: 'exception',
    showInMenu: false,
    component: LoadableComponent(() => import('../../scenes/Exception')),
  },
  
];

export const routers = [...userRouter, ...appRouters, ...discRoute];

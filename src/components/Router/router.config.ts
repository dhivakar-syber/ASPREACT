import LoadableComponent from './../Loadable/index';
import { HomeOutlined, UserOutlined, TagsOutlined, AppstoreOutlined, InfoCircleOutlined } from '@ant-design/icons';

export const userRouter: any = [
  {
    path: '/user',
    name: 'user',
    title: 'User',
    component: LoadableComponent(() => import('../../components/Layout/UserLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/user/login',
    name: 'login',
    title: 'LogIn',
    component: LoadableComponent(() => import('../../scenes/Login')),
    showInMenu: false,
  },
];

export const appRouters: any = [
  {
    path: '/',
    exact: true,
    name: 'home',
    permission: '',
    title: 'Home',
    component: LoadableComponent(() => import('../../components/Layout/AppLayout')),
    isLayout: true,
    showInMenu: false,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    permission: '',
    title: 'Supplier Dashboard',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Dashboard')),
  },
  {
    path: '/buyerdashboard',
    name: 'buyerdashboard',
    permission: '',
    title: 'Buyer Dashboard',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/BuyerDashboard')),
  },
  {
    path: '/accountsdashboard',
    name: 'accountsdashboard',
    permission: '',
    title: 'Accounts Dashboard',
    icon: HomeOutlined,
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
    path: '/CBFCdatas',
    permission: 'Pages.Administration.CBFCdatas',
    title: 'CBFCdatas',
    name: 'cbfcdatas',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/CBFCdatas')),
  },
  {
    path: '/GRNdatas',
    permission: 'Pages.Administration.GRNMasters',
    title: 'GRNdatas',
    name: 'grndatas',
    icon: TagsOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/GRNdatas')),
  },
  {
    path: '/procuredatas',
    name: 'procuredatas',
    permission: 'Pages.Administration.ProcureDatas',
    title: 'ProcureDatas',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/ProcureDatas')),
  },
  {
    path: '/SupplementarySummaries',
    name: 'SupplementarySummaries',
    permission: 'Pages.Administration.SupplementarySummaries',
    title: 'SupplementarySummaries',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/SupplementarySummaries')),
  },
  {
    path: '/FileMasters',
    name: 'FileMasters',
    permission: 'Pages.Administration.FileMasters',
    title: 'FileMasters',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/FileMaster')),
  },
  {
    path: '/Parts',
    name: 'Parts',
    permission: 'Pages.Administration.Parts',
    title: 'Parts',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Parts')),
  },

  {
    path: '/Plants',
    name: 'Plants',
    permission: 'Pages.Administration.Plants',
    title: 'Plants',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Plant')),
  },
  
{
    path: '/AnnexureDetails',
    name: 'AnnexureDetails',
    permission: 'Pages.Administration.AnnexureDetails',
    title: 'AnnexureDetails',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/AnnexureDetails')),
  },
  {
    path: '/SupplierRaisedQueries',
    name: 'SupplierRaisedQueries',
    permission: 'Pages.Administration.SupplierRaisedQueries',
    title: 'SupplierRaisedQueries',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/SupplierRaisedQueries')),
  },
  {
    path: '/SupplierRejections',
    name: 'SupplierRejections',
    permission: 'Pages.Administration.SupplierRejections',
    title: 'SupplierRejections',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/SupplierRejections')),
  },

  {
    path: '/Disputes',
    name: 'Disputes',
    permission: 'Pages.Administration.Disputes',
    title: 'Disputes',
    icon: HomeOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/Disputes')),
  },
  {
    path: '/ApprovalWorkflows',
    name: 'ApprovalWorkflows',
    permission: 'Pages.Administration.ApprovalWorkflows',
    title: 'ApprovalWorkflows',
    icon: HomeOutlined,
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
  {
    path: '/about',
    permission: '',
    title: 'About',
    name: 'about',
    icon: InfoCircleOutlined,
    showInMenu: true,
    component: LoadableComponent(() => import('../../scenes/About')),
  },
  {
    path: '/logout',
    permission: '',
    title: 'Logout',
    name: 'logout',
    showInMenu: false,
    component: LoadableComponent(() => import('../../components/Logout')),
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

export const routers = [...userRouter, ...appRouters];

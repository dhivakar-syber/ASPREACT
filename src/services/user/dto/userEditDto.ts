import {IPassivable} from './IPassivable'

export interface UserEditDto extends IPassivable {
    // Nullable ID property for user creation or update
    id?: number | null;
    roleType:number;
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    phoneNumber?: string; 
    password?: string; 
    
    isActive: boolean;
    shouldChangePasswordOnNextLogin: boolean;
    isTwoFactorEnabled: boolean;
    isLockoutEnabled: boolean;
  }
  
import { EnumMovementType } from '../../../enum' //ts2307

export interface CreateOrEditGRNdataDto { 
  description:string;
  invoiceNo:string;
  invoiceDate:string;
  quantity:number;
  year:number;
  partId:number;
  supplierId:number;
  buyerId:number;
    id: number;
    movementType:EnumMovementType;
  }
  
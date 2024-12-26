import { EnumCurrency, EnumMovementType } from '../../../enum'

export interface GRNdataDto {
  partNo:string;
  description:string;
  invoiceNo:string;
  grNnumber:string;
  invoiceRate:number;
  invoiceDate:Date;
    year:number;
    quantity:number;
    partId:number;
    buyerId:number;
    supplierCode:string;
    supplierName:string;
    buyerName:string;
    supplierId:number;
    id:number;
    currency:EnumCurrency;
    movementType:EnumMovementType;
  }
  
import { EnumCurrency, EnumTransaction } from '../../../enum'

export interface CBFCdataDto {
    deliveryNote:string;
    deliveryNoteDate:string;
    partnumber:string;
    Partdescription:string;
    qty:number;
    PaidAmount:number;
    Price : number;
    Year:number;
    PartId:number;
    BuyerId:number;
    SupplierCode:string;
    SupplierName:string;
    BuyerName:string;
    SupplierId:number;
    id:number;
    currency:EnumCurrency;
    transaction:EnumTransaction;
  }
  
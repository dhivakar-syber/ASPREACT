import { EnumCurrency, EnumTransaction } from '../../../enum' //ts2307

export interface CreateOrEditCBFCdataDto { 
    deliveryNote:string;
    deliveryNoteDate:string;
    paidAmount:number;
    year:number;
    partId:number;
    buyerId:number;
    supplierId:number;
    id: number;
    currency:EnumCurrency;
    transaction:EnumTransaction;
  }
  
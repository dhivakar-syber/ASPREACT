import {CreateOrEditSupplierRaisedQueryDto} from './createOrEditSupplierRaisedQueryDto';

export interface GetSupplierRaisedQueryForEditOutput {
    
    SupplierRaisedQuery:CreateOrEditSupplierRaisedQueryDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id: number;
}
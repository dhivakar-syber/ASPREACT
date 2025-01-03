import {SupplierRaisedQueryDto} from './supplierRaisedQueryDto';

export interface GetSupplierRaisedQueryForViewDto {
    
    SupplierRaisedQuery:SupplierRaisedQueryDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id:number;
    partid:number;
    buyerid:number;
    supplierid:number
}
import {SupplementarySummaryDto} from './supplementarySummaryDto';

export interface GetSupplementarySummaryForViewDto {
    
    SupplementarySummary:SupplementarySummaryDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id:number;
    partid:number;
    buyerid:number;
    supplierid:number
}
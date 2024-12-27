import {CreateOrEditSupplementarySummaryDto} from './createOrEditSupplementarySummaryDto';

export interface GetSupplementarySummaryForEditOutput {
    
    SupplementarySummary:CreateOrEditSupplementarySummaryDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id: number;
}
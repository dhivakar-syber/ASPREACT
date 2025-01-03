import { PagedDisputesResultRequestDto } from "./PagedDisputesResultRequestDto";
export interface GetAllDisputesInput
{
    PagedDisputesResultRequestDto:PagedDisputesResultRequestDto
    Filter:string;
    QueryFilter:string;
    BuyerRemarksFilter:string;
    StatusFilter: number;
    SupplementarySummaryDisplayPropertyFilter:string;
    SupplierRejectionCodeFilter:string;
    SupplierCodeFilter:string;
    BuyerShortIdFilter:string;
    SupplementarySummaryId:number;
}
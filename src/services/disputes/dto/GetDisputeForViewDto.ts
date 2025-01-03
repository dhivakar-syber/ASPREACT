import { DisputeDto } from "./DisputeDto";
export interface GetDisputeForViewDto{
    Dispute:DisputeDto;
    Id:number;
    SupplementarySummaryDisplayProperty:string;
    SupplierRejectionCode:string;
    SupplierCode:string;
    BuyerShortId:string;
    BuyerMail:string;
    SupplierMail:string;
    BuyerName:string;
    FromMail:string;

}
import { DisputeDto } from "./DisputeDto";

export interface GetDisputeForViewDto{
    Dispute:DisputeDto;
    id:Number;
    SupplementarySummaryDisplayProperty:string;
    SupplierRejectionCode:string;
    SupplierCode:string;
    BuyerShortId:string;
    BuyerMail:string;
    SupplierMail:string;
    BuyerName:string;
    FromMail:string;
    AccoutantMail:string;
    AccoutantName:string;
    SupplierName:string;
    AppURL:string;    
}
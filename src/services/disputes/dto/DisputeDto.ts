import { EnumDisputeStatus } from "../../../enum";

export interface DisputeDto{
    Query:string;
    BuyerRemarks:string;
    AccountsRemarks:string;
    Status:EnumDisputeStatus;
    ResponseTime:DataTransferItem;
    SupplementarySummaryId:number;
    SupplierRejectionId:number;
    SupplierId:number;
    BuyerId:number;
    id:number;
    
}
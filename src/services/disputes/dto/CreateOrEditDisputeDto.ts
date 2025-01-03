import { EnumDisputeStatus } from "../../../enum";

export interface CreateOrEditDisputeDto{
    query:string;
    buyerRemarks:string;
    accountsRemarks:string;
    status:EnumDisputeStatus;
    responseTime:Date;
    supplementarySummaryId:number;
    supplierRejectionId:number;
    supplierId:number;
    buyerId:number;
}
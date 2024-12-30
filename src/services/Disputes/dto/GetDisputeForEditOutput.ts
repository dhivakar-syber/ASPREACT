import { CreateOrEditDisputeDto } from "./CreateOrEditDisputeDto";
export interface GetDisputeForEditOutput{
    CreateOrEditDisputeDto:CreateOrEditDisputeDto;
    SupplementarySummaryDisplayProperty:String;
    SupplierRejectionCode:string;
    SupplierCode:string;
    BuyerShortId:string;
    id:Number;
}
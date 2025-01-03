import { CreateOrEditDisputeDto } from "./CreateOrEditDisputeDto";

export interface GetAllDisputesOutput{
dispute:CreateOrEditDisputeDto;
supplementarySummaryDisplayProperty:string;
supplierRejectionCode:string;
supplierCode:string;
buyerShortId:string;
}
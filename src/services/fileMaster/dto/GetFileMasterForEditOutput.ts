import {CreateOrEditFileMasterDto}from "./CreateOrEditFileMasterDto"


export interface GetFileMasterForEditOutput
{
    CreateOrEditFileMasterDto:CreateOrEditFileMasterDto;
    PartPartNo:string;
    BuyerName:string;
    SupplierName:string;
    Id:number;
}
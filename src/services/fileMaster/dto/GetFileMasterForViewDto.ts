import { FileMasterDto } from "./FileMasterDto";

export interface GetFileMasterForViewDto
{
    FileMaster:FileMasterDto;
    PartPartNo:string;
    BuyerName:string;
    SupplierName:string;
}
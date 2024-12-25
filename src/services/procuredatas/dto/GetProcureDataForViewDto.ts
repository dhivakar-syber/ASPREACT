import{ExcelProcureInput} from './ExcelProcureInput'

export interface GetProcureDataForViewDto 
{
    ProcureData:ExcelProcureInput;
    PartPartNo:string;
    BuyerName:string;
    SupplierName:string;
    id:Number;
}
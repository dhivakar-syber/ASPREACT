
import{CreateOrEditProcureDataDto} from './CreateOrEditProcureDataDto'

export interface GetProcureDataForEditOutput {
    CreateOrEditProcureDataDto: CreateOrEditProcureDataDto;
    PartPartNo: string;
    BuyerName:string;
    SupplierName:string;
    id:number;
}
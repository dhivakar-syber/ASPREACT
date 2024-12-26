import {CreateOrEditGRNdataDto} from './createOrEditGRNdataDto';

export interface GetGRNdataForEditOutput {
    
    GRNData:CreateOrEditGRNdataDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id: number;
}
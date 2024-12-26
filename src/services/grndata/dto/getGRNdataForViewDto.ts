import {GRNdataDto} from './grndataDto';

export interface GetGRNdataForViewDto {
    
    GRNdata:GRNdataDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id:number;
    partid:number;
    buyerid:number;
    supplierid:number
}
import {CBFCdataDto} from './cbfcdataDto';

export interface GetCBFCdataForViewDto {
    
    CBFCdata:CBFCdataDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id:number;
    partid:number;
    buyerid:number;
    supplierid:number
}
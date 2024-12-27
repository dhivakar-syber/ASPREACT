import {AnnexureDetailDto} from './annexureDetailsDto';

export interface GetAnnexureDetailForViewDto {
    
    AnnexureDetail:AnnexureDetailDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id:number;
    partid:number;
    buyerid:number;
    supplierid:number
}
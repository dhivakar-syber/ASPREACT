import {CreateOrEditAnnexureDetailDto} from './createOrEditAnnexureDetailDto';

export interface GetAnnexureDetailForEditOutput {
    
    AnnexureDetail:CreateOrEditAnnexureDetailDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id: number;
}
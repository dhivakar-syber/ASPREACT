import {CreateOrEditCBFCdataDto} from './createOrEditCBFCdataDto';

export interface GetCBFCdataForEditOutput {
    
    CBFCdata:CreateOrEditCBFCdataDto;
    partPartNo:string;
    buyerName:string;
    supplierName:string;
    id: number;
}
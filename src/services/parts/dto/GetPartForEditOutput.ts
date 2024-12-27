import {CreateOrEditPartDto} from './CreateOrEditPartDto'

export interface GetPartForEditOutput{
    Part:CreateOrEditPartDto
    BuyerName:string;
    SupplierName:string;

}
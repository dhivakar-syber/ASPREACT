import {PartDto} from './PartDto'

export interface GetPartForViewDto
{
    Part:PartDto;
    BuyerName:string;
    SupplierName: string;
}
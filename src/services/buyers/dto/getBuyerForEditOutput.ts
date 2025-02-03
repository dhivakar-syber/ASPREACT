// getBuyerForEditOutput.ts
import { CreateOrEditBuyerDto } from './createOrEditBuyerDto';

export interface GetBuyerForEditOutput { 
    buyer: CreateOrEditBuyerDto; // This should correctly reference the interface
    UserName: string;
    UserName2: string;
    UserName3: string;
    id:number;
}

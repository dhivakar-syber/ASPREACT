import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface GetAllApprovalWorkflowsInput extends PagedFilterAndSortedRequest {
    filter:string,
    buyerShortIdFilter:string,
    supplierCodeFilter:string,
    userNameFilter:string,
    userName2Filter:string,
    userName3Filter:string,
    buyerid:number,
    supplierid:number,
}
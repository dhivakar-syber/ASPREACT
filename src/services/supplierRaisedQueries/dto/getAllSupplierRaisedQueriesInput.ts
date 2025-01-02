import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface GetAllSupplierRaisedQueriesInput extends PagedFilterAndSortedRequest {
    filter:string,
    maxContractValidFromFilter:Date,
    minContractValidFromFilter:Date,
    maxContractValidToFilter:Date,
    minContractValidToFilter:Date,
    maxTotalGRNQtyFilter:number,
    minTotalGRNQtyFilter:number,
    maxTotalCBFCPaindAmountFilter:number,
    minTotalCBFCPaindAmountFilter:number,
    rejectionReasonFilter:string,
    buyerRemarksFilter:string,
    statusFilter:string,
    attachementFilter:string,
    partPartNoFilter:string,
    buyerNameFilter:string,
    supplierNameFilter:string,
}
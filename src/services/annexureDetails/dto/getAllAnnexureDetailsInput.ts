import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface GetAllAnnexureDetailsInput extends PagedFilterAndSortedRequest {
    filter:string;
    invoiceNoFilter:string,
    minInvoiceDateFilter:Date,
    maxInvoiceDateFilter:Date,
    maxContractValidFromFilter:Date,
    minContractValidFromFilter:Date,
    maxContractValidToFilter:Date,
    minContractValidToFilter:Date,
    contractNoFilter:string,
    maxOldValueFilter:number,
    minOldValueFilter:number,
    maxNewValueFilter:number,
    minNewValueFilter:number,
    maxDiffValueFilter:number,
    minDiffValueFilter:number,
    maxQtyFilter:number,
    minQtyFilter:number,
    maxTotalFilter:number,
    minTotalFilter:number,
    currencyFilter:number,
    supplementaryInvoiceNoFilter:string,
    maxSupplementaryInvoiceDateFilter:Date,
    minSupplementaryInvoiceDateFilter:Date,
    partPartNoFilter:string,
    buyerNameFilter:string,
    supplierNameFilter:string,
  }
  
export interface GetAllCBFCdatasForExcelInput {

    filter:string;

    deliveryNoteFilter:string;
    minDeliveryNoteDateFilter:Date;
    maxDeliveryNoteDateFilter:Date;
    CurrencyFilter:number;
    TransactionFilter:number;
    maxPaidAmountFilter:number;
    minPaidAmountFilter:number;
    maxYearFilter:number;
    minYearFilter:number;
    partPartNoFilter:string;
    buyerNameFilter:string;
    supplierNameFilter:string;

  }
  
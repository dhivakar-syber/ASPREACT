export interface CreateOrEditSupplierRaisedQueryDto {
    contractValidFrom:Date,
    contractValidTo:Date,
    totalGRNQty:number,
    totalCBFCPaindAmount:number,
    rejectionReason:string,
    buyerRemarks:string,
    status:string,
    attachement:string,
    partId:number,
    buyerId:number,
    supplierId:number,
    id:number,
}
  
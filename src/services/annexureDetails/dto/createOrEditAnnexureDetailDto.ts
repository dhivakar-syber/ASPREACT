import { EnumCurrency } from '../../../enum'

export interface CreateOrEditAnnexureDetailDto {
  invoiceNo:string,
  gRNnumber:string,
  invoiceDate:Date,
contractValidFrom:Date,
contractValidTo:Date,
contractNo:string,
oldValue:number,
newValue:number,
diffValue:number,
qty:number,
total:number,
currency:EnumCurrency,
supplementaryInvoiceNo:string,
supplementaryInvoiceDate:Date,
partId:number,
buyerId:number,
supplierId:number,
id:number,
}
  
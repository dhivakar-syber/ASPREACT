import { DocumentStatus } from '../../../enum'

export interface CreateOrEditSupplementarySummaryDto { 
  supplementaryInvoiceNo:string;
  buyerRemarks:string;
  accountantEmailAddress:string;
  paymentApprovedTime:string;
  paymentRejectedTime:string;
  paymentRemarks:string;
  payerEmailAddress:string;
  accountRemarks:string;
  payerName:string;
  accountantName:string;
  buyerEmailAddress:string;
  supplementaryInvoiceDate:Date;
  contractFromDate:Date;
  contractToDate:Date;
  contractDate:Date;
  approvalDate:Date;
  buyerApprovedTime:Date;
  buyerRejectedTime:Date;
  implementationDate:Date;
  accountApprovedTime:Date;
  accountRejectedTime:Date;
  contractNo:string;
  plantCode:string;
  supplementaryInvoiceFileId:number;
  annexureFileId:number;
  grnQty:number;
  oldValue:number;
  newValue:number;
  delta: number;
  total: number;
  versionNo: number;
  isRejected: boolean;
  isApproved: boolean;
  buyerApproval: boolean;
  paymentApproval: boolean;
  accountedValue: number;
  partId: number;
  id: number;
  buyerId: number;
  supplierId: number;
  documentStatus:DocumentStatus;
  buyerApprovalStatus:DocumentStatus;
  accountantApprovalStatus:DocumentStatus;
  paymentApprovalStatus:DocumentStatus;
}
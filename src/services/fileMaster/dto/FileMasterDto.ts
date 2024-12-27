import {  DocumentStatus } from '../../../enum'


export interface FileMasterDto
{
    Id:Number;
    AnnexureId:number;
    SupplementaryId:number;
    FileName:string;
    SupplementaryFilename:string;
    SupplementaryInvoiceNo:string;
    SupplementaryInvoiceDate:Date;
    SupplementaryToken:string;
    Token:string;
    FileLength:number;
    SupplementaryInvoicePath:string;
    AnnecurePath:string;
    PartId:number;
    BuyerId:number;
    SupplierId:number;
    SupplementaryInvoicePath2:string;
    SupplementaryInvoicePath3:string;
    SupplementaryToken2:string;
    SupplementaryToken3:string;
    FileName2:string;
    FileName3:string;
    VersionNo:number;
    annexureFileName:string;
    Token2:string;
    Token3:string;
    DocumentStatus:DocumentStatus;
    BuyerName:string;
    BuyerEmailAddress:string;
    BuyerApprovalStatus:DocumentStatus;
    BuyerApproval:boolean;
    BuyerApprovedTime:Date;
    BuyerRejectedTime:Date;
    BuyerRemarks:string;
    AccountantName:string;
    AccountantApproval:boolean;
    AccountantEmailAddress:string;
    AccountantApprovalStatus: DocumentStatus;
    AccountApprovedTime:Date;
    AccountRejectedTime:Date;
    AccountRemarks: string;
    iscreditnote:boolean;
    AccountingNo:string;
    AccountingDate:Date;
    ContractFromDate:Date;
    ContractToDate:Date;
    ContractNo:string;
    ContractDate:Date;
    ApprovalDate:Date;
    ImplementationDate:Date;
    GRNQty:number;
    OldValue:number;
    NewValue:number;
    Delta:number;
    Total:number;
    PlantCode:string;
    SupplierRemarks:string;
    SupplierEmailAddress:string;
    FromEmail:string;
    AppURL:string;
    amendedfrom:number;
    ishistory:boolean;
    Partno:string;
    Partdescription:string;
    suppliercode:string;
    suppliername:string;
    SuppliersumbittedTime:Date;
    ReportDate:Date;
    Ageing:number;
    PartversionNo:number;
    Document:string;
    Buyermail: string[];
    Suppliermail:string[];
    Accountsmail:string[];   
    correlationid:string;




}
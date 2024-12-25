export interface GetAllProcureDatasForExcelInput{
    Filter:string;
    MaxValidFromFilter:Date;
    MinValidFromFilter:Date;
    MaxValidToFilter:Date;
    MinValidToFilter:Date;
    ContractNoFilter:string;
    MaxContractDateFilter:Date;
    MinContractDateFilter:Date;
    MaxApprovalDateFilter:Date;
    MinApprovalDateFilter:Date;
    PlantCodeFilter:string;
    MaxVersionNoFilter:number;
    MinVersionNoFilter:Number;
    PartPartNoFilter:string;
    BuyerNameFilter:string;
    SupplierNameFilter:string;
}
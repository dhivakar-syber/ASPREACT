export interface ProcureDataDto
{
    Id:number;
    PartNo:string;
    PartDescription:string;
    Team:string;
    buyer:string;
    suppliercode:string;
    suppliername:string;
    CurrentExwPrice:number;
    PriceCurrency:number;
    Department: string;
    BuyershortId:string;
    Year:number;
    Uom:string;
    PackagingCost:number;
    LogisticsCost:number;
    PlantDescription:string;
    ValidFrom:Date;
    ValidTo:Date;
    ContractNo:string;
    ContractDate:Date;
    ApprovalDate:Date;
    PlantCode:string;
    VersionNo:number;
    PartId:Number;
    BuyerId:number;
    SupplierId:number;
    Exception:string;
    CanBeImported():boolean;
}


export interface BuyerDashboardInput {
    Supplierids:number[];
      Buyerid: number;
      Partids:number[];
      invoicetype:number; 
      Date:Date|null;
      DocumentStatusFilter:number | null;
  
    }
    
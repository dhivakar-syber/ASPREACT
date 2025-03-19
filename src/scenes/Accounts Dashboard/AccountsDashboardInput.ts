export interface AccountDashboardInput {
    Buyerids: number[];
    Supplierids: number[];
    Partids:number[];
    invoicetype:number; 
    Date:Date|null;
    DocumentStatusFilter:number|null;
  }
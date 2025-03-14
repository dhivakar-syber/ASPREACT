export interface SupplierDashboardInput {
  Supplierid:number;
    Buyerids: number[];
    Partids:number[];
    invoicetype:number;
    DocumentStatusFilter : number|null;

  }
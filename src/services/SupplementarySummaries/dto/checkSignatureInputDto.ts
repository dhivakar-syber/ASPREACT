export interface SupplementaryData {
    supplementaryId: number;
    suppInvoice: string;
    suppInvoiceDate: Date;
    attachment: File | null;
    attachment3: File | null;
    annexure: File | null;
    versionNo: number;
}
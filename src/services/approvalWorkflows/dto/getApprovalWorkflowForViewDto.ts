import { ApprovalWorkflowDto } from './approvalWorkflowDto';

export interface GetApprovalWorkflowForViewDto {
    ApprovalWorkflow:ApprovalWorkflowDto,
    buyerShortId:string,
    supplierCode:string,
    userName:string,
    buyermailaddress:string,
    userName2:string,
    accountmailaddress:string,
    userName3:string,
    paymentmailaddress:string,
    suppliermailaddress:string,
    id:number,
}
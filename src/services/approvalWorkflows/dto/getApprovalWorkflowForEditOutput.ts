import { CreateOrEditApprovalWorkflowDto } from './createOrEditApprovalWorkflowDto';

export interface GetApprovalWorkflowForEditOutput {
    ApprovalWorkflow:CreateOrEditApprovalWorkflowDto,
    buyerShortId:string,
    supplierCode:string,
    userName:string,
    userName2:string,
    userName3:string,
}
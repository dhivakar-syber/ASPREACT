import { action, observable } from 'mobx';

import { CreateOrEditApprovalWorkflowDto } from '../services/approvalWorkflows/dto/createOrEditApprovalWorkflowDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedApprovalWorkflowResultRequestDto } from '../services/approvalWorkflows/dto/PagedApprovalWorkflowResultRequestDto';
import { GetApprovalWorkflowForEditOutput } from '../services/approvalWorkflows/dto/getApprovalWorkflowForEditOutput';
import { GetApprovalWorkflowForViewDto } from '../services/approvalWorkflows/dto/getApprovalWorkflowForViewDto';
import { ApprovalWorkflowBuyerLookupTableDto } from '../services/approvalWorkflows/dto/approvalWorkflowBuyerLookupTableDto';
import { ApprovalWorkflowSupplierLookupTableDto } from '../services/approvalWorkflows/dto/approvalWorkflowSupplierLookupTableDto';
import { ApprovalWorkflowUserLookupTableDto } from '../services/approvalWorkflows/dto/approvalWorkflowUserLookupTableDto';
import approvalWorkflowsService from '../services/approvalWorkflows/approvalWorkflowsService';

class ApprovalWorkflowStore {
  @observable approvalWorkflow!: PagedResultDto<GetApprovalWorkflowForViewDto>;
  @observable buyerlookupdata!: PagedResultDto<ApprovalWorkflowBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<ApprovalWorkflowSupplierLookupTableDto>;
  @observable userlookupdata!: PagedResultDto<ApprovalWorkflowUserLookupTableDto>;
  @observable editUser!: GetApprovalWorkflowForEditOutput;

  @action
  async create(createOrEditApprovalWorkflowDto: CreateOrEditApprovalWorkflowDto) {
    let result = await approvalWorkflowsService.create(createOrEditApprovalWorkflowDto);
    this.approvalWorkflow.items.push(result);
  }

  @action
  async update(createOrEditApprovalWorkflowDto: CreateOrEditApprovalWorkflowDto) {
    let result = await approvalWorkflowsService.update(createOrEditApprovalWorkflowDto);
    this.approvalWorkflow.items = this.approvalWorkflow.items.map((x: GetApprovalWorkflowForViewDto) => {
      if (x.id === createOrEditApprovalWorkflowDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await approvalWorkflowsService.delete(entityDto);
    this.approvalWorkflow.items = this.approvalWorkflow.items.filter((x: GetApprovalWorkflowForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await approvalWorkflowsService.get(entityDto);
    this.editUser = result;
  }

  @action
  async createApprovalWorkflow() {
    this.editUser = {
        ApprovalWorkflow: {
            buyerId:0,
    supplierId:0,
    approvalBuyer:0,
    accountsApprover:0,
    paymentApprover:0,
    id:0,
          },
          buyerShortId:'',
    supplierCode:'',
    userName:'',
    userName2:'',
    userName3:'',
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedApprovalWorkflowResultRequestDto) {
    let result = await approvalWorkflowsService.getAll(pagedFilterAndSortedRequest);
    this.approvalWorkflow = result;
  }

  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedApprovalWorkflowResultRequestDto) {
    let result = await approvalWorkflowsService.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedApprovalWorkflowResultRequestDto) {
    let result = await approvalWorkflowsService.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }
  @action
  async getAllUserForLookupTable(pagedFilterAndSortedRequest: PagedApprovalWorkflowResultRequestDto) {
    let result = await approvalWorkflowsService.getAllPartForLookupTable(pagedFilterAndSortedRequest);
    this.userlookupdata = result;
  }
}

export default ApprovalWorkflowStore;
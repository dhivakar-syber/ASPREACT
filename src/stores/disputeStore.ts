import { action, observable } from 'mobx';

import { CreateOrEditDisputeDto } from '../services/disputes/dto/CreateOrEditDisputeDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import { DisputeBuyerLookupTableDto } from '../services/disputes/dto/DisputeBuyerLookupTableDto';
import { GetDisputeForViewDto } from '../services/disputes/dto/GetDisputeForViewDto';
import { DisputeSupplierLookupTableDto } from '../services/disputes/dto/DisputeSupplierLookupTableDto';
import { DisputeSupplementarySummaryLookupTableDto } from '../services/disputes/dto/DisputeSupplementarySummaryLookupTableDto';
 import{ GetAllDisputesOutput } from '../services/disputes/dto/GetAllDisputesOutput';
 import { DisputeSupplierRejectionLookupTableDto } from '../services/disputes/dto/DisputeSupplierRejectionLookupTableDto';
import disputeService from '../services/disputes/disputeService';


class disputeStore {
  @observable Disputedatas!:PagedResultDto<GetDisputeForViewDto>;
  @observable lookupData!: PagedResultDto<DisputeSupplierRejectionLookupTableDto>;
  @observable buyerData!: PagedResultDto<DisputeBuyerLookupTableDto>;
  @observable supplierData!: PagedResultDto<DisputeSupplierLookupTableDto>;
  @observable rejectionData!: PagedResultDto<DisputeSupplementarySummaryLookupTableDto>; 
  @observable editUser!: GetAllDisputesOutput;

  @action
  async create(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await disputeService.create(createOrEditDisputeDto);
    this.Disputedatas.items.push(result);
  } 

  @action
  async update(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await disputeService.update(createOrEditDisputeDto);
    this.Disputedatas=result;
  }

  @action
  async delete(entityDto:  EntityDto) {
    await disputeService.delete(entityDto);
    this.Disputedatas.items = this.Disputedatas.items.filter((x: GetDisputeForViewDto) => x.Id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await disputeService.get(entityDto);
    this.editUser = result;
  }
  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    console.log('hello');
    let result = await disputeService.getAll(pagedFilterAndSortedRequest);
    this.Disputedatas = result;
  }
  
  @action
  async createDisputedatas() {
    this.editUser = {
      dispute: {
        query:'',
        buyerRemarks:'',
        accountsRemarks:'',
        status:0,
        responseTime:new Date(),
        supplementarySummaryId:0,
        supplierRejectionId:0,
        supplierId:0,
        buyerId:0
    },
        
        supplementarySummaryDisplayProperty:'',
        supplierRejectionCode:'',
        supplierCode:'',
        buyerShortId:''
        };
  }

  @action 
  async getAllSupplementaryForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputeService.getAllSupplementaryForLookupTable(pagedFilterAndSortedRequest);
    this.lookupData = result;
  }

  @action
  async getAllRejectionForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputeService.getAllRejectionForLookupTable(pagedFilterAndSortedRequest);
    this.lookupData = result;
  }
  @action
  async getAllForSupplierLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputeService.getAllForSupplierLookupTable(pagedFilterAndSortedRequest);
    this.buyerData = result;
  }
  @action
  async getAllBuyerLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputeService.getAllBuyerLookupTable(pagedFilterAndSortedRequest);
    this.supplierData = result;
  }
  @action
  async GetAllForLookupInput(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputeService.GetAllForLookupInput(pagedFilterAndSortedRequest);
    this.rejectionData = result;
  }
}

export default disputeStore;

import { action, observable } from 'mobx';

import { CreateOrEditDisputeDto } from '../services/Disputes/dto/CreateOrEditDisputeDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import { GetAllDisputesInput } from '../services/Disputes/dto/GetAllDisputesInput';
import { GetDisputeForEditOutput } from '../services/Disputes/dto/GetDisputeForEditOutput';
import { GetDisputeForViewDto } from '../services/Disputes/dto/GetDisputeForViewDto';
import { DisputeSupplementarySummaryLookupTableDto } from '../services/Disputes/dto/DisputeSupplementarySummaryLookupTableDto';
import { DisputeSupplierRejectionLookupTableDto } from '../services/Disputes/dto/DisputeSupplierRejectionLookupTableDto';
import { DisputeSupplierLookupTableDto } from '../services/Disputes/dto/DisputeSupplierLookupTableDto';
import { DisputeBuyerLookupTableDto } from '../services/Disputes/dto/DisputeBuyerLookupTableDto';
import disputesService from '../services/Disputes/disputesServices';
import { EnumDisputeStatus } from '../enum';
import { BuyerDashboardInput } from '../scenes/BuyerDashboard/components/PayRetroBuyerDashboard/BuyerDashboardInput';
import { AccountDashboardInput } from '../scenes/Accounts Dashboard/components/PayRetroaccountsDashboard/AccountsDashboardInput';


class DisputedataStore {
  @observable disputedata!: PagedResultDto<GetDisputeForViewDto>;
  @observable disputedatas!: PagedResultDto<GetAllDisputesInput>;
  @observable supplementarylookupdata!: PagedResultDto<DisputeSupplementarySummaryLookupTableDto>;
  @observable rejectionlookupdata!: PagedResultDto<DisputeSupplierRejectionLookupTableDto>;
  @observable buyerlookupdata!: PagedResultDto<DisputeBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<DisputeSupplierLookupTableDto>;
  @observable editDispute!: GetDisputeForEditOutput;

  @action
  async create(CreateOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await disputesService.create(CreateOrEditDisputeDto);
    
    return result;
    
  }

  @action
  async update(CreateOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await disputesService.update(CreateOrEditDisputeDto);
    this.disputedata.items = this.disputedata.items.map((x: GetDisputeForViewDto) => {
      if (x.id === CreateOrEditDisputeDto.id) x = result;
      return x;
    });
  }

  @action
  async accountsForwardupdate(CreateOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await disputesService.accountsForwardupdate(CreateOrEditDisputeDto);
    this.disputedata.items = this.disputedata.items.map((x: GetDisputeForViewDto) => {
      if (x.id === CreateOrEditDisputeDto.id) x = result;
      return x;
    });
  }

  @action
  async buyercloseupdate(CreateOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await disputesService.update(CreateOrEditDisputeDto);
    this.disputedata.items = this.disputedata.items.map((x: GetDisputeForViewDto) => {
      if (x.id === CreateOrEditDisputeDto.id) x = result;
      return x;
    });
  }

  @action
  async accountupdate(CreateOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await disputesService.accountupdate(CreateOrEditDisputeDto);
    this.disputedata.items = this.disputedata.items.map((x: GetDisputeForViewDto) => {
      if (x.id === CreateOrEditDisputeDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await disputesService.delete(entityDto);
    this.disputedata.items = this.disputedata.items.filter((x: GetDisputeForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await disputesService.get(entityDto);
    this.editDispute = result;
    return result;
  }

  @action
  async buyerget(entityDto: EntityDto) {
    let result = await disputesService.buyerget(entityDto);
    this.editDispute = result;
  }

  @action
  async supplierget(entityDto: EntityDto) {
    let result = await disputesService.supplierget(entityDto);
    this.editDispute = result;
  }

  @action
  async accountget(entityDto: EntityDto) {
    let result = await disputesService.get(entityDto);
    this.editDispute = result;
  }

  public async getView(id:number) {
    let result = await disputesService.getAllView(id)    
    return result.data.result; 
  }

  @action
  async createDisputeData() {
    this.editDispute = {
            CreateOrEditDisputeDto: {

              id: 0,
              Query: '',
              BuyerRemarks: '',
              AccountsRemarks: '',
              Status: EnumDisputeStatus.Open,
              ResponseTime: new Date(),
              SupplementarySummaryId: 0,
              SupplierRejectionId: 0,
              SupplierId: 0,
              BuyerId: 0,
              SupplierRejection: '',
              SupplierName: '',
              BuyerName: ''

            },
            SupplementarySummaryDisplayProperty: '',
            SupplierRejectionCode: '',
            SupplierCode: '',
            BuyerShortId:'',
            id: 0
        };
    }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputesService.getAll(pagedFilterAndSortedRequest);
    this.disputedata = result;
    return result; 

  }

  @action
  async suppliergetAll(getAllDisputesInput: GetAllDisputesInput) {
    let result = await disputesService.suppliergetAll(getAllDisputesInput);
    this.disputedatas = result;
    return result; 

  }

  @action
  async buyergetAll(input:BuyerDashboardInput) {
    let result = await disputesService.buyergetAll(input);
    this.disputedata = result;
  }

  @action
  async accountgetAll(input:AccountDashboardInput) {
    let result = await disputesService.accountgetAll(input);
    this.disputedata = result;
  }

  @action
  async getAllsuppliersummariesForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputesService.getAllsuppliersummariesForLookupTable(pagedFilterAndSortedRequest);
    this.supplementarylookupdata = result;
  }

  @action
  async getAllsupplierrejectionForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputesService.getAllsupplierrejectionForLookupTable(pagedFilterAndSortedRequest);
    return result;
  }
  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputesService.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await disputesService.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }

  

//    async importExcel(file: File): Promise<any> {
//     try {
//         if (!file) {
//             throw new Error("No file provided");
//         }
        
//         const items = await cbfcdataService.inportExceldata(file);
//         return items;
//     } catch (error) {
//         console.error("Error importing Excel file:", error);
//         throw error; // Optionally rethrow the error to propagate it
//     }
// }
}

export default  DisputedataStore;

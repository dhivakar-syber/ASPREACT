import { action, observable } from 'mobx';

import { CreateOrEditSupplementarySummaryDto } from '../services/SupplementarySummaries/dto/createOrEditSupplementarySummaryDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedSupplementarySummaryResultRequestDto } from '../services/SupplementarySummaries/dto/PagedSupplementarySummaryResultRequestDto';
import { GetSupplementarySummaryForEditOutput } from '../services/SupplementarySummaries/dto/getSupplementarySummaryForEditOutput';
import { GetSupplementarySummaryForViewDto } from '../services/SupplementarySummaries/dto/getSupplementarySummaryForViewDto';
import { SupplementarySummaryPartLookupTableDto } from '../services/SupplementarySummaries/dto/supplementarySummaryPartLookupTableDto';
import { SupplementarySummarySupplierLookupTableDto } from '../services/SupplementarySummaries/dto/supplementarySummarySupplierLookupTableDto';
import { supplementarySummaryBuyerLookupTableDto } from '../services/SupplementarySummaries/dto/supplementarySummaryBuyerLookupTableDto';
import supplementarySummariesService from '../services/SupplementarySummaries/supplementarySummariesService';
import { DocumentStatus } from '../enum'

class CBFCdataStore {
  @observable supplementarySummary!: PagedResultDto<GetSupplementarySummaryForViewDto>;
  @observable partlookupdata!: PagedResultDto<SupplementarySummaryPartLookupTableDto>;
  @observable buyerlookupdata!: PagedResultDto<supplementarySummaryBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<SupplementarySummarySupplierLookupTableDto>;
  @observable editUser!: GetSupplementarySummaryForEditOutput;

  @action
  async create(createOrEditSupplementarySummaryDto: CreateOrEditSupplementarySummaryDto) {
    let result = await supplementarySummariesService.create(createOrEditSupplementarySummaryDto);
    this.supplementarySummary.items.push(result);
  }

  @action
  async update(createOrEditSupplementarySummaryDto: CreateOrEditSupplementarySummaryDto) {
    let result = await supplementarySummariesService.update(createOrEditSupplementarySummaryDto);
    this.supplementarySummary.items = this.supplementarySummary.items.map((x: GetSupplementarySummaryForViewDto) => {
      if (x.id === createOrEditSupplementarySummaryDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await supplementarySummariesService.delete(entityDto);
    this.supplementarySummary.items = this.supplementarySummary.items.filter((x: GetSupplementarySummaryForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await supplementarySummariesService.get(entityDto);
    this.editUser = result;
  }

  @action
  async createSupplementarySummary() {
    this.editUser = {
        SupplementarySummary: {
            supplementaryInvoiceNo:'',
              buyerRemarks:'',
              accountantEmailAddress:'',
              paymentApprovedTime:'',
              paymentRejectedTime:'',
              paymentRemarks:'',
              payerEmailAddress:'',
              accountRemarks:'',
              payerName:'',
              accountantName:'',
              buyerEmailAddress:'',
              supplementaryInvoiceDate: new Date(),
              contractFromDate:new Date(),
              contractToDate:new Date(),
              contractDate:new Date(),
              approvalDate:new Date(),
              buyerApprovedTime:new Date(),
              buyerRejectedTime:new Date(),
              implementationDate:new Date(),
              accountApprovedTime:new Date(),
              accountRejectedTime:new Date(),
              contractNo:'',
              plantCode:'',
              supplementaryInvoiceFileId:0,
              annexureFileId:0,
              grnQty:0,
              oldValue:0,
              newValue:0,
              delta: 0,
              total: 0,
              versionNo: 0,
              isRejected: false,
              isApproved: false,
              buyerApproval: false,
              paymentApproval: false,
              accountedValue: 0,
              partId: 0,
              id: 0,
              buyerId: 0,
              supplierId: 0,
              documentStatus:DocumentStatus.NotStarted,
              buyerApprovalStatus:DocumentStatus.NotStarted,
              accountantApprovalStatus:DocumentStatus.NotStarted,
              paymentApprovalStatus:DocumentStatus.NotStarted
          },
          partPartNo: '',
          buyerName: '',
          supplierName: '',
          id: 0
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto) {
    let result = await supplementarySummariesService.getAll(pagedFilterAndSortedRequest);
    this.supplementarySummary = result;
  }

  @action
  async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto) {
    let result = await supplementarySummariesService.getAllPartForLookupTable(pagedFilterAndSortedRequest);
    this.partlookupdata = result;
  }
  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto) {
    let result = await supplementarySummariesService.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto) {
    let result = await supplementarySummariesService.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }
}

export default CBFCdataStore;

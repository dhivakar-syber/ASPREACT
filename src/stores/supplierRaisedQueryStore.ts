import { action, observable } from 'mobx';

import { CreateOrEditSupplierRaisedQueryDto } from '../services/supplierRaisedQueries/dto/createOrEditSupplierRaisedQueryDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedSupplierRaisedQueryResultRequestDto } from '../services/supplierRaisedQueries/dto/PagedSupplierRaisedQueryResultRequestDto';
import { GetSupplierRaisedQueryForEditOutput } from '../services/supplierRaisedQueries/dto/getSupplierRaisedQueryForEditOutput';
import { GetSupplierRaisedQueryForViewDto } from '../services/supplierRaisedQueries/dto/getSupplierRaisedQueryForViewDto';
import { SupplierRaisedQueryPartLookupTableDto } from '../services/supplierRaisedQueries/dto/supplierRaisedQueryPartLookupTableDto';
import { SupplierRaisedQuerySupplierLookupTableDto } from '../services/supplierRaisedQueries/dto/supplierRaisedQuerySupplierLookupTableDto';
import { SupplierRaisedQueryBuyerLookupTableDto } from '../services/supplierRaisedQueries/dto/supplierRaisedQueryBuyerLookupTableDto';
import supplierRaisedQueriesService from '../services/supplierRaisedQueries/supplierRaisedQueriesService';

class SupplierRaisedQuery {
  @observable supplierRaisedQuery!: PagedResultDto<GetSupplierRaisedQueryForViewDto>;
  @observable partlookupdata!: PagedResultDto<SupplierRaisedQueryPartLookupTableDto>;
  @observable buyerlookupdata!: PagedResultDto<SupplierRaisedQueryBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<SupplierRaisedQuerySupplierLookupTableDto>;
  @observable editUser!: GetSupplierRaisedQueryForEditOutput;

  @action
  async create(createOrEditSupplierRaisedQueryDto: CreateOrEditSupplierRaisedQueryDto) {
    let result = await supplierRaisedQueriesService.create(createOrEditSupplierRaisedQueryDto);
    this.supplierRaisedQuery.items.push(result);
  }

  @action
  async update(createOrEditSupplierRaisedQueryDto: CreateOrEditSupplierRaisedQueryDto) {
    let result = await supplierRaisedQueriesService.update(createOrEditSupplierRaisedQueryDto);
    this.supplierRaisedQuery.items = this.supplierRaisedQuery.items.map((x: GetSupplierRaisedQueryForViewDto) => {
      if (x.id === createOrEditSupplierRaisedQueryDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await supplierRaisedQueriesService.delete(entityDto);
    this.supplierRaisedQuery.items = this.supplierRaisedQuery.items.filter((x: GetSupplierRaisedQueryForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await supplierRaisedQueriesService.get(entityDto);
    this.editUser = result;
  }

  @action
  async createSupplierRaisedQuery() {
    this.editUser = {
        SupplierRaisedQuery: {
            contractValidFrom:new Date(),
    contractValidTo:new Date(),
    totalGRNQty:0,
    totalCBFCPaindAmount:0,
    rejectionReason:'',
    buyerRemarks:'',
    status:'',
    attachement:'',
    partId:0,
    buyerId:0,
    supplierId:0,
    id:0,
          },
          partPartNo: '',
          buyerName: '',
          supplierName: '',
          id: 0
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedSupplierRaisedQueryResultRequestDto) {
    let result = await supplierRaisedQueriesService.getAll(pagedFilterAndSortedRequest);
    this.supplierRaisedQuery = result;
  }

  @action
  async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedSupplierRaisedQueryResultRequestDto) {
    let result = await supplierRaisedQueriesService.getAllPartForLookupTable(pagedFilterAndSortedRequest);
    this.partlookupdata = result;
  }
  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedSupplierRaisedQueryResultRequestDto) {
    let result = await supplierRaisedQueriesService.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedSupplierRaisedQueryResultRequestDto) {
    let result = await supplierRaisedQueriesService.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }
}

export default SupplierRaisedQuery;
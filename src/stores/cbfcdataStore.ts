import { action, observable } from 'mobx';

import { CreateOrEditCBFCdataDto } from '../services/cbfcdata/dto/createOrEditCBFCdataDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import { GetCBFCdataForEditOutput } from '../services/cbfcdata/dto/getCBFCdataForEditOutput';
import { GetCBFCdataForViewDto } from '../services/cbfcdata/dto/getCBFCdataForViewDto';
import { CBFCdataPartLookupTableDto } from '../services/cbfcdata/dto/cbfcdataPartLookupTableDto';
import { CBFCdataSupplierLookupTableDto } from '../services/cbfcdata/dto/cbfcdataSupplierLookupTableDto';
import { CBFCdataBuyerLookupTableDto } from '../services/cbfcdata/dto/cbfcdataBuyerLookupTableDto';
import cbfcdataService from '../services/cbfcdata/cbfcdataService';
import { EnumCurrency, EnumTransaction } from '../enum'

class CBFCdataStore {
  @observable cbfcdata!: PagedResultDto<GetCBFCdataForViewDto>;
  @observable partlookupdata!: PagedResultDto<CBFCdataPartLookupTableDto>;
  @observable buyerlookupdata!: PagedResultDto<CBFCdataBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<CBFCdataSupplierLookupTableDto>;
  @observable editUser!: GetCBFCdataForEditOutput;

  @action
  async create(createOrEditCBFCdataDto: CreateOrEditCBFCdataDto) {
    let result = await cbfcdataService.create(createOrEditCBFCdataDto);
    this.cbfcdata.items.push(result);
  }

  @action
  async update(createOrEditCBFCdataDto: CreateOrEditCBFCdataDto) {
    let result = await cbfcdataService.update(createOrEditCBFCdataDto);
    this.cbfcdata.items = this.cbfcdata.items.map((x: GetCBFCdataForViewDto) => {
      if (x.id === createOrEditCBFCdataDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await cbfcdataService.delete(entityDto);
    this.cbfcdata.items = this.cbfcdata.items.filter((x: GetCBFCdataForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await cbfcdataService.get(entityDto);
    this.editUser = result;
  }

  @action
  async createCBFCData() {
    this.editUser = {
        CBFCdata: {
            deliveryNote: '',
            deliveryNoteDate: '',
            paidAmount: 0,
            year: 0,
            id: 0,
            partId: 0,
            supplierId: 0,
            buyerId: 0,
            currency : EnumCurrency.INR,
            transaction:EnumTransaction.Credit
          },
          partPartNo: '',
          buyerName: '',
          supplierName: '',
          id: 0
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await cbfcdataService.getAll(pagedFilterAndSortedRequest);
    this.cbfcdata = result;
  }

  @action
  async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await cbfcdataService.getAllPartForLookupTable(pagedFilterAndSortedRequest);
    this.partlookupdata = result;
  }
  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await cbfcdataService.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await cbfcdataService.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }
}

export default CBFCdataStore;

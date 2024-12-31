import { action, observable } from 'mobx';

import { CreateOrEditAnnexureDetailDto } from '../services/annexureDetails/dto/createOrEditAnnexureDetailDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedAnnexureDetailResultRequestDto } from '../services/annexureDetails/dto/PagedAnnexureDetailResultRequestDto';
import { GetAnnexureDetailForEditOutput } from '../services/annexureDetails/dto/getAnnexureDetailForEditOutput';
import { GetAnnexureDetailForViewDto } from '../services/annexureDetails/dto/getAnnexureDetailForViewDto';
import { AnnexureDetailPartLookupTableDto } from '../services/annexureDetails/dto/annexureDetailPartLookupTableDto';
import { AnnexureDetailSupplierLookupTableDto } from '../services/annexureDetails/dto/AnnexureDetailSupplierLookupTableDto';
import { AnnexureDetailBuyerLookupTableDto } from '../services/annexureDetails/dto/annexureDetailsBuyerLookupTableDto';
import annexureDetailsService from '../services/annexureDetails/annexureDetailsService';
import { EnumCurrency } from '../enum'

class AnnexureDetailsStore {
  @observable annexureDetail!: PagedResultDto<GetAnnexureDetailForViewDto>;
  @observable partlookupdata!: PagedResultDto<AnnexureDetailPartLookupTableDto>;
  @observable buyerlookupdata!: PagedResultDto<AnnexureDetailBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<AnnexureDetailSupplierLookupTableDto>;
  @observable editUser!: GetAnnexureDetailForEditOutput;

  @action
  async create(createOrEditAnnexureDetailDto: CreateOrEditAnnexureDetailDto) {
    let result = await annexureDetailsService.create(createOrEditAnnexureDetailDto);
    this.annexureDetail.items.push(result);
  }

  @action
  async update(createOrEditAnnexureDetailDto: CreateOrEditAnnexureDetailDto) {
    let result = await annexureDetailsService.update(createOrEditAnnexureDetailDto);
    this.annexureDetail.items = this.annexureDetail.items.map((x: GetAnnexureDetailForViewDto) => {
      if (x.id === createOrEditAnnexureDetailDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await annexureDetailsService.delete(entityDto);
    this.annexureDetail.items = this.annexureDetail.items.filter((x: GetAnnexureDetailForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await annexureDetailsService.get(entityDto);
    this.editUser = result;
  }

  @action
  async createAnnexureDetail() {
    this.editUser = {
        AnnexureDetail: {
            invoiceNo:'',
              gRNnumber:'',
              invoiceDate:new Date(),
            contractValidFrom:new Date(),
            contractValidTo:new Date(),
            contractNo:'',
            oldValue:0,
            newValue:0,
            diffValue:0,
            qty:0,
            total:0,
            currency:EnumCurrency.INR,
            supplementaryInvoiceNo:'',
            supplementaryInvoiceDate:new Date(),
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
  async getAll(pagedFilterAndSortedRequest: PagedAnnexureDetailResultRequestDto) {
    let result = await annexureDetailsService.getAll(pagedFilterAndSortedRequest);
    this.annexureDetail = result;
  }

  @action
  async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedAnnexureDetailResultRequestDto) {
    let result = await annexureDetailsService.getAllPartForLookupTable(pagedFilterAndSortedRequest);
    this.partlookupdata = result;
  }
  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedAnnexureDetailResultRequestDto) {
    let result = await annexureDetailsService.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedAnnexureDetailResultRequestDto) {
    let result = await annexureDetailsService.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }
}

export default AnnexureDetailsStore;
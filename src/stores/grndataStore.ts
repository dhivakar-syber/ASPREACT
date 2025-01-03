import { action, observable } from 'mobx';

import { CreateOrEditGRNdataDto } from '../services/grndata/dto/createOrEditGRNdataDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedGRNResultRequestDto } from '../services/grndata/dto/PagedGRNResultRequestDto';
import { GetGRNdataForEditOutput } from '../services/grndata/dto/getGRNdataForEditOutput';
import { GetGRNdataForViewDto } from '../services/grndata/dto/getGRNdataForViewDto';
import { GRNdataPartLookupTableDto } from '../services/grndata/dto/grndataPartLookupTableDto';
import { GRNdataSupplierLookupTableDto } from '../services/grndata/dto/grndataSupplierLookupTableDto';
import { GRNdataBuyerLookupTableDto } from '../services/grndata/dto/grndataBuyerLookupTableDto';
import grndataService from '../services/grndata/grndataService';
import { EnumMovementType } from '../enum'

class GRNdataStore {
  @observable grndata!: PagedResultDto<GetGRNdataForViewDto>;
  @observable partlookupdata!: PagedResultDto<GRNdataPartLookupTableDto>;
  @observable buyerlookupdata!: PagedResultDto<GRNdataBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<GRNdataSupplierLookupTableDto>;
  @observable editUser!: GetGRNdataForEditOutput;

  @action
  async create(createOrEditGRNdataDto: CreateOrEditGRNdataDto) {
    let result = await grndataService.create(createOrEditGRNdataDto);
    this.grndata.items.push(result);
  }

  @action
  async update(createOrEditGRNdataDto: CreateOrEditGRNdataDto) {
    let result = await grndataService.update(createOrEditGRNdataDto);
    this.grndata.items = this.grndata.items.map((x: GetGRNdataForViewDto) => {
      if (x.id === createOrEditGRNdataDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await grndataService.delete(entityDto);
    this.grndata.items = this.grndata.items.filter((x: GetGRNdataForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await grndataService.get(entityDto);
    this.editUser = result;
  }

  @action
  async createGRNData() {
    this.editUser = {
        GRNData: {
            description: '',
            invoiceNo: '',
            invoiceDate: '',
            quantity: 0,
            year: 0,
            id: 0,
            partId: 0,
            supplierId: 0,
            buyerId: 0,
            movementType:EnumMovementType.Inward
          },
          partPartNo: '',
          buyerName: '',
          supplierName: '',
          id: 0
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedGRNResultRequestDto) {
    let result = await grndataService.getAll(pagedFilterAndSortedRequest);
    this.grndata = result;
  }

  @action
  async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedGRNResultRequestDto) {
    let result = await grndataService.getAllPartForLookupTable(pagedFilterAndSortedRequest);
    this.partlookupdata = result;
  }
  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedGRNResultRequestDto) {
    let result = await grndataService.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedGRNResultRequestDto) {
    let result = await grndataService.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }
  async importExcel(file: File): Promise<any> {
      try {
          if (!file) {
              throw new Error("No file provided");
          }
          
          const items = await grndataService.inportExceldata(file);
          return items;
      } catch (error) {
          console.error("Error importing Excel file:", error);
          throw error; // Optionally rethrow the error to propagate it
      }
  
}
}

export default GRNdataStore;

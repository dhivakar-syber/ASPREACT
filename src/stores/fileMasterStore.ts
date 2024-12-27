import { action, observable } from 'mobx';

import { CreateOrEditFileMasterDto } from '../services/fileMaster/dto/CreateOrEditFileMasterDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedFileMasterResultRequestDto } from '../services/fileMaster/dto/PagedFileMasterResultRequestDto';
import { GetFileMasterForEditOutput } from '../services/fileMaster/dto/GetFileMasterForEditOutput';
import { GetFileMasterForViewDto } from '../services/fileMaster/dto/GetFileMasterForViewDto';
import { FileMasterPartLookupTableDto } from '../services/fileMaster/dto/FileMasterPartLookupTableDto';
import { FileMasterSupplierLookupTableDto } from '../services/fileMaster/dto/FileMasterSupplierLookupTableDto';
import { FileMasterBuyerLookupTableDto } from '../services/fileMaster/dto/FileMasterBuyerLookupTableDto';
import fileMasterService from '../services/fileMaster/filemasterservices';
//import { EnumMovementType } from '../enum'

class FileMasterStore {
  @observable fileMaster!: PagedResultDto<GetFileMasterForViewDto>;
  @observable partlookupdata!: PagedResultDto<FileMasterPartLookupTableDto>;
  @observable buyerlookupdata!: PagedResultDto<FileMasterBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<FileMasterSupplierLookupTableDto>;
  @observable editUser!: GetFileMasterForEditOutput;

  @action
  async create(createOrEditFileMasterDto: CreateOrEditFileMasterDto) {
    let result = await fileMasterService.create(createOrEditFileMasterDto);
    this.fileMaster.items.push(result);
  }

  @action
  async update(createOrEditFileMasterDto: CreateOrEditFileMasterDto) {
    let result = await fileMasterService.update(createOrEditFileMasterDto);
    this.fileMaster.items = this.fileMaster.items.map((x: GetFileMasterForViewDto) => {
      if (x.FileMaster.Id === createOrEditFileMasterDto.Id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await fileMasterService.delete(entityDto);
    this.fileMaster.items = this.fileMaster.items.filter((x: GetFileMasterForViewDto) => x.FileMaster.Id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await fileMasterService.get(entityDto);
    this.editUser = result;
  }

  @action
  async fileMasterData() {
    this.editUser = {
        CreateOrEditFileMasterDto: {
            AnnexureId: 0,
            SupplementaryId: 0,
            PartId: 0,
            FileName: '',
            Token: '',
            Id: 0,
            SupplementaryInvoicePath: '',
            SupplierId: 0,
            BuyerId: 0,
            AnnecurePath:'',
            SupplementaryInvoicePath3:''
          },
          PartPartNo: '',
          BuyerName: '',
          SupplierName: '',
          Id: 0
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedFileMasterResultRequestDto) {
    let result = await fileMasterService.getAll(pagedFilterAndSortedRequest);
    this.fileMaster = result;
  }

  @action
  async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedFileMasterResultRequestDto) {
    let result = await fileMasterService.getAllPartForLookupTable(pagedFilterAndSortedRequest);
    this.partlookupdata = result;
  }
  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedFileMasterResultRequestDto) {
    let result = await fileMasterService.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedFileMasterResultRequestDto) {
    let result = await fileMasterService.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }
  async importExcel(file: File): Promise<any> {
      try {
          if (!file) {
              throw new Error("No file provided");
          }
          
          const items = await fileMasterService.inportExceldata(file);
          return items;
      } catch (error) {
          console.error("Error importing Excel file:", error);
          throw error; // Optionally rethrow the error to propagate it
      }
  
}
}

export default FileMasterStore;

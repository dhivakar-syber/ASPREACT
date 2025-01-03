import { action, observable } from 'mobx';

import { CreateOrEditPartDto } from '../services/parts/dto/CreateOrEditPartDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import { GetPartForEditOutput } from '../services/parts/dto/GetPartForEditOutput';
import { GetPartForViewDto } from '../services/parts/dto/GetPartForViewDto';
import { PartBuyerLookupTableDto } from '../services/parts/dto/PartBuyerLookupTableDto';
import { PartSupplierLookupTableDto } from '../services/parts/dto/PartSupplierLookupTableDto';
import partsServices from '../services/parts/partsServices';

class PartsStore {
  @observable parts!: PagedResultDto<GetPartForViewDto>;
  @observable buyerlookupdata!: PagedResultDto<PartBuyerLookupTableDto>;
  @observable supplierlookupdata!: PagedResultDto<PartSupplierLookupTableDto>;
  @observable editUser!: GetPartForEditOutput;

  @action
  async create(createOrEditPartDto: CreateOrEditPartDto) {
    let result = await partsServices.create(createOrEditPartDto);
    this.parts.items.push(result);
  }

  @action
  async update(CreateOrEditPartDto: CreateOrEditPartDto) {
    let result = await partsServices.update(CreateOrEditPartDto);
    this.parts.items = this.parts.items.map((x: GetPartForViewDto) => {
      if (x.Part.Id === CreateOrEditPartDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await partsServices.delete(entityDto);
    this.parts.items = this.parts.items.filter((x: GetPartForViewDto) => x.Part.Id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await partsServices.get(entityDto);
    this.editUser = result;
  }

  @action
  async createParts() {
    this.editUser = {
        Part: {
            
            id: 0,
            PartNo:'',
            Description:'',
            BuyerId: 0,
            SupplierId: 0,           
          },          
          BuyerName: '',
          SupplierName: '',          
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await partsServices.getAll(pagedFilterAndSortedRequest);
    this.parts = result;
  }

 
  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await partsServices.getAllBuyerForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await partsServices.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }


}

export default PartsStore;

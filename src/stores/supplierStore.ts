import { action, observable } from 'mobx';

import { CreateOrEditSupplierDto } from '../services/supplier/dto/CreateOrEditSupplierDto';
import { GetSupplierForViewDto } from '../services/supplier/dto/GetSupplierForViewDto';
import { SupplierUserLookupTableDto } from '../services/supplier/dto/SupplierUserLookupTableDto';
import { GetSupplierForEditOutput } from '../services/supplier/dto/GetSupplierForEditOutput';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { EntityDto } from '../services/dto/entityDto';
import supplierservice  from '../services/supplier/supplierservice';

class supplierStore {
  @observable supplier!: PagedResultDto<GetSupplierForViewDto>;
  @observable supplierlookupdata!: PagedResultDto<SupplierUserLookupTableDto>;
  @observable editUser!: GetSupplierForEditOutput;

  @action
  async create(createOrEditSupplierDto:CreateOrEditSupplierDto){
    let result=await supplierservice.create(createOrEditSupplierDto);
    this.supplier.items.push(result)
  }

  @action
  async update(createOrEditSupplierDto: CreateOrEditSupplierDto) {
    let result = await supplierservice.update(createOrEditSupplierDto);
    this.supplier.items.push(result)
  }


  @action
  async createSupplierData() {
    this.editUser = {
        supplier: {
            userId: 0,
            name: '',
            code:''
          },
          userName:''
        };
  }


  @action
  async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await supplierservice.getAllSupplierForLookupTable(pagedFilterAndSortedRequest);
    this.supplierlookupdata = result;
  }
  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await supplierservice.getAll(pagedFilterAndSortedRequest);
    this.supplier = result;
  }
  @action
  async get(entityDto: EntityDto) {
    let result = await supplierservice.get(entityDto);
    this.editUser = result;
  console.log("hello! Its me");

  }
  @action
  async delete(entityDto: EntityDto) {
    await supplierservice.delete(entityDto);
    this.supplier.items = this.supplier.items.filter((x: GetSupplierForViewDto) => x.id !== entityDto.id);
  }

}
export default supplierStore;

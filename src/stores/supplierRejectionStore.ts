import { action, observable } from 'mobx';

import { CreateOrEditSupplierRejectionDto } from '../services/supplierRejections/dto/createOrEditSupplierRejectionDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedSupplierRejectionResultRequestDto } from '../services/supplierRejections/dto/PagedSupplierRejectionResultRequestDto';
import { GetSupplierRejectionForEditOutput } from '../services/supplierRejections/dto/getSupplierRejectionForEditOutput';
import { GetSupplierRejectionForViewDto } from '../services/supplierRejections/dto/getSupplierRejectionForViewDto';
import supplierRejectionService from '../services/supplierRejections/supplierRejectionService';

class SupplierRejectionsQuery {
  @observable supplierRejections!: PagedResultDto<GetSupplierRejectionForViewDto>;
  @observable editUser!: GetSupplierRejectionForEditOutput;

  @action
  async create(createOrEditSupplierRejectionDto: CreateOrEditSupplierRejectionDto) {
    let result = await supplierRejectionService.create(createOrEditSupplierRejectionDto);
    this.supplierRejections.items.push(result);
  }

  @action
  async update(createOrEditSupplierRejectionDto: CreateOrEditSupplierRejectionDto) {
    let result = await supplierRejectionService.update(createOrEditSupplierRejectionDto);
    this.supplierRejections.items = this.supplierRejections.items.map((x: GetSupplierRejectionForViewDto) => {
      if (x.id === createOrEditSupplierRejectionDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await supplierRejectionService.delete(entityDto);
    this.supplierRejections.items = this.supplierRejections.items.filter((x: GetSupplierRejectionForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await supplierRejectionService.get(entityDto);
    this.editUser = result;
  }

  @action
  async createSupplierRejections() {
    this.editUser = {
        SupplierRejection: {
            code:'',
            description:'',
            id:0,
          },
          id: 0
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedSupplierRejectionResultRequestDto) {
    let result = await supplierRejectionService.getAll(pagedFilterAndSortedRequest);
    this.supplierRejections = result;
  }
}

export default SupplierRejectionsQuery;
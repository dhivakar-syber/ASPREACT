import {CreateOrEditSupplierRejectionDto} from './dto/createOrEditSupplierRejectionDto';
import { EntityDto } from '../dto/entityDto';
import { GetSupplierRejectionForViewDto } from './dto/getSupplierRejectionForViewDto';
import {GetSupplierRejectionForEditOutput} from './dto/getSupplierRejectionForEditOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import {PagedSupplierRejectionResultRequestDto} from './dto/PagedSupplierRejectionResultRequestDto';
import http from '../httpService';

class SupplierRejectionService{
      public async create(createOrEditSupplierRejectionDto: CreateOrEditSupplierRejectionDto) {
        let result = await http.post('api/services/app/SupplierRejections/CreateOrEdit', createOrEditSupplierRejectionDto);
        return result.data.result;
      }
    
      public async delete(entityDto: EntityDto) {
        let result = await http.delete('api/services/app/SupplierRejections/Delete', { params: entityDto });
        return result.data;
      }
    
      public async get(entityDto: EntityDto): Promise<GetSupplierRejectionForEditOutput> {
        let result = await http.get('api/services/app/SupplierRejections/GetSupplierRejectionForEdit', { params: entityDto });
        return result.data.result;
      }
    
      public async getAll(pagedFilterAndSortedRequest: PagedSupplierRejectionResultRequestDto): Promise<PagedResultDto<GetSupplierRejectionForViewDto>> {
        let result = await http.get('api/services/app/SupplierRejections/GetAll', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }
    
      public async update(CreateOrEditSupplierRejectionDto: CreateOrEditSupplierRejectionDto) {
        let result = await http.post('api/services/app/SupplierRejections/CreateOrEdit', CreateOrEditSupplierRejectionDto);
        return result.data.result;
      }
}
export default new SupplierRejectionService();
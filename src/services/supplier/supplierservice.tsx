import { CreateOrEditSupplierDto } from "./dto/CreateOrEditSupplierDto";
import { GetAllSuppliersForExcelInput } from './dto/GetAllSuppliersForExcelInput';
import { GetSupplierForEditOutput } from "./dto/GetSupplierForEditOutput";
import { SupplierUserLookupTableDto } from "./dto/SupplierUserLookupTableDto";
import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedTenantResultRequestDto} from './dto/PagedTenantResultRequestDto';
import { GetSupplierForViewDto } from './dto/GetSupplierForViewDto';
import http from "../httpService";

class supplierservice{
  public async create(createOrEditSupplierDto: CreateOrEditSupplierDto) {
  let result = await http.post('/api/services/app/Suppliers/CreateOrEdit', createOrEditSupplierDto);
  return result.data.result;
}

public async delete(entityDto: EntityDto) {
  let result = await http.delete('/api/services/app/Suppliers/Delete', { params: entityDto });
  return result.data;
}

public async getAll(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<GetSupplierForViewDto>> {
  let result = await http.get('api/services/app/Suppliers/GetAll', { params: pagedFilterAndSortedRequest });
  return result.data.result;
}
public async get(entityDto: EntityDto): Promise<GetSupplierForEditOutput> {
  let result = await http.get('api/services/app/supplier/GetSupplierForEditOutput', { params: entityDto });
  return result.data.result;
}

public async getSuppliersToExcel(GetAllSuppliersForExcelInput: GetAllSuppliersForExcelInput) {
  let result = await http.get('/api/services/app/Suppliers/GetSuppliersToExcel', { params: GetAllSuppliersForExcelInput });
  return result.data.result;
}

public async update(createOrEditSupplierDto: CreateOrEditSupplierDto) {
  let result = await http.post('/api/services/app/Suppliers/CreateOrEdit', createOrEditSupplierDto);
  return result.data.result;
}

public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<SupplierUserLookupTableDto>>{
  let result = await http.get('/api/services/app/Suppliers/GetAllUserForLookupTable', { params: pagedFilterAndSortedRequest });
  return result.data.result;

}
}   
export default new supplierservice();
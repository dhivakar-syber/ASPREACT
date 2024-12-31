import {CreateOrEditPartDto} from './dto/CreateOrEditPartDto';
import { EntityDto } from '../dto/entityDto';
import { GetPartForViewDto } from './dto/GetPartForViewDto';
import {GetPartForEditOutput} from './dto/GetPartForEditOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import {PagedPartsResultRequestDto} from './dto/PagedPartsResultRequestDto';
import {PartBuyerLookupTableDto} from './dto/PartBuyerLookupTableDto';
import {PartSupplierLookupTableDto} from './dto/PartSupplierLookupTableDto';
import http from '../httpService';

class cbfcdataService {
  public async create(createOrEditPartDto: CreateOrEditPartDto) {
    let result = await http.post('api/services/app/Parts/CreateOrEdit', createOrEditPartDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/Parts/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetPartForEditOutput> {
    let result = await http.get('api/services/app/Parts/GetPartForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedPartsResultRequestDto): Promise<PagedResultDto<GetPartForViewDto>> {
    let result = await http.get('api/services/app/Parts/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditCBFCdataDto: CreateOrEditPartDto) {
    let result = await http.post('api/services/app/Parts/CreateOrEdit', createOrEditCBFCdataDto);
    return result.data.result;
  }
 

  public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedPartsResultRequestDto): Promise<PagedResultDto<PartBuyerLookupTableDto>>{
    let result = await http.get('api/services/app/Parts/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedPartsResultRequestDto): Promise<PagedResultDto<PartSupplierLookupTableDto>>{
    let result = await http.get('api/services/app/CBFCdatas/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  
}

export default new cbfcdataService();

import {CreateOrEditCBFCdataDto} from './dto/createOrEditCBFCdataDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetCBFCdataForViewDto } from './dto/getCBFCdataForViewDto';
import {GetCBFCdataForEditOutput} from './dto/getCBFCdataForEditOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedTenantResultRequestDto} from './dto/PagedTenantResultRequestDto';
import {CBFCdataPartLookupTableDto} from './dto/cbfcdataPartLookupTableDto';
import http from '../httpService';

class cbfcdataService {
  public async create(createOrEditCBFCdataDto: CreateOrEditCBFCdataDto) {
    let result = await http.post('api/services/app/CBFCdatas/CreateOrEdit', createOrEditCBFCdataDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/CBFCdatas/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetCBFCdataForEditOutput> {
    let result = await http.get('api/services/app/CBFCdatas/GetCBFCdataForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<GetCBFCdataForViewDto>> {
    let result = await http.get('api/services/app/CBFCdatas/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditCBFCdataDto: CreateOrEditCBFCdataDto) {
    let result = await http.post('api/services/app/CBFCdatas/CreateOrEdit', createOrEditCBFCdataDto);
    return result.data.result;
  }

  public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<CBFCdataPartLookupTableDto>>{
    let result = await http.get('api/services/app/CBFCdatas/GetAllPartForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
}

export default new cbfcdataService();

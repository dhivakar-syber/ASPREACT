import {CreateOrEditBuyerDto} from './dto/createOrEditBuyerDto';
import { EntityDto } from '../dto/entityDto';
import { GetBuyerForViewDto } from './dto/getBuyerForViewDto';
import {GetBuyerForEditOutput} from './dto/getBuyerForEditOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import {PagedBuyerResultRequestDto} from './dto/PagedBuyerResultRequestDto';
import {BuyerUserLookupTableDto} from './dto/buyerUserLookupTableDto';
//import {BuyerBuyerLookupTableDto} from './dto/buyerBuyerLookupTableDto';
import http from '../httpService';

class buyerService {
  // public async create(createOrEditBuyerDto: CreateOrEditBuyerDto) {
  //   let result = await http.post('/api/services/app/Buyers/CreateOrEdit', createOrEditBuyerDto);
  //   //console.log(result.data.result)
  //   return result.data.result;
  // }

  public async create(createOrEditBuyerDto: CreateOrEditBuyerDto) {
    let result = await http.post('api/services/app/Buyers/CreateOrEdit', createOrEditBuyerDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/api/services/app/Buyers/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetBuyerForEditOutput> {
    let result = await http.get('/api/services/app/Buyers/GetBuyerForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedBuyerResultRequestDto): Promise<PagedResultDto<GetBuyerForViewDto>> {
    let result = await http.get('api/services/app/Buyers/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditBuyerDto: CreateOrEditBuyerDto) {
    let result = await http.post('api/services/app/Buyers/CreateOrEdit', createOrEditBuyerDto);
    return result.data.result;
  }

  // public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedBuyerResultRequestDto): Promise<PagedResultDto<BuyerUserLookupTableDto>>{
  //   let result = await http.get('/api/services/app/Buyers/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
  //   return result.data.result;
  // }

  public async getAllBuyerUserForLookupTable(pagedFilterAndSortedRequest: PagedBuyerResultRequestDto): Promise<PagedResultDto<BuyerUserLookupTableDto>>{
    let result = await http.get('/api/services/app/Buyers/GetAllUserForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
}

export default new buyerService();

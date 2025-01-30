import { action, observable } from 'mobx';

import { CreateOrEditBuyerDto } from '../services/buyers/dto/createOrEditBuyerDto';
import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto'; // Ensure proper import, no "type" keyword needed
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto'; // Ensure proper import, no "type" keyword needed
import buyerservice from '../services/buyers/buyerService';

import { GetBuyerForEditOutput } from '../services/buyers/dto/getBuyerForEditOutput';
import { BuyerBuyerLookupTableDto } from '../services/buyers/dto/buyerBuyerLookupTableDto';
import { BuyerUserLookupTableDto } from '../services/buyers/dto/buyerUserLookupTableDto';
//import { CBFCdataSupplierLookupTableDto } from '../services/cbfcdata/dto/cbfcdataSupplierLookupTableDto';
//import { CBFCdataBuyerLookupTableDto } from '../services/buyer/dto/buyerBuyerLookupTableDto';
import { GetBuyerForViewDto } from '../services/buyers/dto/getBuyerForViewDto';

class BuyerStore {
  @observable buyer!: PagedResultDto<GetBuyerForViewDto>;
  @observable buyerlookupdata!: PagedResultDto<BuyerBuyerLookupTableDto>;
  @observable l3userlookupdata!: PagedResultDto<BuyerUserLookupTableDto>;
  @observable l4userlookupdata!: PagedResultDto<BuyerUserLookupTableDto>;
  @observable editUser!: GetBuyerForEditOutput;

  @action
  async create(createOrEditBuyerDto: CreateOrEditBuyerDto) {
    let result = await buyerservice.create(createOrEditBuyerDto);
    this.buyer.items.push(result);
  }

  @action
  async update(createOrEditBuyerDto: CreateOrEditBuyerDto) {
    let result = await buyerservice.update(createOrEditBuyerDto);
    this.buyer.items = this.buyer.items.map((x: GetBuyerForViewDto) => {
      if (x.id === createOrEditBuyerDto.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await buyerservice.delete(entityDto);
    this.buyer.items = this.buyer.items.filter((x: GetBuyerForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await buyerservice.get(entityDto);
    this.editUser = result;
  }

  @action
  async createBuyer() {
    this.editUser = {
        buyer: {
          name: '',
          shortId: '',
          department: 0,
          id: 0,
          reportingTo: '',
          userId  : 0,
          l3User: 0,
          l4User: 0
        },
          UserName:'',
          UserName2: '',
          UserName3: '',
          id:0
        };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await buyerservice.getAll(pagedFilterAndSortedRequest);
    this.buyer = result;
  }

  @action
  async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await buyerservice.getAllBuyerUserForLookupTable(pagedFilterAndSortedRequest);
    this.buyerlookupdata = result;
  }
  @action
  async getAllBuyerl3UserForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await buyerservice.getAllBuyerUserForLookupTable(pagedFilterAndSortedRequest);
    this.l3userlookupdata = result;
  }
  @action
  async getAllBuyerl4UserForLookupTable(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await buyerservice.getAllBuyerUserForLookupTable(pagedFilterAndSortedRequest);
    this.l4userlookupdata = result;
  }

}

export default BuyerStore;

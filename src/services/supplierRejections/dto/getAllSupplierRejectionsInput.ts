import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface GetAllSupplierRejectionsInput extends PagedFilterAndSortedRequest {
  filter:string,
  codeFilter:string,
  descriptionFilter:string,
}

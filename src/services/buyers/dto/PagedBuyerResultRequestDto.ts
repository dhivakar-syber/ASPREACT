import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedBuyerResultRequestDto extends PagedFilterAndSortedRequest  {
    keyword: string
}

import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedGRNResultRequestDto extends PagedFilterAndSortedRequest  {
    keyword: string
}

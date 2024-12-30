import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedDisputesResultRequestDto extends PagedFilterAndSortedRequest  {
    keyword: string
}

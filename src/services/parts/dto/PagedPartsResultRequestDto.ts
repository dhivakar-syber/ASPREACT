import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedPartsResultRequestDto extends PagedFilterAndSortedRequest  {
    keyword: string
}

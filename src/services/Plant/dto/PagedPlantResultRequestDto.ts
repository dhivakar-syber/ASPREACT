import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedPlantResultRequestDto extends PagedFilterAndSortedRequest  {
    keyword: string
}

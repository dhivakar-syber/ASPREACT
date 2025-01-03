import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedTenantResultRequestDto extends PagedFilterAndSortedRequest  {
    keyword: string;
    maxResultCount: number;
    skipCount: number;
}

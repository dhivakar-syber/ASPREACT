import {CreateOrEditApprovalWorkflowDto} from './dto/createOrEditApprovalWorkflowDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetApprovalWorkflowForViewDto } from './dto/getApprovalWorkflowForViewDto';
import {GetApprovalWorkflowForEditOutput} from './dto/getApprovalWorkflowForEditOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedApprovalWorkflowResultRequestDto} from './dto/PagedApprovalWorkflowResultRequestDto';
import {ApprovalWorkflowBuyerLookupTableDto} from './dto/approvalWorkflowBuyerLookupTableDto';
import {ApprovalWorkflowSupplierLookupTableDto} from './dto/approvalWorkflowSupplierLookupTableDto';
import {ApprovalWorkflowUserLookupTableDto} from './dto/approvalWorkflowUserLookupTableDto';
import http from '../httpService';

class approvalWorkflowsService {
  public async create(createOrEditApprovalWorkflowDto: CreateOrEditApprovalWorkflowDto) {
    let result = await http.post('api/services/app/ApprovalWorkflows/CreateOrEdit', createOrEditApprovalWorkflowDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/ApprovalWorkflows/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetApprovalWorkflowForEditOutput> {
    let result = await http.get('api/services/app/ApprovalWorkflows/GetApprovalWorkflowForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedApprovalWorkflowResultRequestDto): Promise<PagedResultDto<GetApprovalWorkflowForViewDto>> {
    let result = await http.get('api/services/app/ApprovalWorkflows/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditApprovalWorkflowDto: CreateOrEditApprovalWorkflowDto) {
    let result = await http.post('api/services/app/ApprovalWorkflows/CreateOrEdit', createOrEditApprovalWorkflowDto);
    return result.data.result;
  }

  public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedApprovalWorkflowResultRequestDto): Promise<PagedResultDto<ApprovalWorkflowBuyerLookupTableDto>>{
    let result = await http.get('api/services/app/ApprovalWorkflows/GetAllUserForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedApprovalWorkflowResultRequestDto): Promise<PagedResultDto<ApprovalWorkflowSupplierLookupTableDto>>{
    let result = await http.get('api/services/app/ApprovalWorkflows/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedApprovalWorkflowResultRequestDto): Promise<PagedResultDto<ApprovalWorkflowUserLookupTableDto>>{
    let result = await http.get('api/services/app/ApprovalWorkflows/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async inportExceldata(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);  // Append the file to FormData

    // Sending the request with the FormData containing the file
    let result = await http.post('api/services/app/ApprovalWorkflows/ImportCBFCDataFromExcel', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'  // Ensure the Content-Type is set for file uploads
        }
    });

    return result.data.result;
  }
}

export default new approvalWorkflowsService();

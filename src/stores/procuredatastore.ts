import { action, observable } from 'mobx';
import * as XLSX from 'xlsx';
import { CreateOrEditProcureDataDto } from '../services/procuredatas/dto/CreateOrEditProcureDataDto';
import { EntityDto } from '../services/dto/entityDto';
import { GetRoles } from '../services/user/dto/getRolesOuput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedProcureResultRequestDto } from '../services/procuredatas/dto/PagedProcureResultRequestDto';
import Procuredataservice from '../services/procuredatas/procuredataservice';
import { GetProcureDataForViewDto } from '../services/procuredatas/dto/GetProcureDataForViewDto';

class ProcureStore {
  @observable procure!: PagedResultDto<GetProcureDataForViewDto>;
  @observable editProcure!: CreateOrEditProcureDataDto;
  @observable roles: GetRoles[] = [];

  @action
  async create(createProcureInput: CreateOrEditProcureDataDto) {
    let result = await Procuredataservice.create(createProcureInput);
    this.procure.items.push(result);
  }

  @action
  async update(updateProcureInput: CreateOrEditProcureDataDto) {
    let result = await Procuredataservice.update(updateProcureInput);
    this.procure.items = this.procure.items.map((x: GetProcureDataForViewDto) => {
      if (x.ProcureData.Id === updateProcureInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await Procuredataservice.delete(entityDto);
    this.procure.items = this.procure.items.filter((x: GetProcureDataForViewDto) => x.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await Procuredataservice.get(entityDto);
    this.editProcure = result;
  }

  @action
  async createProcure() {
    this.editProcure = {
      id: 0,
      ValidFrom: new Date(),
      ValidTo: new Date(),
      ContractNo: '',
      ContractDate: '',
      ApprovalDate: new Date(),
      PlantCode: '',
      VersionNo: 0,
      PartId: 0,
      BuyerId: 0,
      SupplierId: 0,
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedProcureResultRequestDto) {
    let result = await Procuredataservice.getAll(pagedFilterAndSortedRequest);
    this.procure = result;
  }

  async getExcelExport() {
    try {
        const result = await Procuredataservice.getexceldata();
        const items = result
        ?.map((item: any) => {
            // Extract only the specific fields you need from procureData
            return item.procureData ? {
                PartNo: item.partPartNo,
                BuyerName: item.buyerName,
                ValidFrom	: item.procureData.validFrom,
                ValidTo :  item.procureData.validTo,
                ContractNo : item.procureData.contractNo,
                ContractDate : item.procureData.contractDate,
                ApprovalDate : item.procureData.approvalDate,
                PlantCode : item.procureData.plantCode,
                Version : item.procureData.versionNo,
                 
            } : null;  
        })
        .filter((data: any) => data)  // Filter out null values
        .flat();  // Flatten the array if necessary
    
    if (!items?.length) {
        console.warn("No valid ProcureData found for export.");
        return;
    }
    
        

        const ws = XLSX.utils.json_to_sheet(items);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Procure Data");
        XLSX.writeFile(wb, "ProcureData.xlsx");

        console.log("Export successful: ProcureData.xlsx");
    } catch (error) {
        console.error("Error exporting Excel:", error);
    }
   }

    
  async changeLanguage(languageName: string) {
    await Procuredataservice.changeLanguage({ languageName: languageName });
  }
};

export default ProcureStore;

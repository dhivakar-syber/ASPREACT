import { action, observable } from 'mobx';
import { CreateOrEditPlantDto } from '../services/Plant/dto/CreateOrEditPlantDto';
import { EntityDto } from '../services/dto/entityDto';
import { GetRoles } from '../services/user/dto/getRolesOuput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { GetPlantForViewDto } from '../services/Plant/dto/GetPlantForViewDto';
import plantservices from '../services/Plant/plantservices';
import {PagedPlantResultRequestDto} from '../services/Plant/dto/PagedPlantResultRequestDto'

class PlantStore {
  @observable plant!: PagedResultDto<GetPlantForViewDto>;
  @observable editPlant!: CreateOrEditPlantDto;
  @observable roles: GetRoles[] = [];

  @action
  async create(createOrEditPlantDto: CreateOrEditPlantDto) {
    let result = await plantservices.create(createOrEditPlantDto);
    this.plant.items.push(result);
  }

  @action
  async update(updatePlantInput: CreateOrEditPlantDto) {
    let result = await plantservices.update(updatePlantInput);
    this.plant.items = this.plant.items.map((x: GetPlantForViewDto) => {
      if (x.PlantDto.id === updatePlantInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await plantservices.delete(entityDto);
    this.plant.items = this.plant.items.filter((x: GetPlantForViewDto) => x.PlantDto.id !== entityDto.id);
  }

  @action
  async get(entityDto: EntityDto) {
    let result = await plantservices.get(entityDto);
    this.editPlant = result;
  }

  @action
  async createPlant() {
    this.editPlant = {
      id: 0,
      Name:'',
    Description:''
    };
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedPlantResultRequestDto) {
    let result = await plantservices.getAll(pagedFilterAndSortedRequest);
    this.plant = result;
  }

 

//    async importExcel(file: File): Promise<any> {
//     try {
//         if (!file) {
//             throw new Error("No file provided");
//         }
        
//         const items = await procuredataservice.inportExceldata(file);
//         return items;
//     } catch (error) {
//         console.error("Error importing Excel file:", error);
//         throw error; // Optionally rethrow the error to propagate it
//     }
// }

    
  
};

export default PlantStore;

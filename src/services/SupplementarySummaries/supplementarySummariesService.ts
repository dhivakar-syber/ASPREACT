import {CreateOrEditSupplementarySummaryDto} from './dto/createOrEditSupplementarySummaryDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetSupplementarySummaryForViewDto } from './dto/getSupplementarySummaryForViewDto';
import {GetSupplementarySummaryForEditOutput} from './dto/getSupplementarySummaryForEditOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedSupplementarySummaryResultRequestDto} from './dto/PagedSupplementarySummaryResultRequestDto';
import {SupplementarySummaryPartLookupTableDto} from './dto/supplementarySummaryPartLookupTableDto';
import {supplementarySummaryBuyerLookupTableDto} from './dto/supplementarySummaryBuyerLookupTableDto';
import {SupplementarySummarySupplierLookupTableDto} from './dto/supplementarySummarySupplierLookupTableDto';
//import {SupplementaryData} from './dto/checkSignatureInputDto';
import http from '../httpService';

import {SupplierDashboardInput} from '../../scenes/Dashboard/SupplierDashboardInput'
import { BuyerDashboardInput } from '../../scenes/BuyerDashboard/BuyerDashboardInput';
import { AccountDashboardInput } from '../../scenes/Accounts Dashboard/AccountsDashboardInput';
import { l4dashboardinput } from '../../scenes/L3 & L4 Dashboard/l4dashboardinput';
import { FileDto } from '../supplier/dto/FileDto';

class supplementarySummariesService{

    public async loadsupplementarySummary(input: SupplierDashboardInput) {
        try {
          
          const result = await http.get(
            'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryTest',{ params: input },
             
          );
          return result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
    }

    public async Queryexecution(input:string) {
      try {
        
        const result = await http.get(
          'api/services/app/SupplementarySummaries/getsqldetails',{ params:{query:input}  },
           
        );
        return result.data.result;
      } catch (error) {
        console.error('Error fetching sql:', error);
        throw error; 
      }
  }


    public async loadl4supplementarySummary(input: l4dashboardinput) {
      try {
        
        const result = await http.get(
          'api/services/app/SupplementarySummaries/L4DashboardDetails',{ params: input },
           
        );
        return result;
      } catch (error) {
        console.error('Error fetching supplementary summaries:', error);
        throw error; 
      }
  }



    public async accountsDashboardSummaries(input: AccountDashboardInput) {
      try {
        
        const result = await http.get(
          'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryaccountdashboard',{ params: input },
           
        );
        return result;
      } catch (error) {
        console.error('Error fetching supplementary summaries:', error);
        throw error; 
      }
  }
    public async accountsDashboardSummariesExcel(input: AccountDashboardInput): Promise<FileDto> {
      try {
        
        const result = await http.get(
          'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryaccountdashboardinExcel',{ params: input },
           
        );
        return result.data.result;
      } catch (error) {
        console.error('Error fetching supplementary summaries:', error);
        throw error; 
      }
  }

  public async GetAllsupplementarySummarybyId(input: number) {
    try {
      
      const result = await http.get(
        'api/services/app/SupplementarySummaries/GetAllsupplementarySummarybyId',{ params:{DocId:input}},
         
      );
      return result.data.result;
    } catch (error) {
      console.error('Error fetching supplementary summaries:', error);
      throw error; 
    }
}
    public async BuyerdashboardloadsupplementarySummary(input: BuyerDashboardInput) {
      try {
        
        const result = await http.get(
          'api/services/app/SupplementarySummaries/GetAllsupplementarySummarybuyerdashboard',{ params: input },
           
        );
        return result;
      } catch (error) {
        console.error('Error fetching supplementary summaries:', error);
        throw error; 
      }
  }
    public async Buyer_approvaltab_loadsupplementarySummary(input: SupplierDashboardInput) {
      try {
        
        const result = await http.get(
          'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryTest',{ params: input },
           
        );
        return result;
      } catch (error) {
        console.error('Error fetching supplementary summaries:', error);
        throw error; 
      }
  }
    public async GetAllSuppliers() {
      try {
        
        const result = await http.get(
          'api/services/app/SupplementarySummaries/GetLoginSupplier2'
           
        );
        return result;
      } catch (error) {
        console.error('Error fetching supplementary summaries:', error);
        throw error; 
      }
  }

  public async GetLoginBuyer() {
    try {
      
      const result = await http.get(
        'api/services/app/SupplementarySummaries/GetLoginBuyer2'
         
      );
      return result;
    } catch (error) {
      console.error('Error fetching supplementary summaries:', error);
      throw error; 
    }
}


//   public async GetAllBuyers(input:string) {
//     try {
      
//       const result = await http.get(
//         'api/services/app/Buyers/Getallbuyers',{ params: { supplierid:input } },
         
//       );
//       return result;
//     } catch (error) {
//       console.error('Error fetching supplementary summaries:', error);
//       throw error; 
//     }
// }
public async GetAllSuppliersaccountsdashboard(input:number[]) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllSuppliersaccountsdashboard',{ params: { buyerIds:input } },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  } 
}
public async GetAllBuyersforL4Dashboard(input:number[]) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllBuyersforl4Dashboard',{ params: { teams:input } },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}
public async GetAllBuyersList(input:number) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/Getallbuyers',{ params: { supplierid:input } },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}
public async GetAllTeams() {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllTeams',
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}

public async GetAllSupplierListBuyerDashboard(input:number) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/Getallbuyerdashboardsuppliers',{ params: { buyerid:input } },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}
public async GetAllPartNumbersList(supplierid:number,buyerids:number[]) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllPartNumbersList',{ params: { buyerids:buyerids,supplierid:supplierid } },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}
public async BuyerDashboardGetAllPartNumbersList(buyerid:number,Supplierids:number[]) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllPartNumbersListbuyerdashboard',{ params: { supplierids:Supplierids,buyerid:buyerid } },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}
public async AccountDashboardGetAllPartNumbersList(buyerids:number[],Supplierids:number[]) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllPartNumbersListaccountdashboard',{ params: { supplierids:Supplierids,buyerids:buyerids } },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}
public async GetAllParts(supplierid:string,buyerid:string) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllPartNumbers',{ params: { supplierid:supplierid,buyerid:buyerid} },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}

    public async carddetails(input: SupplierDashboardInput) {
      try {
        
        const result = await http.get(
          'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryContractDataTestvalue',{ params: input },
           
        );
        return result;
      } catch (error) {
        console.error('Error fetching supplementary summaries:', error);
        throw error; 
      }
  }

  public async accounntcarddetails(input: AccountDashboardInput) {
    try {
      
      const result = await http.get(
        'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryContractDataTestvalueaccountsdashboard',{ params: input },
         
      );
      return result;
    } catch (error) {
      console.error('Error fetching supplementary summaries:', error);
      throw error; 
    }
}


public async l4carddetails(input: l4dashboardinput) {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryContractDataTestvalueaccountsdashboard',{ params: input },
       
    );
    return result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}



  public async Buyerdashboardcarddetails(input: BuyerDashboardInput) {
    try {
      
      const result = await http.get(
        'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryContractDataTestvaluebuyerdahboard',{ params: input },
         
      );
      return result;
    } catch (error) {
      console.error('Error fetching supplementary summaries:', error);
      throw error; 
    }
}
      public async grndata(id: number) {
        try {
          
          const result = await http.get(
            'api/services/app/SupplementarySummaries/GetGrnCbfcDetail',{ params: { sid:id } },
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }

      public async annexuredata(id: number) {
        try {
          
          const result = await http.get(
            'api/services/app/SupplementarySummaries/GetAllSupplementaryInvoice',{ params: { supplementaryid:id } },
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }
      public async GetFile(filepath: string) {
        try {
          
          const result = await http.get(
            'api/services/app/SupplementarySummaries/GetFile',{ params: { filepath:filepath } },
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }
      public async DownloadExcel(filepath: string) {
        try {
          
          const result = await http.post(
            `api/services/app/SupplementarySummaries/DownloadExcel?filepath=${filepath}`,'' ,
            {
              headers: {
                  'accept': 'text/plain',
              }
          }
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }
      public async supplementaryuploadeddetails(id: string) {
        try {
            const result = await http.post(
                `api/services/app/SupplementarySummaries/Supplementaryuploadeddetails?supplementaryid=${id}`, // Use the query parameter in the URL
                '', // Empty body
                {
                    headers: {
                        'accept': 'text/plain',
                    }
                }
            );
            //console.log("New Table data",result.data.result);
            return result.data.result;
        } catch (error) {
            console.error('Error fetching supplementary summaries:', error);
            throw error;
        }
    }
      public async supplementaryInvoiceSubmit(id: number,remarks:string,isResubmit:boolean) {
        try {
          
          const result = await http.post(
            `api/services/app/SupplementarySummaries/supplementaryInvoiceSubmit?supplementaryid=${id}&submitRemarks=${remarks}&isResubmit=${isResubmit}`,
            '',
            {
              headers: {
                'accept': 'text/plain',
            }
          }
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }
      public async supplementaryInvoicebuyerapprove(id: number,remarks:string) {
        try {
          
          const result = await http.post(
            `api/services/app/SupplementarySummaries/supplementaryInvoicebuyerapprove?fileid=${id}&accountsapproveremarks=${remarks}`,'',
            {
              headers: {
                'accept': 'text/plain',
            }
          }
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }
      public async supplementaryInvoicebuyerreject(id: number,remarks:string) {
        try {
          
          const result = await http.post(
            `api/services/app/SupplementarySummaries/supplementaryInvoicebuyerreject?fileid=${id}&accountsapproveremarks=${remarks}`,'',
            
            {
              headers: {
                'accept': 'text/plain',
            }
          }
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }

      public async SupplierRaisedQuery(supplementaryid: number) {
        try {
          
          //console.log('SupID',supplementaryid)
          const result = await http.post(
            `api/services/app/SupplementarySummaries/SupplierQueryToBuyer?supplementaryid=${supplementaryid}`,
            
            {
              headers: {
                'accept': 'text/plain',
            }
          }
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }
      public async Implementationeffect(id: number,date:string) {
        try {
          
          const result = await http.post(
            `api/services/app/SupplementarySummaries/Implementationeffect?supplementaryId=${id}&implementationdate=${date}`,'',
            
            {
              headers: {
                'accept': 'text/plain',
            }
          }
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }
      public async supplementaryInvoiceAccountApprove(id: number,remarks:string,accNo:string,accdate:any) {
        try {
          
          const result = await http.post(
            `api/services/app/SupplementarySummaries/supplementaryInvoiceaccountapprove?fileid=${id}&accountsapproveremarks=${remarks}&accNo=${accNo}&accdate=${accdate}`,'',
            {
              headers: {
                'accept': 'text/plain',
            }
          }
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }

      public async supplementaryInvoiceAccountReject(id: number,remarks:string) {
        try {
          
          const result = await http.post(
            `api/services/app/SupplementarySummaries/supplementaryInvoiceaccountreject?fileid=${id}&accountsapproveremarks=${remarks}`,'',
            
            {
              headers: {
                'accept': 'text/plain',
            }
          }
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }
      public async checkSignature(formData: FormData) {
        try {
            // Send the FormData in a POST request using your custom HTTP service
            const result = await http.post(
                'api/services/app/SupplementarySummaries/CheckSignature',
                formData
            );
          
            // Assuming the response contains data
            return result.data; // Adjust based on your actual response format
        } catch (error) {
            console.error('Error checking signature:', error);
            throw error; // Optionally re-throw the error to handle it in the component
        }
    }
    
      public async create(createOrEditSupplementarySummaryDto: CreateOrEditSupplementarySummaryDto) {
        let result = await http.post('api/services/app/SupplementarySummaries/CreateOrEdit', createOrEditSupplementarySummaryDto);
        return result.data.result;
      }
    
      public async delete(entityDto: EntityDto) {
        let result = await http.delete('api/services/app/SupplementarySummaries/Delete', { params: entityDto });
        return result.data;
      }
    
      public async get(entityDto: EntityDto): Promise<GetSupplementarySummaryForEditOutput> {
        let result = await http.get('api/services/app/SupplementarySummaries/GetSupplementarySummaryForEdit', { params: entityDto });
        return result.data.result;
      }
    
      public async getAll(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto): Promise<PagedResultDto<GetSupplementarySummaryForViewDto>> {
        let result = await http.get('api/services/app/SupplementarySummaries/GetAll', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }
    
      public async update(createOrEditSupplementarySummaryDto: CreateOrEditSupplementarySummaryDto) {
        let result = await http.post('api/services/app/SupplementarySummaries/CreateOrEdit', createOrEditSupplementarySummaryDto);
        return result.data.result;
      }
    
      public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto): Promise<PagedResultDto<SupplementarySummaryPartLookupTableDto>>{
        let result = await http.get('api/services/app/SupplementarySummaries/GetAllPartForLookupTable', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }
    
      public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto): Promise<PagedResultDto<supplementarySummaryBuyerLookupTableDto>>{
        let result = await http.get('api/services/app/SupplementarySummaries/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }
      public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto): Promise<PagedResultDto<SupplementarySummarySupplierLookupTableDto>>{
        let result = await http.get('api/services/app/SupplementarySummaries/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }   
      
     
      public async GetProcurLogData(ReportDate :any) {
        let result = await http.get('api/services/app/SupplementarySummaries/GetProcurLogData', {
            params: { ReportDate } // Passing the date parameter
        });
        return result.data.result;
    }

    public async GetSyncData(ReportDate :any) {
      let result = await http.get('api/services/app/SupplementarySummaries/GetSyncData', {
          params: { ReportDate } // Passing the date parameter
      });
      return result.data.result;
  }

  public async GetCBFCLogData(ReportDate :any) {
    let result = await http.get('api/services/app/SupplementarySummaries/GetCBFCLogData', {
        params: { ReportDate } // Passing the date parameter
    });
    return result.data.result;
}


public async GetGRNLogData(ReportDate :any) {
  let result = await http.get('api/services/app/SupplementarySummaries/GetGRNLogData', {
      params: { ReportDate } // Passing the date parameter
  });
  return result.data.result;
}


public async workflowIsntances(correlationId : any) {
  let result = await http.get('api/services/app/SupplementarySummaries/GetWorkFlowInstances',{
    params:{correlationId}
  });
  return result.data.result;
}
public async getAllAnalysisValue() {
  try {
    
    const result = await http.get(
      'api/services/app/SupplementarySummaries/GetAllAnalysisValue',
       
    );
    return result.data.result;
  } catch (error) {
    console.error('Error fetching supplementary summaries:', error);
    throw error; 
  }
}

     
}
export default new supplementarySummariesService();
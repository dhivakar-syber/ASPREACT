import { AuthenticationModel } from './dto/authenticationModel';
import { AuthenticationResultModel } from './dto/authenticationResultModel';
import http from '../httpService';
import { DiscAuthModel } from './dto/discAuthModel';
import { ExternResultModel } from './dto/externResultModel';
declare var abp:any;

class TokenAuthService {
  public async authenticate(authenticationInput: AuthenticationModel): Promise<AuthenticationResultModel> {
    let result = await http.post('api/TokenAuth/Authenticate', authenticationInput);
    console.log('abpdetails',abp)
    return result.data.result;
  }

  public async sessionAndRedirect(discAuthModel: DiscAuthModel): Promise<AuthenticationResultModel> {
    let result = await http.post('api/TokenAuth/SessionAndRedirect', discAuthModel);
    return result.data.result;
  }

  public async externalAuthenticate(token:string): Promise<ExternResultModel> {
    let result = await http.post('https://www.digitalsupplychain-qa.bharatbenz.com/DICVDISC/core/validatePayRetroToken',
      {},
      {
        baseURL: '',
        headers: {Authorization: token,}
      }
    );
    return result.data.result;
  }
}

export default new TokenAuthService();

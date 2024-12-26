import http from '../httpService';


class supplementarySummariesService{

public async loadsupplementarySummary()
{
    let result = await http.get('api/services/app/SupplementarySummaries/GetAllsupplementarySummaryTest',);
    return result;
}

}
export default new supplementarySummariesService();
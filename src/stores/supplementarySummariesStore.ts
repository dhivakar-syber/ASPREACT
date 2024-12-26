import { action} from 'mobx';
import supplementarySummariesService from '../services/SupplementarySummaries/supplementarySummariesService';

class supplementarysummariesStore
{

@action
async loadSummary()
{
let result = await supplementarySummariesService.loadsupplementarySummary();

return result
}




}
export default supplementarysummariesStore
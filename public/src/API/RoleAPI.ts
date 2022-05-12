import {baseURL} from '../constants';

class RoleAPI {
    
    baseURL = `${baseURL}/api/roles`;
    
    getRoles = async () => {
        try{
            const res = await fetch(`${this.baseURL}`);
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e) {
            console.log(e);
        }
    }
}

export default new RoleAPI();

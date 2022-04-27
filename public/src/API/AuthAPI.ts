import { stringify } from 'querystring';
import {baseURL} from '../constants';

interface ILoginInfo {
    LOGIN:string,
    PASSWORD: string
}

class AuthAPI {
    
    baseURL = `${baseURL}/api/auth`;
    
    authUser = async (LoginInfo : ILoginInfo) => {
        try{
            const res = await fetch(`${this.baseURL}`,{
                method:'POST',
                mode:'cors',
                headers:{
                    'Content-Type':'application/json',
                                    },
                body:JSON.stringify(LoginInfo)
            });
            const parsedData = await res.json();
            return parsedData.token;
        }
        catch(e) {
            console.log(e);
        }
    }
}

export default new AuthAPI()
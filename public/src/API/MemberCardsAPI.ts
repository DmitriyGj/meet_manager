import {baseURL} from '../constants';
import { IEmploye } from '../types/Employe.model';

class MemberCardsAPI {
    
    baseURL = `${baseURL}/api/member_cards`;
    
    getMemberCardById = async (id:string, token:string): Promise<IEmploye | undefined> => {
        try{
            const res = await fetch(`${this.baseURL}/${id}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e){
            console.log(e);
        }
    } 
    
    removeMemberCard = async (id:string, token:string) => {
        try{
            const res = await fetch(`${this.baseURL}/${id}`,
                {
                    method:'DELETE',
                    headers:{
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': token
                    },
                    body: JSON.stringify({id})
                });
        }
        catch(e){
            console.log(e);
        }
    }

    addMemberCard = async (employeInfo: any, token:string) => {
        try {
            const res = await fetch(`${this.baseURL}`,
            {
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authoriztion':token
                },
                body: JSON.stringify(employeInfo)
            })
        }
        catch(e){
            console.log(e);
        }
    }
}

export default new MemberCardsAPI();

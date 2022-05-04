import {baseURL} from '../constants';
import { IEmploye } from '../types/Employe.model';

class MeetingsAPI {
    
    baseURL = `${baseURL}/api/meetings`;
    
    getMeetings= async ( ) => {
        try{
            const res = await fetch(`${this.baseURL}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                }
            });
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e) {
            console.log(e);
        }
    }
    
    getMeetingById = async (id:string): Promise<IEmploye | undefined> => {
        try{
            const res = await fetch(`${this.baseURL}/${id}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                }
            });
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e){
            console.log(e);
        }
    } 
    
    removeMeeting = async (id:string) => {
        try{
            const res = await fetch(`${this.baseURL}/${id}`,
                {
                    method:'DELETE',
                    headers:{
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({id})
                });
        }
        catch(e){
            console.log(e);
        }
    }

    addMeeting = async (employeInfo: any) => {
        try {
            const res = await fetch(`${this.baseURL}`,
            {
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                },
                body: JSON.stringify(employeInfo)
            })
        }
        catch(e){
            console.log(e);
        }
    }

    editMeeting = async (employeId: number, data: any)=> {
        try{
            const res = await fetch(`${this.baseURL}/${employeId}`,
            {
                method:'PUT',
                headers:{
                    'Content-type':'application/json',
                },
                body: JSON.stringify(data)
            })
        }
        catch(e){
            console.log(e);
        }

    }

}

export default new MeetingsAPI();

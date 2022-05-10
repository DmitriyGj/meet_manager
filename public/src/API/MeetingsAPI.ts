import {baseURL} from '../constants';
import { IEmploye } from '../types/Employe.model';

class MeetingsAPI {
    
    baseURL = `${baseURL}/api/meetings`;
    
    getMeetings= async (token: string ) => {
        try{
            const res = await fetch(`${this.baseURL}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e) {
            console.log(e);
        }
    }
    
    getMeetingById = async (id:string, token: string) => {
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
    
    removeMeeting = async (id:string, token:string) => {
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

    addMeeting = async (meetingInfo: any, token:string) => {
        try {
            const res = await fetch(`${this.baseURL}`,
            {
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(meetingInfo)
            })
        }
        catch(e){
            console.log(e);
        }
    }

    editMeeting = async (employeId: number, data: any, token:string)=> {
        try{
            const res = await fetch(`${this.baseURL}/${employeId}`,
            {
                method:'PUT',
                headers:{
                    'Content-type':'application/json',
                    'Authorization': token
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

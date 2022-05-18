import {baseURL} from '../constants';
import { IEmploye } from '../types/Employe.model';

class GuestAPI {
    
    baseURL = `${baseURL}/api/guests`;
    
    getGuests = async (token: string) => {
        try{
            const res = await fetch(`${this.baseURL}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            console.log(res)
            if(!res.ok){
                return res.status;
            }
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e) {
            console.log(e);
        }
    }
    
    getGuestById = async (id:string, token:string) => {
        try{
            const res = await fetch(`${this.baseURL}/${id}`,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            if(!res.ok){
                return res.status;
            }
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e){
            console.log(e);
        }
    } 
    
    removeGuest = async (id:string, token:string) => {
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
                if(!res.ok){
                    return res.status;
                }
        }
        catch(e){
            console.log(e);
        }
    }

    addGuest = async (employeInfo: any, token:string) => {
        try {
            const res = await fetch(`${this.baseURL}`,
            {
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':token
                },
                body: JSON.stringify(employeInfo)
            })
            if(!res.ok){
                return res.status;
            }
        }
        catch(e){
            console.log(e);
        }
    }

    editGuest = async (employeId: number, data: any, token: string)=> {
        try{
            console.log(token)
            const res = await fetch(`${this.baseURL}/${employeId}`,
            {
                method:'PUT',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':token
                },
                body: JSON.stringify(data)
            })
            if(!res.ok){
                return res.status;
            }
        }
        catch(e){
            console.log(e);
        }

    }

    getEmployeGuestInfo = async()  => {
        try {
            const res = await fetch(`${this.baseURL}_chart`);
            if(!res.ok){
                return res.status;
            }
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e){
            console.log(e);
        }
    }

    
    getMeetingsOfGuest = async(employeID:string) => {
        try{
            const res = await fetch(`${this.baseURL}/${employeID}/meetings`,
            {
                method:'GET',
                headers:{
                    'Content-type':'application/json'
                }
            })
            if(!res.ok){
                return res.status;
            }
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e){
            console.log(e);
        }
    }
}

export default new GuestAPI();

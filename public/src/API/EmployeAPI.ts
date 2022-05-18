import { BarInfo } from '../Components/Charts/EmployeChart/EmployeChart';
import {baseURL} from '../constants';
import { IEmploye } from '../types/Employe.model';

class EmployeAPI {
    
    baseURL = `${baseURL}/api/employes`;
    
    getEmployes = async (token: string) => {
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
    
    getEmployeById = async (id:string, token:string) => {
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
    
    removeEmploye = async (id:string, token:string) => {
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

    addEmploye = async (employeInfo: any, token:string) => {
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

    editEmploye = async (employeId: number, data: any, token: string)=> {
        try{
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

    getEmployeChartInfo = async()  => {
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

    
    getMeetingsOfEmploye = async(employeID:string) => {
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

export default new EmployeAPI();

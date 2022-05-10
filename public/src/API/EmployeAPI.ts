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
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e) {
            console.log(e);
        }
    }
    
    getEmployeById = async (id:string, token:string): Promise<IEmploye | undefined> => {
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
        }
        catch(e){
            console.log(e);
        }
    }

    addEmploye = async (employeInfo: any, token:string) => {
        try {
            console.log(this.baseURL)
            const res = await fetch(`${this.baseURL}`,
            {
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':token
                },
                body: JSON.stringify(employeInfo)
            })
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
                    'Authoriztion':token
                },
                body: JSON.stringify(data)
            })
        }
        catch(e){
            console.log(e);
        }

    }

    getEmployeChartInfo = async() : Promise<BarInfo[] | undefined>  => {
        try {
            const res = await fetch(`${this.baseURL}_chart`);
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e){
            console.log(e);
        }
    }
}

export default new EmployeAPI();

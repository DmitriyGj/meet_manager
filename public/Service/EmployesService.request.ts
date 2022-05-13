import { baseURL } from "../src/constants"

export class EmployeService{
    Get = async() =>{
        const requset = await fetch(`${baseURL}/employes`)
        return requset;
    }
    
    Delete = async(id:string) => {
        const request = await fetch(`${baseURL}/employes/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({id})
            })
        return request;
    }
    
    Post = async(employeInfo:any) =>{ 
        const request = await fetch(`${baseURL}`,
            {
                method:'POST',
                headers:{
                    'Content-type':'application/json',
                },
                body: JSON.stringify(employeInfo)
            })
        return request;
    }

    Put = async(id:string, employeInfo:any) => {
        const res = await fetch(`${baseURL}/employes/${id}`,
            {
                method:'PUT',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify(employeInfo)
            })
    }
}

import API from './API.base';

class EmployeAPI {
    
    baseURL = `${API.protocol}${API.baseURL}}/api/employes`;
    
    getEmployes = async () => {
        try{
            const res = await fetch('https://meet-manager-backend.herokuapp.com/api/employes');
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e) {
            console.log(e);
        }
    }
    
    getEmployeById = async (id:string) => {
        try{
            const res = await fetch(`https://meet-manager-backend.herokuapp.com/api/employes/${id}`);
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e){
            console.log(e);
        }
    } 
    
    removeEmploye = async (id:string) => {
        try{
            const res = await fetch(`https://meet-manager-backend.herokuapp.com/api/employes/${id}`,
                {
                    method:'DELETE',
                    headers:{
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({id})
                });
            console.log(res);
        }
        catch(e){
            console.log(e);
        }
    }

    addEmploye = async (employeInfo: any) => {
        try {
            const res = await fetch(`https://meet-manager-backend.herokuapp.com/api/employes`,
            {
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify(employeInfo)
            })
            console.log(res);
        }
        catch(e){
            console.log(e);
        }
    }

    editEmploye = async (employeId: number, data: any)=> {
        try{
            const res = await fetch(`https://meet-manager-backend.herokuapp.com/api/employes/${employeId}`,
            {
                method:'PUT',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify(data)
            })
            console.log(res);
        }
        catch(e){
            console.log(e);
        }

    }
}

export default new EmployeAPI();

import API from './API.base';

const getEmployes = async () => {
    try{
        const res = await fetch(`${API.protocol}${API.baseURL}:${API.port}/employes`);
        const parsedData = await res.json();
        return parsedData;
    }
    catch(e) {
        console.log(e);
    }
}

const getEmployeById = async (id:string) => {
    try{
        const res = await fetch(`${API.protocol}${API.baseURL}:${API.port}/employes/${id}`);
        const parsedData = await res.json();
        return parsedData;
    }
    catch(e){
        console.log(e);
    }
} 

const removeEmploye = async (id:string) => {
    try{
        const res = await fetch(`${API.protocol}${API.baseURL}:${API.port}/employes/${id}`,
            {
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({id})
            });
        const parsedData = await res.json();
        return parsedData;
    }
    catch(e){
        console.log(e);
    }
}
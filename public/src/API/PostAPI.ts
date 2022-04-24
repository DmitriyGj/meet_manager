import {baseURL} from '../constants';

class PostAPI {
    
    baseURL = `${baseURL}/api/posts`;
    
    getPosts = async () => {
        try{
            const res = await fetch(`${this.baseURL}`);
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e) {
            console.log(e);
        }
    }
    
    getPostById = async (id:string) => {
        try{
            const res = await fetch(`${this.baseURL}/${id}`);
            const parsedData = await res.json();
            return parsedData;
        }
        catch(e){
            console.log(e);
        }
    } 
    
    removePost= async (id:string) => {
        try{
            const res = await fetch(`${this.baseURL}/${id}`,
                {
                    method:'DELETE',
                    headers:{
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({id})
                });
        }
        catch(e){
            console.log(e);
        }
    }

    addPost = async (postName: string) => {
        try {
            const res = await fetch(`${this.baseURL}`,
            {
                method:'POST',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify(postName)
            })
        }
        catch(e){
            console.log(e);
        }
    }

    editPost = async (postId: number, name: string)=> {
        try{
            const res = await fetch(`${this.baseURL}/${postId}`,
            {
                method:'PUT',
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify(name)
            })
        }
        catch(e){
            console.log(e);
        }

    }
}

export default new PostAPI();

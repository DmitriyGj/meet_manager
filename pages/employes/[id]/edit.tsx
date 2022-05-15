import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import {  ChangeEventHandler, MouseEventHandler, ReactNode, useEffect, useState } from "react";
import style from '../addEmploye.module.scss';
import EmployeAPI from '../../../public/src/API/EmployeAPI';
import PostAPI from "../../../public/src/API/PostAPI";
import RoleAPI from "../../../public/src/API/RoleAPI";
import translatorFieldsToRULabels from "../../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { Button, FormControl, FormGroup, FormLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { IEmployeResonseData } from "../../../public/src/types/Employe.model";
import {Buffer} from '../../../public/src/types/Buffer';
import { IPost } from "../../../public/src/types/Post.model";
import { IRoleResonseData } from "../../../public/src/types/Role.model";

interface EditEmployePageProps {
    employeInfo:IEmployeResonseData,
    selectOptions: Buffer<{value:string, displayName:string}[]>
};

const AddEmployePage = ({employeInfo, selectOptions}: EditEmployePageProps) => {
    const [currentEmployeInfo, setEmployeInfo] = useState(employeInfo);

    useEffect(() => {
        console.log(selectOptions)
    })

    const clickSendHandler: MouseEventHandler = (e) => {
        e.preventDefault();
        (async() => {
            try{
                const token = getCookie('token')
                await EmployeAPI.editEmploye(+employeInfo.ID, currentEmployeInfo,token as string);
            }
            catch(e){
                alert('что-то пошло не так')
            }
            finally{
                router.push('/employes')
            }

        })();
    };
    const inputChangeHandler:ChangeEventHandler<HTMLInputElement> =  ({target}) =>  {
        setEmployeInfo({...currentEmployeInfo,[target.name]:target.value})
    };

    const selectChangeHandler = ({target}: SelectChangeEvent<string>, child: ReactNode) => {setEmployeInfo({...currentEmployeInfo,[target.name]:target.value}); };
    

    const router = useRouter();
    return(
            <FormControl className={style.Form}>
                    {Object.keys(employeInfo).map((prop:string) =>  
                        prop !== 'ID' && prop != 'USER_ID' && <FormLabel className={style.label}  
                            key={prop}
                            htmlFor={prop}>
                            {translatorFieldsToRULabels.Employe[prop]}
                                {!prop.includes('_ID') ?
                                    <TextField className={style.input}  
                                        onChange= {inputChangeHandler}
                                        value={currentEmployeInfo[prop]}
                                        name={prop} 
                                        type='text'/> 
                                :
                                <Select value={currentEmployeInfo[prop]}
                                        name='POST_ID'
                                        onChange={selectChangeHandler}>
                                    {selectOptions[prop]?.map(({value, displayName}) => {
                                        return <MenuItem key = {value}
                                                    value = {value}>
                                                    {displayName}
                                                </MenuItem >
                                    })}
                                </Select>
                            }
                        </FormLabel>)
                    }
                <FormGroup className={style.ButtonBlock}>
                    <Button className={style.Button} variant='contained' onClick={clickSendHandler}>Send</Button>
                </FormGroup>
            </FormControl>
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    const {id} = ctx.query;
    const {req, res} = ctx;
    const selectOptionsPosts: IPost[] = await PostAPI.getPosts();
    const parsedSelectOptionsPosts = selectOptionsPosts.map(({ID, POST_NAME}) =>  ({value: ID, displayName: POST_NAME}));
    const selectOptionsRoles: IRoleResonseData[] = await RoleAPI.getRoles();
    const parsedSelectOptionsRoles = selectOptionsRoles.map(({ROLE_ID, ROLE_NAME}) =>  ({value: ROLE_ID, displayName: ROLE_NAME}));
    const token = getCookie('token',{req,res});
    const data: IEmployeResonseData | number = await EmployeAPI.getEmployeById(id as string, token as string);
    
    if(data === 401 || data === 403){
        return {
            redirect: {
                destination:'/login',
                permanent:false
            }
        }
    }
    const selectOptions = {POST_ID: parsedSelectOptionsPosts,ROLE_ID:parsedSelectOptionsRoles }
    console.log(data)

    return {
        props: {
            employeInfo: data,
            selectOptions
        }
    }
};

export default AddEmployePage;
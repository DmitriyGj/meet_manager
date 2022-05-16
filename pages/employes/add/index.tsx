import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import {   ChangeEventHandler,  MouseEventHandler, ReactNode, useState } from "react";
import style from '../addEmploye.module.scss';
import EmployeAPI from '../../../public/src/API/EmployeAPI';
import PostAPI  from '../../../public/src/API/PostAPI';
import InitValues from '../../../public/src/utils/initValues';
import { IPost } from "../../../public/src/types/Post.model";
import { Buffer } from "../../../public/src/types/Buffer";
import translatorFieldsToRULabels from "../../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { FormGroup, FormLabel, TextField, Select, MenuItem, SelectChangeEvent ,FormControl , Button } from "@mui/material";
import {IEmployeResonseData } from '../../../public/src/types/Employe.model';
import { IRoleResonseData } from "../../../public/src/types/Role.model";
import RoleAPI from "../../../public/src/API/RoleAPI";
import JWT from 'jwt-decode'

interface AddEmployePageProps {
    employeFields:IEmployeResonseData
    selectOptions:  Buffer<{value:string, displayName:string}[]>,
    token: string
};

const AddEmployePage = ({employeFields, selectOptions, token}: AddEmployePageProps) => {
    const [employeInfo, setEmployeInfo] = useState<IEmployeResonseData>({...employeFields,
                                                                    ['POST_ID']:selectOptions['POST_ID'][0].value,
                                                                    ['ROLE_ID']:selectOptions['ROLE_ID'][0].value,});
    const router = useRouter();

    const inputChangeHandler:ChangeEventHandler<HTMLInputElement> =  ({target}) =>  {
        setEmployeInfo({...employeInfo,[target.name]:target.value})
    };
    const selectChangeHandler = ({target}: SelectChangeEvent<string>, child: ReactNode) => {setEmployeInfo({...employeInfo,[target.name]:target.value});};
    
    const addClickHandler: MouseEventHandler = (e) =>  {
        (async() => {
            try{
                await EmployeAPI.addEmploye(employeInfo, token);
            }
            catch(e){
                alert('что-то пошло не так');
            }
            finally{
                router.push('/employes')
            }

        })()
    }

    return(
                <FormControl className={style.Form}>
                        {Object.keys(employeInfo).map((prop:string) =>  
                            <FormLabel className={style.label}  
                                key={prop}
                                htmlFor={prop}>
                                {translatorFieldsToRULabels.Employe[prop]}
                                {!prop.includes('_ID') ?
                                    <TextField className={style.input}  
                                        onChange= {inputChangeHandler}
                                        value={employeInfo[prop]}
                                        name={prop} 
                                        type='text'/> 
                                    :
                                    <Select value={employeInfo[prop]}
                                            name={prop}
                                            onChange={selectChangeHandler}>
                                        {selectOptions[prop].map(({value, displayName}) => {
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
                        <Button className={style.Button} variant='contained' onClick={addClickHandler}>Send</Button>
                        <Button className={style.Button} variant='contained'> Cancel</Button>
                    </FormGroup>
                </FormControl>

    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    try{
        const {req, res} = ctx;
        const token = getCookie('token',{req,res});
        const {ROLE_NAME} = (JWT(token as string) as {user:{ROLE_NAME:string}}).user

        if(ROLE_NAME !== 'ADMIN'){
            return {
                redirect: {
                    destination: '/employes',
                    permanent:false
                }
            }
        }

        const selectOptionsPosts: IPost[] = await PostAPI.getPosts();
        const parsedSelectOptionsPosts = selectOptionsPosts.map(({POST_ID, POST_NAME}) =>  ({value: POST_ID, displayName: POST_NAME}));
        const selectOptionsRoles: IRoleResonseData[] = await RoleAPI.getRoles();
        const parsedSelectOptionsRoles = selectOptionsRoles.map(({ROLE_ID, ROLE_NAME}) =>  ({value: ROLE_ID, displayName: ROLE_NAME}));
        const selectOptions = {ROLE_ID:parsedSelectOptionsRoles, POST_ID: parsedSelectOptionsPosts };
        return {
            props: {
                employeFields: InitValues.EmployeInfo,
                selectOptions,
                token
            }
        }
    }
    catch (e){
        console.log(e);
        return {
            props: {
                employeFields: InitValues.EmployeInfo,
                selectOptions:[]
            }
        }
    }

};

export default AddEmployePage;
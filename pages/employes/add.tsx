import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import {   ChangeEventHandler,  MouseEventHandler, ReactNode, useState } from "react";
import style from './addEmploye.module.scss';
import EmployeAPI from '../../public/src/API/EmployeAPI';
import PostAPI  from '../../public/src/API/PostAPI';
import InitValues from '../../public/src/utils/initValues';
import { IPost } from "../../public/src/types/Post.model";
import translatorFieldsToRULabels from "../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { FormGroup, FormLabel, TextField, Select, MenuItem, SelectChangeEvent ,FormControl , Button } from "@mui/material";
import {IEmployeResonseData } from '../../public/src/types/Employe.model';

interface AddEmployePageProps {
    employeFields:IEmployeResonseData
    selectOptions: IPost[],
    token: string
};

const AddEmployePage = ({employeFields, selectOptions, token}: AddEmployePageProps) => {
    const [employeInfo, setEmployeInfo] = useState<IEmployeResonseData>({...employeFields,['POST_ID']:selectOptions[0].ID,});
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
        <div className={style.main}>
            <FormControl className={style.Form}>
                    {Object.keys(employeInfo).map((prop:string) =>  
                        <FormLabel className={style.label}  
                            key={prop}
                            htmlFor={prop}>
                            {translatorFieldsToRULabels.Employe[prop]}
                            {prop != 'POST_ID' ?
                                <TextField className={style.input}  
                                    onChange= {inputChangeHandler}
                                    value={employeInfo[prop]}
                                    name={prop} 
                                    type='text'/> 
                                :
                                <Select value={employeInfo[prop]}
                                        name='POST_ID'
                                        onChange={selectChangeHandler}>
                                    {selectOptions.map(({ID, POST_NAME}) => {
                                        return <MenuItem key = {ID}
                                                    value = {ID}>
                                                    {POST_NAME}
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
        </div>
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    try{
        const {req, res} = ctx;
        const token = getCookie('token',{req,res});
        const selectOptions = await PostAPI.getPosts();
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
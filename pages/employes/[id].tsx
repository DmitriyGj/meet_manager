import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { ChangeEvent, ChangeEventHandler, MouseEventHandler, ReactNode, useState } from "react";
import style from './addEmploye.module.scss';
import EmployeAPI from '../../public/src/API/EmployeAPI';
import PostAPI from "../../public/src/API/PostAPI";
import translatorFieldsToRULabels from "../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { Button, FormControl, FormGroup, FormLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { IEmployeResonseData } from "../../public/src/types/Employe.model";

interface EditEmployePageProps {
    employeInfo:IEmployeResonseData,
    selectOptions: {ID:string, POST_NAME:string}[]
};

const AddEmployePage = ({employeInfo, selectOptions}: EditEmployePageProps) => {
    const [currentEmployeInfo, setEmployeInfo] = useState(employeInfo);

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

    const selectChangeHandler = ({target}: SelectChangeEvent<string>, child: ReactNode) => {setEmployeInfo({...employeInfo,[target.name]:target.value}); };
    

    const router = useRouter();
    return(
        <div className={style.Main}>
            <FormControl className={style.Form}>
                    {Object.keys(employeInfo).map((prop:string) =>  
                        prop !== 'ID' && <FormLabel className={style.label}  
                            key={prop}
                            htmlFor={prop}>
                            {translatorFieldsToRULabels.Employe[prop]}
                                {prop != 'POST_ID' ?
                                    <TextField className={style.input}  
                                        onChange= {inputChangeHandler}
                                        value={currentEmployeInfo[prop]}
                                        name={prop} 
                                        type='text'/> 
                                :
                                <Select value={currentEmployeInfo[prop]}
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
                    <Button className={style.Button} variant='contained' onClick={clickSendHandler}>Send</Button>
                    <Button className={style.Button} variant='contained'> Cancel</Button>
                </FormGroup>
            </FormControl>
        </div>
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    const {id} = ctx.query;
    const {req, res} = ctx;
    const selectOptions = await PostAPI.getPosts();
    const token = getCookie('token',{req,res});
    const employeInfo = await EmployeAPI.getEmployeById(id as string, token as string);

    return {
        props: {
            employeInfo,
            selectOptions
        }
    }
};

export default AddEmployePage;
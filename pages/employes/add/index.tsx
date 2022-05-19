import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import style from '../addEmploye.module.scss';
import EmployeAPI from '../../../public/src/API/EmployeAPI';
import PostAPI  from '../../../public/src/API/PostAPI';
import InitValues from '../../../public/src/utils/initValues';
import { IPost } from "../../../public/src/types/Post.model";
import { Buffer } from "../../../public/src/types/Buffer";
import translatorFieldsToRULabels from "../../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { FormGroup, TextField, Select, MenuItem, FormLabel ,FormControl , Button, Card } from "@mui/material";
import {IEmployeResonseData } from '../../../public/src/types/Employe.model';
import { IRoleResonseData } from "../../../public/src/types/Role.model";
import RoleAPI from "../../../public/src/API/RoleAPI";
import {Formik, Form } from 'formik';
import { EmployeValidationSchema } from "../../../public/src/utils/validationSchemas";

interface AddEmployePageProps {
    employeFields:IEmployeResonseData
    selectOptions:  Buffer<{value:string, displayName:string}[]>,
    token: string
};

const AddEmployePage = ({employeFields, selectOptions, token}: AddEmployePageProps) => {
    const employeInfo:IEmployeResonseData = {...employeFields,
                        ['POST_ID']:selectOptions['POST_ID'][0].value,
                        ['ROLE_ID']:selectOptions['ROLE_ID'][0].value};
    const router = useRouter();

    const addEmployeHandler = (values: IEmployeResonseData) =>  {
        (async() => {
            try{
                await EmployeAPI.addEmploye(values, token);
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
            <Formik initialValues={employeInfo}
                    validationSchema={EmployeValidationSchema}
                    onSubmit={(values) => addEmployeHandler(values)}>
            {({errors, values, touched, handleChange, handleSubmit, handleBlur})=>
                <Form className={style.Form} onSubmit={handleSubmit}>
                    <FormLabel>
                        Добавление работника
                    </FormLabel>
                    <Card className={style.Card}>
                        <FormControl className={style.FormControl}>
                            
                            {Object.keys(values).map((prop:string) =>
                                    ( <TextField className={style.input}
                                            onBlur={handleBlur}
                                            helperText={touched[prop] ? errors[prop]: ''}
                                            key={prop} 
                                            error={touched[prop] && Boolean(errors[prop])} 
                                            label ={translatorFieldsToRULabels.Employe[prop]}
                                            onChange= {handleChange}
                                            select={prop.includes('_ID') }
                                            value={values[prop]}
                                            id={prop}
                                            name={prop} 
                                            type='text'>
                                                {prop.includes('_ID') && selectOptions[prop].map(({value, displayName}) =>
                                                                    (<MenuItem key = {value}
                                                                            value = {value}>{displayName}</MenuItem>))
                                                                        }
                                            </TextField>)) 
                            }
                            <FormGroup className={style.ButtonBlock}>
                                <Button className={style.Button} 
                                            type='submit'
                                            variant='contained'>Send</Button>
                                <Button className={style.Button} variant='contained'> Cancel</Button>
                            </FormGroup>
                        </FormControl>
                    </Card>
                </Form>}
            </Formik> );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    try{
        const {req, res} = ctx;
        const token = getCookie('token',{req,res});
        const selectOptionsPosts: IPost[] = await PostAPI.getPosts();
        const parsedSelectOptionsPosts = selectOptionsPosts.map(({POST_ID, POST_NAME}) =>  ({value: POST_ID, displayName: POST_NAME}));
        const selectOptionsRoles: IRoleResonseData[] = await RoleAPI.getRoles();
        const parsedSelectOptionsRoles = selectOptionsRoles.filter(item => item.ROLE_NAME !=='GUEST').map(({ROLE_ID, ROLE_NAME}) =>  ({value: ROLE_ID, displayName: ROLE_NAME}));
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
import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import style from '../addEmploye.module.scss';
import EmployeAPI from '../../../public/src/API/EmployeAPI';
import PostAPI from "../../../public/src/API/PostAPI";
import RoleAPI from "../../../public/src/API/RoleAPI";
import translatorFieldsToRULabels from "../../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { Button, Card, FormControl, FormGroup, FormLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { IEmployeResonseData } from "../../../public/src/types/Employe.model";
import {Buffer} from '../../../public/src/types/Buffer';
import { IPost } from "../../../public/src/types/Post.model";
import { IRoleResonseData } from "../../../public/src/types/Role.model";
import JWT from 'jwt-decode';
import { Form, Formik } from "formik";
import { EmployeValidationSchema } from "../../../public/src/utils/validationSchemas";

interface EditEmployePageProps {
    employeInfo:IEmployeResonseData,
    selectOptions: Buffer<{value:string, displayName:string}[]>
    ROLE_NAME:string
    ID:string
    token:string
};

const excludeToShow= ['ID', 'USER_ID' ,'ROLE_NAME','POST_NAME', 'DEPART_ID','DEPART_NAME']

const AddEmployePage = ({employeInfo, selectOptions, ROLE_NAME, ID, token}: EditEmployePageProps) => {

    const editHandler = (values: IEmployeResonseData) => {
        (async() => {
            try{
                await EmployeAPI.editEmploye(+employeInfo.ID, values,token as string);
            }
            catch(e){
                alert('что-то пошло не так')
            }
            finally{
                router.push('/employes')
            }

        })();
    };
    const router = useRouter();
    return(<Formik initialValues={employeInfo}
            validationSchema={EmployeValidationSchema}
            onSubmit={(values) => editHandler(values)}>
    {({errors, values, touched, handleChange, handleSubmit, handleBlur})=>
        <Form className={style.Form} onSubmit={handleSubmit}>
            <FormLabel>
                Изменение работника
            </FormLabel>
            <Card className={style.Card}>
                <FormControl className={style.FormControl}>
                    
                    {Object.keys(values).map((prop:string) =>
                            (!excludeToShow.includes(prop) && <TextField className={style.input}
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
    const {id} = ctx.query;
    const {req, res} = ctx;
    const selectOptionsPosts: IPost[] = await PostAPI.getPosts();
    const parsedSelectOptionsPosts = selectOptionsPosts.map(({POST_ID, POST_NAME}) =>  ({value: POST_ID, displayName: POST_NAME}));
    const selectOptionsRoles: IRoleResonseData[] = await RoleAPI.getRoles();
    const parsedSelectOptionsRoles = selectOptionsRoles.map(({ROLE_ID, ROLE_NAME}) =>  ({value: ROLE_ID, displayName: ROLE_NAME}));
    const token = getCookie('token',{req,res});
    const data: IEmployeResonseData | number = await EmployeAPI.getEmployeById(id as string, token as string);
    const {ROLE_NAME, ID} = (JWT(token as string) as {user:{ROLE_NAME:string, ID:string}}).user
    if(ROLE_NAME !== 'ADMIN'){
        return {
            redirect: {
                destination: '/employes',
                permanent:false
            }
        }
    }


    if(data === 401 || data === 403){
        return {
            redirect: {
                destination:'/login',
                permanent:false
            }
        }
    }
    const selectOptions = {POST_ID: parsedSelectOptionsPosts,ROLE_ID:parsedSelectOptionsRoles }

    return {
        props: {
            ID,
            ROLE_NAME,
            employeInfo: {...(data as IEmployeResonseData), PASSWORD:''},
            selectOptions,
            token
        }
    }
};

export default AddEmployePage;
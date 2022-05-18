import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import style from '../addEmploye.module.scss';
import GuestInfo from '../../../public/src/API/GeustAPI';
import InitValues from '../../../public/src/utils/initValues';
import translatorFieldsToRULabels from "../../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { FormGroup, FormLabel, TextField, FormControl , Button, Card, CardContent } from "@mui/material";
import {IEmployeResonseData } from '../../../public/src/types/Employe.model';
import JWT from 'jwt-decode'
import { Formik } from 'formik';
import { GuestValidationSchema } from "../../../public/src/utils/validationSchemas";

interface AddEmployePageProps {
    employeFields:IEmployeResonseData
    token: string
};

const AddEmployePage = ({employeFields, token}: AddEmployePageProps) => {
    const router = useRouter();
    const addClickHandler = (values: IEmployeResonseData, token:string) =>  {
        (async() => {
            try{
                await GuestInfo.addGuest(values, token);
            }
            catch(e){
                alert('что-то пошло не так');
            }
            finally{
                router.push('/guests')
            }

        })()
    }

    return(
        <Formik initialValues={employeFields} 
                validationSchema={GuestValidationSchema} 
                onSubmit={values => addClickHandler(values, token as string)} >
            {({errors, touched, values, handleChange, handleBlur, handleSubmit}) =>(
                <form className={style.Form} onSubmit={handleSubmit} >
                    <Card className={style.FormCard}>
                        <FormControl className={style.FormCardContentControl} >
                                {Object.keys(values).map((prop:string) => { 
                                    return( <FormLabel className={style.label}  
                                        key={prop}
                                        htmlFor={prop}>
                                        {translatorFieldsToRULabels.Employe[prop]}
                                            <TextField id={prop}
                                                onBlur={handleBlur}
                                                className={style.input} 
                                                error={touched[prop] && Boolean(errors[prop])}  
                                                helperText = {touched[prop] ? errors[prop] : ''}
                                                value={values[prop]}
                                                onChange={handleChange}
                                                name={prop} 
                                                type='text'/> 
                                    </FormLabel>)
                                    })
                                }
                            <FormGroup className={style.ButtonBlock}>
                                <Button className={style.Button} 
                                        type='submit' 
                                        onClick = {e => {e.preventDefault(); handleSubmit()} } 
                                        variant='contained'>Send</Button>
                                <Button onClick={() => router.push('/guests')}
                                        className={style.Button} 
                                        variant='contained'> Cancel</Button>
                            </FormGroup>
                        </FormControl>
                </Card>
            </form>
            )}

        </Formik>
                
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    try{
        const {req, res} = ctx;
        const token = getCookie('token',{req,res});
        const {ROLE_NAME} = (JWT(token as string) as {user:{ROLE_NAME:string}}).user

        if(ROLE_NAME === 'GUEST'){
            return {
                redirect: {
                    destination: '/guests',
                    permanent:false
                }
            }
        }
        return {
            props: {
                employeFields: InitValues.GuestInfo,
                token
            }
        }
    }
    catch (e){
        console.log(e);
        return {
            props: {
                employeFields: InitValues.GuestInfo,
            }
        }
    }

};

export default AddEmployePage;
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
import { Formik, Form } from 'formik';
import { GuestValidationSchema } from "../../../public/src/utils/validationSchemas";
import { IRoleResonseData } from "../../../public/src/types/Role.model";

interface AddEmployePageProps {
    token: string
};

const AddEmployePage = ({ token}: AddEmployePageProps) => {
    const guestInfo = InitValues.GuestInfo as unknown as IEmployeResonseData
    const router = useRouter();
    const addClickHandler = (values:IEmployeResonseData) =>  {
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
        <Formik initialValues={guestInfo }
                validationSchema={GuestValidationSchema}
                onSubmit={(values) => addClickHandler(values)}>
            {({errors, values, touched, handleChange, handleSubmit, handleBlur})=>
                <Form className={style.Form} onSubmit={handleSubmit}>
                    <FormLabel>
                        Добавление нового гостя
                    </FormLabel>
                    <Card className={style.Card}>
                        <FormControl className={style.FormControl}>
                            {Object.keys(values).map((prop:string) =>
                                    (<TextField className={style.input}
                                            onBlur={handleBlur}
                                            helperText={touched[prop] ? errors[prop]: ''}
                                            key={prop} 
                                            error={touched[prop] && Boolean(errors[prop])} 
                                            label ={translatorFieldsToRULabels.Employe[prop]}
                                            onChange= {handleChange}
                                            value={values[prop]}
                                            id={prop}
                                            name={prop} 
                                            type='text'>
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
                token
            }
        }
    }
    catch (e){
        console.log(e);
        return {
            props: {
            }
        }
    }

};

export default AddEmployePage;
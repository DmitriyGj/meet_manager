import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import {  ChangeEventHandler, MouseEventHandler, useState } from "react";
import style from '../addEmploye.module.scss';
import GuestAPI from '../../../public/src/API/GeustAPI';
import translatorFieldsToRULabels from "../../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { Button, Card, FormControl, FormGroup, FormLabel,MenuItem,TextField } from "@mui/material";
import { IEmployeResonseData } from "../../../public/src/types/Employe.model";
import JWT from 'jwt-decode';
import GeustAPI from "../../../public/src/API/GeustAPI";
import { Formik,Form } from 'formik';
import { GuestValidationSchema } from "../../../public/src/utils/validationSchemas";

interface EditGUestPageProps {
    guestInfo:IEmployeResonseData,
    ID:string
    ROLE_NAME:string
    token: string
};

const excludeToShow= ['ID', 'USER_ID' ,'ROLE_NAME', 'ROLE_ID', 'LOGIN']

const AddEmployePage = ({guestInfo,token}: EditGUestPageProps) => {
    const SubmitHandler= (values : IEmployeResonseData) => {
        (async() => {
            try{
                await GeustAPI.editGuest(+guestInfo.ID, values,token as string);
            }
            catch(e){
                alert('что-то пошло не так')
            }
            finally{
                router.push('/guests')
            }

        })();
    };
    console.log(guestInfo)
    const router = useRouter();
    return(<Formik initialValues={guestInfo}
                validationSchema={GuestValidationSchema}
                onSubmit={(values) => SubmitHandler(values)}>
        {({errors, values, touched, handleChange, handleSubmit, handleBlur})=>
            <Form className={style.Form} onSubmit={handleSubmit}>
                <FormLabel>
                    Изменение данных о госте
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
    const {id} = ctx.query;
    const {req, res} = ctx;
    const token = getCookie('token',{req,res});
    console.log(token)
    const data: IEmployeResonseData | number = await GuestAPI.getGuestById(id as string, token as string);
    const {ROLE_NAME, ID} = (JWT(token as string) as {user:{ROLE_NAME:string, ID:string}}).user
    if(ROLE_NAME === 'GUEST'){
        return {
            redirect: {
                destination: `/guests/${id}`,
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

    return {
        props: {
            ID,
            ROLE_NAME,
            guestInfo: {...(data as IEmployeResonseData), PASSWORD:''},
            token
        }
    }
};

export default AddEmployePage;
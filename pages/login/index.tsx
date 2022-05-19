import { useRouter } from "next/router";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import AuthAPI from "../../public/src/API/AuthAPI";
import { setCookies } from 'cookies-next';
import FormControl from '@mui/material/FormControl';
import {Button} from '@mui/material';
import style from '../../public/src/Components/Froms/Login.module.scss'
import { FormGroup, FormLabel, TextField } from "@mui/material";
import { GetServerSideProps } from "next";
import JWT from 'jwt-decode';
import { removeCookies } from "cookies-next";
import { Formik } from 'formik';
import { LoginValidationSchema } from "../../public/src/utils/validationSchemas";

const LoginPage = () => {
    const router = useRouter();
    const userInfo = {LOGIN:'', PASSWORD:''};
    const loginHandler= (values: {LOGIN:string, PASSWORD:string}) => {
        (async() => {
            try {
                const token = await AuthAPI.authUser(values) as string;
                if(token){
                    setCookies('token', token)
                    router.push('/')
                }
            }
            catch(e){
                alert(e);
            }
        })()

    }
    
    return(
        <Formik initialValues={userInfo} 
            validationSchema = {LoginValidationSchema}
            onSubmit = {values => loginHandler(values) }>
            {({errors, touched, values, handleChange, handleBlur, handleSubmit}) =>
            <form className={style.main} onSubmit={handleSubmit}>
                <FormControl className={style.Form}>
                            <TextField className={style.input} 
                                label='Login'
                                id='LOGIN' 
                                name="LOGIN" 
                                type="text"
                                error ={touched.LOGIN && Boolean(errors.LOGIN)}
                                helperText={touched.LOGIN && errors.LOGIN} 
                                onBlur={handleBlur}
                                onChange={handleChange} 
                                value={values.LOGIN} />
                            <TextField className={style.input}
                                error ={ touched.PASSWORD && Boolean(errors.PASSWORD)}
                                helperText={ touched.PASSWORD && errors.PASSWORD}
                                label='Password'
                                id='PASSWORD' 
                                name="PASSWORD" 
                                type="password" 
                                onChange={handleChange} 
                                value={values.PASSWORD} />
                        <Button type='submit' variant='contained' >Login</Button>
                    </FormControl>
                </form>}
        </Formik>)
}

export const getServerSideProps : GetServerSideProps = async (ctx) => {
    const { req, res } = ctx;
    try{
        const token = req.cookies['token'];
        const decodeToken = JWT(token as string);
        if(!decodeToken){
            return {
                redirect: {
                    destination: '/',
                    permanent:false
                }
            }
        }
        return {props: {}}
    }
    catch(e){
        removeCookies('token', {req,res})
        return {
            props:{}
        }
    }

};

export default LoginPage;
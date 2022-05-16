import { useRouter } from "next/router";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import AuthAPI from "../../public/src/API/AuthAPI";
import { setCookies } from 'cookies-next';
import FormControl from '@mui/material/FormControl';
import {Button} from '@mui/material';
import style from '../../public/src/Components/Froms/Login.module.scss'
import { FormGroup, FormLabel, TextField } from "@mui/material";
import { GetServerSideProps } from "next";

const LoginPage = () => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({LOGIN:'', PASSWORD:''});
    const changeInputHandler:ChangeEventHandler<HTMLInputElement> = ({target}) => setUserInfo({...userInfo,[target.name]: target.value})
    const clickLoginHandler: MouseEventHandler  = (e) => {
        e.preventDefault();
        (async() => {
            try {
                const token = await AuthAPI.authUser(userInfo) as string;
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
        <div className={style.main}>
            <FormControl className={style.Form}>
                <FormGroup>
                    <FormLabel className={style.label}
                        htmlFor="LOGIN">
                        Login
                        <TextField className={style.input} 
                            id='LOGIN' 
                            name="LOGIN" 
                            type="text" 
                            onChange={changeInputHandler} 
                            value={userInfo.LOGIN} />
                    </FormLabel>

                </FormGroup>
                <FormGroup>
                    <FormLabel className={style.label}
                        htmlFor="PASSWORD">
                        Password
                        <TextField className={style.input}
                            id='PASSWORD' 
                            name="PASSWORD" 
                            type="password" 
                            onChange={changeInputHandler} 
                            value={userInfo.PASSWORD} />
                    </FormLabel>

                </FormGroup>
                <FormGroup>
                <   Button fullWidth variant='contained' onClick={clickLoginHandler}>Login</Button>
                </FormGroup>
            </FormControl>
            </div>)
}

export const getServerSideProps : GetServerSideProps = async (ctx) => {
    const token = ctx.req.cookies['token']
    if(token){
        return {
            redirect: {
                destination: '/',
                permanent:false
            }
        }
    }
    return {props: {}}
};

export default LoginPage;
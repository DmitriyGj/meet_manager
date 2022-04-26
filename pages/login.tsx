import { useRouter } from "next/router";
import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import AuthAPI from "../public/src/API/AuthAPI";
import { setCookies } from 'cookies-next'

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
    
    return(<form>
                <fieldset>
                    <label htmlFor="LOGIN">
                        Login
                    </label>
                    <input id='LOGIN' 
                            name="LOGIN" 
                            type="text" 
                            onChange={changeInputHandler} 
                            value={userInfo.LOGIN} />
                </fieldset>
                <fieldset>
                    <label htmlFor="PASSWORD">
                        Password
                    </label>
                    <input id='PASSWORD' 
                            name="PASSWORD" 
                            type="text" 
                            onChange={changeInputHandler} 
                            value={userInfo.PASSWORD} />
                </fieldset>
                <fieldset>
                    <button onClick={clickLoginHandler}>Login</button>
                </fieldset>
            </form>)
}

export default LoginPage;
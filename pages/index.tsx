import type { GetServerSideProps, NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {getCookie, getCookies} from 'cookies-next';
import JWT from 'jwt-decode';


interface UserPageProps {
    userInfo: any
}

const UserPage = ({userInfo}: UserPageProps) => {
    return (<div className={styles.container}>
            {
                Object.entries(userInfo).map(([key,value]) => 
                    <>{key}: {value}</>
                )
            }
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const {user} = JWT(ctx.req.cookies['token']) as {user: any};
    return {props: {userInfo:user}}
}

export default UserPage

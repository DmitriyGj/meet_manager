import type { GetServerSideProps, NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {getCookie, getCookies} from 'cookies-next';

const Meetings: NextPage = () => {
    return (<div className={styles.container}>
            <h1>Auth</h1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const {req,res} = ctx;
    const token = getCookie('token', {req,res})
    if(!token){
        return {redirect: {
            destination: '/login',
            permanent: false
        }}
    }
    else{
        return {props: {}}
    }
}

export default Meetings

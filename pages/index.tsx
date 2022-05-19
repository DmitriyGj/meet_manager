import type { GetServerSideProps } from 'next'
import JWT from 'jwt-decode';
import EmployeAPI from '../public/src/API/EmployeAPI';
import IMeeting from '../public/src/types/Meeting.model';
import { UserProfile} from '../public/src/Components/UserProfile/UserProfile';
import { removeCookies } from 'cookies-next';


interface UserPageProps {
    userInfo: any
    meetings:any
    initedMeetings: any
}

const UserPage = (props: UserPageProps) => {
    
    return (<UserProfile {...props}/>);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const {req,res} = ctx;
    try{ 
        const token = req.cookies['token']
        const {user} = JWT(token) as {user: any};
        const {ID} = user;
        const userInfo = await EmployeAPI.getEmployeById(ID, token)
    
        if(userInfo === 401 || userInfo === 403){
            return {
                redirect: {
                    destination:'/login',
                    permanent:false
                }
            }
        }
        
        const meetings: IMeeting[] = await EmployeAPI.getMeetingsOfEmploye(user.ID as string)
        const rows = meetings.map((item) => ({id: item.ID, ...item}))
        const initedMeetings = meetings.filter(item => item.INICIATOR_ID === ID).map((item) => ({id: item.ID, ...item}))
        return {props: {userInfo, meetings:rows, initedMeetings}}
    }
    catch(e){
        removeCookies('token', {req,res})
            return {
                redirect: {
                    destination:'/login',
                    permanent:false
                }
            }
    }
}

export default UserPage

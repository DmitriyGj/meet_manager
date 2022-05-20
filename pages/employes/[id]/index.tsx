import type { GetServerSideProps } from 'next'
import EmployeAPI from '../../../public/src/API/EmployeAPI';
import IMeeting from '../../../public/src/types/Meeting.model';
import { UserProfile} from '../../../public/src/Components/UserProfile/UserProfile';


interface UserPageProps {
    userInfo: any
    meetings:any
    initedMeetings: any
}

const UserPage = (props: UserPageProps) => {
    return (<UserProfile {...props}/>);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

        const token = ctx.req.cookies['token']
        const {id} = ctx.query;
        const userInfo = await EmployeAPI.getEmployeById(id as string, token)
        
        if(userInfo === 401 || userInfo === 403) {
            return {
                redirect: {
                    destination: '/login',
                    permanent:false
                }
            }
        }
        
        if(!userInfo){
            return {
                notFound:true
            }
        }
        const meetings: IMeeting[] = await EmployeAPI.getMeetingsOfEmploye(id as string)
        const rows = meetings.map((item) => ({id: item.ID, ...item}))
        const initedMeetings = meetings.filter(item =>  item?.INICIATOR_ID?.toString() === id ).map((item) => ({id: item.ID, ...item}))
        return {props: {userInfo, meetings:rows, initedMeetings}}


}

export default UserPage
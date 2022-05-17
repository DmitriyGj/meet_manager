import type { GetServerSideProps } from 'next'
import GuestAPI from '../../../public/src/API/GeustAPI';
import IMeeting from '../../../public/src/types/Meeting.model';
import { GuestProfile} from '../../../public/src/Components/GuestProfile/GuestProfile';

interface UserPageProps {
    userInfo: any
    meetings:any
    initedMeetings: any
}

const UserPage = (props: UserPageProps) => {
    return (<GuestProfile {...props}/>);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
        if(!ctx.req.cookies['token'] ){
            return {
                redirect: {
                    destination:'/login',
                    permanent:false
                }
            }
        }
        const token = ctx.req.cookies['token']
        const {id} = ctx.query;
        const userInfo = await GuestAPI.getGuestById(id as string, token)
        console.log(userInfo)
        if(userInfo === 401 || userInfo === 403) {
            return {
                redirect: {
                    dstination: '/login',
                    permanent:false
                }
            }
        }
        
        if(!userInfo){
            return {
                notFound:true
            }
        }
        const meetings: IMeeting[] = await GuestAPI.getMeetingsOfGuest(id as string) || []
        const rows = meetings.map((item) => ({id: item.ID, ...item}))
        return {props: {userInfo, meetings:rows}}


}

export default UserPage
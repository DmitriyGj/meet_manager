import { NextRequest, NextResponse } from "next/server";
import decode from 'jwt-decode';

export default function AccessCheck(req: NextRequest,res: NextResponse ){
    const {user} = decode(req.cookies['token']) as { user: any};

    if(user.ROLE_NAME !== 'ADMIN'){
        return NextResponse.redirect(new URL('/',req.url));
    }
}
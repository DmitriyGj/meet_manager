import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function RedirectUnAuthorized(req:NextRequest, res: NextResponse ){
    if(res.status === 401 || res.status === 403 ){
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}
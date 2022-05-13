import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest ){
    if(req.cookies['token']){
        const url = req.nextUrl.clone();
        url.pathname = req.nextUrl.basePath;
        return NextResponse.redirect(url);
    }
}
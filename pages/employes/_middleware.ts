import { NextRequest } from "next/server";

export default function ReqWithAuthHeader(req:NextRequest){
    req.headers.append('Authoriztion', req.cookies['token']);
}
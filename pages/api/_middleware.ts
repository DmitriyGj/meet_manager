import type { NextApiRequest,NextApiResponse } from "next";
import decode from 'jwt-decode'

export default function WithAuthoriztionToken(req: NextApiRequest, res: NextApiResponse) {
    if(!req.cookies['token']){
        return res.status(401).json({message:'sdasd'});
    }
    return res.status(200).json({he:'allright'});
}
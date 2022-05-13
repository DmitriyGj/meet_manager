import { NextApiRequest, NextApiResponse } from 'next';
import { EmployeService } from '../../../public/Service/EmployesService.request';
import {baseURL} from '../../../public/src/constants';

export default async function Hehe(req:NextApiRequest,res:NextApiResponse){
    res.send({hehe:req.headers.authorization, cookie:req.cookies})
}
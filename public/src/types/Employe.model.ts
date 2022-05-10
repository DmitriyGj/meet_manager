import { IPost } from "./Post.model"
import { Buffer } from "./Buffer"

export interface IEmployeInfo {
    ID:string, //id
    NAME: string
    LAST_NAME: string,
    PATRONYMIC: string,
    ADDRESS: string,
    EMAIL: string,
    PHONE: string,
    POST_NAME:string
}

export interface IEmployeResonseData extends IEmployeInfo, Buffer<string> {
    POST_ID: string
}

export interface IEmploye extends IEmployeInfo {
    POST: IPost
}
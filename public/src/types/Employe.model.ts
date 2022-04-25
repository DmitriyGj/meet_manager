import { IPost } from "./Post.model"

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

export interface IEmployeResonseData extends IEmployeInfo {
    POST_ID: string
}

export interface IEmploye extends IEmployeInfo {
    POST: IPost
}
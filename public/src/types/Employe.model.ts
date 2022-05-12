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
}

export interface IEmployeInfoDTO extends IEmployeInfo {
    POST_NAME:string
}

export interface IEmployeResonseData extends Omit<IEmployeInfo,'USER_ID'>, Buffer<string> {
    POST_ID: string
    ROLE_ID: string
}

export interface IEmploye extends IEmployeInfo {
    POST: IPost
}
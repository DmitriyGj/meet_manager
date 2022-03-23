import { DetailedHTMLProps, HTMLAttributes } from "react";
import cn from 'classnames';
import style from './Header.module.scss';
import Link from "next/link";

export interface IHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    title:string
}

export const Header = ( {title,className,...props }: IHeaderProps ) => {
    return(<div className = {cn(style.Header, className)} {...props}>
        <Link href = '/'>
            <a>
                <h1 className = {style.Logo}>{ title }</h1>
            </a>
        </Link>
        <nav className={style.Nav}>
            <h1>Главная</h1>
            <Link href = '/meetings'>
                <a>
                    <h1>Встречи</h1>
                </a>
            </Link>
            <Link href = '/employes'>
                <a>
                    <h1>Работники</h1>
                </a>
            </Link>
            <Link href = '/guests'>
                <a>
                    <h1>Гости</h1>
                </a>
            </Link>
        </nav>
    </div>)
}
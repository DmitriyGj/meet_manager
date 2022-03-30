import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react";
import cn from 'classnames';
import style from './Header.module.scss';
import { ExtendedLink } from '../../../Components/ExtendedLink/ExtendedLink';
import Logo from '../../../media/logo.svg';


export interface IHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    logo:ReactElement
}

export const Header = ( {logo,className,...props }: IHeaderProps ) => {
    return(<div className = {cn(style.Header, className)} {...props}>
        <ExtendedLink href='/'>
            <div className={style.Logo}>
                {logo}
            </div>
        </ExtendedLink>
        <nav className={style.Nav}>
            <ExtendedLink href='/' title="Главная" />
            <ExtendedLink href='/meetings' title = 'Встречи' />
            <ExtendedLink href='/employes' title =' Работники' />
            <ExtendedLink href='/guests' title='Гости' />
        </nav>
    </div>)
}
import { DetailedHTMLProps, HTMLAttributes, ReactElement, ReactNode } from "react"
import cn from 'classnames';
import style from './Footer.module.scss';

export interface IFooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    logo?:ReactElement
    children: ReactNode
}

export const Footer = ( {logo, children,className,...props }: IFooterProps ) => {
    return(<div className = { cn(style.Footer, className) }  {...props}>
        <div >
            <div className={style.Logo}>
                {logo}
            </div>
        </div>
        <div className={style.Links}>
            {children}
        </div>
        </div>)
}
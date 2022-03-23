import { DetailedHTMLProps, HTMLAttributes } from "react"
import cn from 'classnames';
import style from './Footer.module.scss';

export interface IFooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    title:string
}

export const Footer = ( {title,className,...props }: IFooterProps ) => {
    return(<div className = { cn(style.Footer, className) }  {...props}>
            <p>created by some orhanization</p>
            <h1>
                { title }
            </h1>
        </div>)
}
import Link from "next/link";
import style from './ExtendedLink.module.scss';
import { DetailedHTMLProps, HTMLAttributes, ReactElement, ReactNode, useRef } from "react";

interface ExtendedLinkProps extends  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title?: string
    href: string
    hlvl?: 'h1' | 'h2' | 'h3'
    children?: ReactNode
    
}

export const ExtendedLink = ({ href, title, hlvl='h1', children } : ExtendedLinkProps) => {

    const content = useRef<ReactElement | ReactNode>();

    if(hlvl && title && !children){
        switch(hlvl){
            case 'h1':
                content.current = <h1>{title}</h1>
            case 'h2':
                content.current = <h2>{title}</h2>
            case 'h3':
                content.current = <h3>{title}</h3>
        }
    }
    else{
        content.current = children;
    }

    return(
            <Link href = {href}>
                    {content.current}
            </Link>
);
}
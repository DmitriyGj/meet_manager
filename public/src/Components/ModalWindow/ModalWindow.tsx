import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import style from './ModalWindow.module.scss';

interface ModalWindowProps {
    title: string
    visible: boolean
    children:ReactNode | ReactElement | string
    onClose: () => void
}

export const ModalWindow = ({visible, title, children, onClose} : ModalWindowProps ) => {
    const [mounted, setIsMounred] = useState<boolean>(false);
    const root = useRef<HTMLElement>();

    useEffect(() => {
        const onKeyDownHandler = ({key} : KeyboardEvent) => {
            if(key === 'Escape'){
                onClose();
            }
        };
        setIsMounred(true);
        if(window){
            root.current = document.getElementById('modal') || undefined;
        }
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDownHandler);
        
        return() => {
            document.body.style.overflow = 'visible';
            document.removeEventListener('keydown', onKeyDownHandler);
        };
    },[mounted]);

    const modalView = visible ? (<div className={style.ModalWindow} onClick={onClose}>
        <div className={style.modal_dialog} onClick={e => e.stopPropagation()}>
            
            <div className={style.modal_header}>
                <h3 className={style.modal_title}>{title}</h3>
                <button className={style.modal_close}
                    onClick={onClose}>&times; </button>
            </div>

            <div className={style.modal_body}>
                <div className={style.modal_content}>{children}</div>
            </div>
        
        </div>
    </div>): null;

 
    return(mounted && root.current  ? createPortal(modalView, root.current) : null);
};
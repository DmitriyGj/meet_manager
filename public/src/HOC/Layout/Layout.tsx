import { FC, ReactNode, useEffect, useState } from "react";
import style from './Layout.module.scss'
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import Logo from '../../media/logo.svg'
import { ExtendedLink } from "../../Components/ExtendedLink/ExtendedLink";

interface ILayoutProps {
    children: ReactNode;
}

export const Layout = ({children} : ILayoutProps ) => {
    const [showNav, setShowNav ] = useState(); 

    useEffect(() => {

    });

    return(<div className={style.Layout}>
        <Header logo = {<Logo/>}className = { style.Header } />
            <div className = { style.Body } >
                { children }
            </div>
        <Footer logo = {<Logo/>} className = { style.Footer }>
            <div>
                <ExtendedLink title={`VK`} href={'https://vk.com/mylighting'}/>
                <ExtendedLink title={`TG`} href={'https://t.me/dritmiy_milyutin'}/>
            </div>
        </Footer>
    </div>)
}

export const withLayout = <T extends Record<string, unknown>>(Component: FC<T>) => {
	return function withLayoutComponent(props: T): JSX.Element {
		return (
				<Layout>
					<Component {...props} />
				</Layout>
		);
	};
};

import { FC, ReactNode } from "react";
import style from './Layout.module.scss'
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';

interface ILayoutProps {
    children: ReactNode;
}

export const Layout = ({children} : ILayoutProps ) => {
    return(<div className={style.Layout}>
        <Header title = 'Logo' className = { style.Header } />
            <div className = { style.Body } >
                { children }
            </div>
        <Footer title = 'Logo' className = { style.Footer } />
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

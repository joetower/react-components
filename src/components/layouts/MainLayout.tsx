import Header from '../site/header/Header';
import Footer from '../site/footer/Footer';

import { ReactNode } from 'react';

const MainLayout = ({ children, baseClass }: { children: ReactNode; baseClass: string }) => {
 return (
  <>
    <Header theme='primary' />
    <main className={baseClass}>{children}</main>
    <Footer theme='primary' />
  </>
 );
};
export default MainLayout;

import Header from '../site/header/Header';
import Footer from '../site/footer/Footer';

import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
const MainLayout = ({ children, baseClass }: { children: ReactNode; baseClass: string }) => {
 return (
  <>
    <Header theme='primary' />
    <main className={baseClass}>
      {children}
      <Outlet />
    </main>
    <Footer theme='primary' />
  </>
 );
};
export default MainLayout;

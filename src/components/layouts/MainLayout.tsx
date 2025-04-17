import Header from '../site/header/Header';
import Footer from '../site/footer/Footer';

import { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
 return (
  <>
    <Header theme='primary' />
    <main>{children}</main>
    <Footer theme='primary' />
  </>
 );
};
export default MainLayout;

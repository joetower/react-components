import Header from '../site/header/Header';
import Footer from '../site/footer/Footer';
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainLayout = ({ children, baseClass }: { children: ReactNode; baseClass: string }) => {
 return (
  <>
    <Header theme='primary' />
      <motion.div initial={{opacity: 0, y:20, x:0}} animate={{opacity: 1, y:0, x:0}} exit={{opacity: 0, y:-20, x:0}} transition={{duration: 0.25}} className='inner__layout'>
        <main className={baseClass}>
          {children}
          <Outlet />
        </main>
      </motion.div>
    <Footer theme='primary' />
  </>
 );
};
export default MainLayout;

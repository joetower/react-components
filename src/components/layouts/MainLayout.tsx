import Header from '../site/header/Header';
import Footer from '../site/footer/Footer';
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const MainLayout = ({ children, baseClass }: { children: ReactNode; baseClass: string }) => {
  const prefersReducedMotion = useReducedMotion();
 return (
  <>
    <Header theme='primary' />
    {!prefersReducedMotion && (
      <motion.div initial={{opacity: 0, y:35}} animate={{opacity: 1, y:0}} exit={{opacity: 0, y:-35}} transition={{duration: 0.45}} className='inner__layout'>
        <main className={baseClass}>
          {children}
          <Outlet />
        </main>
      </motion.div>
    )}
    {prefersReducedMotion && (
      <div className='inner__layout'>
        <main className={baseClass}>
          {children}
          <Outlet />
        </main>
      </div>
    )}
    <Footer theme='primary' />
  </>
 );
};
export default MainLayout;

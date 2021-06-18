import React from 'react';
import { Footer, NavBar } from '../../components';

export const DefaultLayout: React.FC = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

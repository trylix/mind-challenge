import React from 'react';
import { NavBar } from '../../components';

export const DefaultLayout: React.FC = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

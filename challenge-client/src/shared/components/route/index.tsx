import React from 'react';
import * as ReactRouter from 'react-router';
import { DefaultLayout } from '../../layouts';

export const Route: React.FC<ReactRouter.RouteProps> = ({
  element,
  ...rest
}: ReactRouter.RouteProps) => {
  return (
    <ReactRouter.Route
      {...rest}
      element={<DefaultLayout>{element}</DefaultLayout>}
    />
  );
};

export default Route;

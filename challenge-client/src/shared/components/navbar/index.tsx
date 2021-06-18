import classNames from 'classnames';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts';
import { IUser } from '../../interfaces';

interface INavItem {
  path: string;
  name: string;
  icon?: string;
  exact?: boolean;
  checkAuth?: (user?: IUser) => boolean;
}

const navItems: INavItem[] = [
  {
    path: '/',
    name: 'Home',
    exact: true,
  },
  {
    path: '/editor',
    name: 'New Post',
    icon: 'ion-compose',
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: 'ion-gear-a',
  },
  {
    path: '/register',
    name: 'Sign up',
    checkAuth: (user?: IUser) => !user,
  },
  {
    path: '/logout',
    name: 'Log out',
    checkAuth: (user?: IUser) => !!user,
  },
];

export const NavBar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const handleNavigate =
    (path: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      if (path === '/logout') {
        auth.logOut();
        return;
      }

      navigate(path);
    };

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right">
          {navItems
            .filter((item) =>
              item.checkAuth ? item.checkAuth(auth.user) : true,
            )
            .map((item) => (
              <li className="nav-item" key={item.name.toLowerCase()}>
                <a
                  className={classNames('nav-link', {
                    active: item.exact
                      ? pathname === item.path
                      : pathname.startsWith(item.path),
                  })}
                  onClick={handleNavigate(item.path)}
                  href="/#"
                >
                  {item.icon && <i className={item.icon} />}
                  &nbsp;{item.name}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};

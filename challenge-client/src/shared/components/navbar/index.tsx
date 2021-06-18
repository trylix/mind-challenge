import classNames from 'classnames';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

export interface INavItem {
  path: string;
  name: string;
  icon?: string;
  exact?: boolean;
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
  },
];

export const NavBar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigate =
    (path: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      navigate(path);
    };

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right">
          {navItems.map((item) => (
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

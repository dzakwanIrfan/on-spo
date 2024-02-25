import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import * as ROUTES from '../../constants/routes';

const LinkNav = ({ to, label }) => {
  const location = useLocation();
  const isCurrentPath = location.pathname === to;

  return (
    <NavLink
      to={to}
      activeClassName="border-blue-500 border-b-2"
      className={clsx(
        'px-1 hover:border-blue-500 hover:border-b-2 transition-all border-opacity-0',
        { 'border-opacity-100 border-blue-500 border-b-2': isCurrentPath }
      )}
    >
      {label}
    </NavLink>
  );
};

const NavigationBar = () => {
  return (
    <header className="flex justify-between px-20 py-4 bg-neutral-50 border-b-2 border-blue-500 text-neutral-800">
      <LinkNav to={ROUTES.HOME} label={'Home'} />
      <nav className="flex gap-4">
        <LinkNav to={ROUTES.ABOUT} label={'About'} />
        <LinkNav to={ROUTES.CONTENT} label={'Content'} />
      </nav>
    </header>
  );
};

export default NavigationBar;

import React from 'react';
import { RoutePath } from '../types';
import HeroSection from '../components/HeroSection';
import { NavProvider } from '../design/NavContext.jsx';
import HomeBody from '../design/HomeBody.jsx';

interface HomeProps {
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

export default function Home({ setPath }: HomeProps) {
  return (
    <div className="home-site nh-refreshed nh-motion-running home-body-wrap">
      <HeroSection setPath={setPath} />
      <NavProvider setPath={setPath}>
        <HomeBody />
      </NavProvider>
    </div>
  );
}

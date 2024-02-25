import React from "react";
import NavigationBar from './components/NavigationBar/navigation-bar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from './components/Hero/hero';
import * as ROUTES from "./constants/routes";
import About from "./views/About/about";
import Content from "./views/Content/content";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path={ROUTES.HOME} element={<Hero />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTENT} element={<Content />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { Routes } from 'react-router-dom';
import { Article } from './container/article';
import { Editor } from './container/editor';
import { Home } from './container/home';
import { Login } from './container/login';
import { ProfileArticles } from './container/profile/articles';
import { ProfileFavorites } from './container/profile/favorites';
import { Register } from './container/register';
import { Settings } from './container/settings';
import { Route } from './shared/components';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editor/:slug?" element={<Editor />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/profile">
            <Routes>
              <Route path="/:username" element={<ProfileArticles />} />
              <Route
                path="/:username/favorites"
                element={<ProfileFavorites />}
              />
            </Routes>
          </Route>
        </Routes>
      </Route>
    </Routes>
  );
};

export default App;

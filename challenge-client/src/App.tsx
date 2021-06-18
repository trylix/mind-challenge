import React from 'react';
import { Routes } from 'react-router-dom';
import { Article } from './container/article';
import { Editor } from './container/editor';
import { Home } from './container/home';
import { Login } from './container/login';
import { Register } from './container/register';
import { Settings } from './container/settings';
import { Route } from './shared/components';
import { AuthProvider } from './shared/contexts';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:slug" element={<Editor />} />
        <Route path="/article/:slug" element={<Article />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

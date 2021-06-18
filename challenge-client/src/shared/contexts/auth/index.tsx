import React from 'react';
import { useNavigate } from 'react-router';
import axios from '../../../config/axios';
import { IUser } from '../../interfaces';
import { getToken, removeToken, setToken } from '../../utils/token';

export interface IAuthContext {
  signIn(values: { [key: string]: string }): Promise<void>;
  logOut(): void;
  user?: IUser;
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext,
);

export const AuthProvider: React.FC = ({ children }) => {
  const token = getToken();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<IUser>();

  const signIn = async (values: { [key: string]: string }) => {
    const { data } = await axios.post('/users/login', {
      user: values,
    });

    setToken(data.user.token);
    setUser(data.user);
    navigate('/');
  };

  const logOut = () => {
    setUser(undefined);
    removeToken();
  };

  const loadSession = async () => {
    if (token && !user) {
      const { data } = await axios.get('/user');
      setUser(data.user);
    }
  };

  React.useEffect(() => {
    loadSession();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        logOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
};

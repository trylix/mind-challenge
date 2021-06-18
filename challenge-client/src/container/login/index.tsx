import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../shared/contexts';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const goToRegister = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate('/register');
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const { value } = target;
    const { name } = target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await auth.signIn(values);
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        setErrors(data.errors);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 col-md-offset-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="/#" onClick={goToRegister}>
                Don&apos;t have an account?
              </a>
            </p>

            <ul className="error-messages">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>

            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  name="email"
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  onChange={handleOnChange}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  name="password"
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  onChange={handleOnChange}
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

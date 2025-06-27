import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthStatus, selectAuthError } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { type AppDispatch } from '../store';

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate('/tasks');
    } else {
      setServerError(error || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className='auth-card-name'>Login</h2>
        {serverError && <div className="error-message">{serverError}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className='login-form-label'>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="form-input"
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className='login-form-label'>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: 6 })}
              className="form-input"
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            className="primary-button"
            disabled={status === 'loading'}
          > 
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </button>

          <div className="register-link">
            Don't have an account?{' '}
            <Link to="/register" className="register-button">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
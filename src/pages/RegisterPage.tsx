import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthStatus, selectAuthError } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { type AppDispatch } from '../store';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setServerError('Passwords do not match');
      return;
    }
    
    const result = await dispatch(registerUser({ 
      email: data.email, 
      password: data.password 
    }));
    
    if (registerUser.fulfilled.match(result)) {
      navigate('/tasks');
    } else {
      setServerError(error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className='auth-card-name'>Register</h2>
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
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="form-input"
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className='login-form-label'>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm password',
                validate: value => 
                  value === watch('password') || 'Passwords do not match'
              })}
              className="form-input"
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="primary-button"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
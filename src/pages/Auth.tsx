import { useState } from 'react';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the login link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Supabase Auth Error:', error);
      const msg = error.message || 'Failed to connect to authentication server.';
      setError(`${msg} (Check if your Supabase project is paused or if your internet is blocked)`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col justify-center items-center h-full p-4 page-enter-active">
      <div className="card w-full" style={{ maxWidth: '400px' }}>
        <h2 className="text-h2 mb-4" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back 👋'}
        </h2>
        
        {error && (
          <div style={{ backgroundColor: 'var(--expense-bg)', color: 'var(--expense)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleAuth} className="flex-col gap-3">
          <div className="form-group mb-0">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="student@university.edu.gh" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group mb-0">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

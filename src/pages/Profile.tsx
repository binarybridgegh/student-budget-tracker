import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

const Profile = () => {
  const { user, profile, updateProfile, transactions, budgets, loading, deleteTransaction } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Anya',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  ];

  if (loading) return null;

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateProfile({ full_name: name });
      alert('Profile updated!');
    } catch (e: any) {
      alert('Update failed: ' + (e.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const selectAvatar = async (url: string) => {
    setSaving(true);
    try {
      await updateProfile({ avatar_url: url });
    } catch (e: any) {
      alert('Avatar update failed: ' + (e.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Grouped History Logic
  const groupedData = transactions.reduce((acc, tx) => {
    const month = format(new Date(tx.date), 'MMMM yyyy');
    if (!acc[month]) acc[month] = { transactions: [], budget: null };
    acc[month].transactions.push(tx);
    return acc;
  }, {} as Record<string, { transactions: any[], budget: any }>);

  budgets.forEach(b => {
    const monthName = format(new Date(b.month + '-01'), 'MMMM yyyy');
    if (groupedData[monthName]) {
      groupedData[monthName].budget = b;
    }
  });

  return (
    <div className="page-enter-active">
      <div className="flex-col items-center mb-6">
        <div className="mb-4" style={{ position: 'relative' }}>
          <img 
            src={profile?.avatar_url || avatars[0]} 
            alt="Avatar" 
            style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid var(--primary)', padding: 4 }}
          />
        </div>
        <h2 className="text-h2">{profile?.full_name || 'Your Profile'}</h2>
        <p className="text-muted text-small">{user?.email}</p>
      </div>

      <div className="card mb-4">
        <h3 className="text-h3 mb-3">Personal Details</h3>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input 
            type="text" 
            className="form-input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }} 
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Name'}
        </button>
      </div>

      <div className="card mb-4">
        <h3 className="text-h3 mb-3">Choose Avatar</h3>
        <div className="flex-row flex-wrap gap-3 justify-center">
          {avatars.map(url => (
            <button 
              key={url}
              onClick={() => selectAvatar(url)}
              style={{ 
                background: 'none', 
                border: profile?.avatar_url === url ? '3px solid var(--primary)' : '3px solid transparent',
                borderRadius: '50%',
                padding: 2,
                cursor: 'pointer'
              }}
            >
              <img src={url} alt="Avatar option" style={{ width: 50, height: 50, borderRadius: '50%' }} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 mb-8">
        <h2 className="text-h2 mb-4">Financial History</h2>
        <div className="flex-col gap-6">
          {Object.entries(groupedData).length === 0 ? (
            <p className="text-muted text-center py-4">No financial history available yet.</p>
          ) : (
            Object.entries(groupedData).map(([month, data]) => {
              const mIncome = data.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
              const mExpense = data.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
              
              return (
                <div key={month} className="month-section">
                  <div className="flex-row justify-between items-end mb-2">
                    <h3 className="text-h3" style={{ fontSize: '1.1rem' }}>{month}</h3>
                    <p className="text-small text-muted">Net: <span className={mIncome - mExpense >= 0 ? 'text-positive' : 'text-negative'}>₵ {(mIncome - mExpense).toFixed(2)}</span></p>
                  </div>

                  {data.budget && (
                    <div className="card mb-3" style={{ padding: '0.6rem 1rem', borderLeft: '4px solid var(--primary)', backgroundColor: 'rgba(255, 184, 0, 0.02)' }}>
                      <div className="flex-row justify-between items-center text-small">
                        <span>Target Budget</span>
                        <span className="text-bold">₵ {data.budget.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex-col gap-2">
                    {data.transactions.map(tx => (
                      <div key={tx.id} className="card flex-row justify-between items-center" style={{ padding: '0.75rem 1rem', borderRadius: '12px' }}>
                        <div className="flex-row gap-3 items-center">
                          <div className="text-small">{tx.type === 'income' ? '💰' : '💸'}</div>
                          <div>
                            <p className="text-bold m-0" style={{ fontSize: '0.9rem' }}>{tx.category}</p>
                            <p className="text-small text-muted m-0" style={{ fontSize: '0.7rem' }}>{format(new Date(tx.date), 'MMM d')}</p>
                          </div>
                        </div>
                        <div className="flex-row items-center gap-3">
                          <div style={{ textAlign: 'right' }}>
                            <p className={`text-bold m-0 ${tx.type === 'income' ? 'text-positive' : 'text-negative'}`} style={{ fontSize: '0.9rem' }}>
                              {tx.type === 'income' ? '+' : '-'} ₵ {tx.amount.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex-row gap-1">
                            <button 
                              onClick={() => navigate(`/edit-transaction/${tx.id}`)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('Delete this transaction?')) {
                                  deleteTransaction(tx.id);
                                }
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <button onClick={handleSignOut} className="btn btn-outline" style={{ width: '100%', color: 'var(--negative)', borderColor: 'rgba(255, 75, 75, 0.2)', marginBottom: '2rem' }}>
        Sign Out
      </button>
    </div>
  );
};

export default Profile;

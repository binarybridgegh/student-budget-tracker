import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { 
  Edit2, 
  User, 
  Mail, 
  LogOut, 
  Check, 
  X, 
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Profile = () => {
  const { user, profile, updateProfile, transactions, budgets, loading, deleteTransaction } = useAppContext();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.full_name) {
      setEditName(profile.full_name);
    }
  }, [profile]);

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
      await updateProfile({ full_name: editName });
      setIsEditing(false);
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
      {!isEditing ? (
        /* VIEW MODE */
        <div className="flex-col gap-6">
          <div className="flex-col items-center py-6">
            <div className="mb-4" style={{ position: 'relative' }}>
              <img 
                src={profile?.avatar_url || avatars[0]} 
                alt="Avatar" 
                style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  border: '4px solid var(--primary)', 
                  padding: 4,
                  boxShadow: '0 8px 24px rgba(255, 184, 0, 0.2)'
                }}
              />
            </div>
            <h2 className="text-h2" style={{ marginBottom: '0.25rem' }}>{profile?.full_name || 'Student User'}</h2>
            <div className="flex-row gap-2 items-center text-muted">
              <Mail size={14} />
              <span className="text-small">{user?.email}</span>
            </div>
            
            <div className="flex-row gap-3 mt-6" style={{ width: '100%', maxWidth: '300px' }}>
              <button 
                className="btn btn-primary flex-1" 
                style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} /> Edit Profile
              </button>
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.75rem', color: 'var(--expense)' }}
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-h3 mb-4 flex-row gap-2 items-center">
              <Calendar size={20} className="text-primary" />
              Financial History
            </h3>
            
            <div className="flex-col gap-8">
              {Object.entries(groupedData).length === 0 ? (
                <div className="card py-12 flex-col items-center opacity-70">
                  <DollarSign size={40} className="mb-2 text-muted" />
                  <p className="text-muted text-center">No transactions recorded yet.</p>
                </div>
              ) : (
                Object.entries(groupedData).map(([month, data]) => {
                  const mIncome = data.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
                  const mExpense = data.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
                  
                  return (
                    <div key={month} className="month-group">
                      <div className="flex-row justify-between items-center mb-3">
                        <h4 className="text-bold text-h3" style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>{month}</h4>
                        <div className="flex-row gap-3">
                          <div className="flex-row gap-1 items-center text-small text-positive">
                             <TrendingUp size={12} /> ₵{mIncome.toFixed(0)}
                          </div>
                          <div className="flex-row gap-1 items-center text-small text-negative">
                             <TrendingDown size={12} /> ₵{mExpense.toFixed(0)}
                          </div>
                        </div>
                      </div>

                      <div className="flex-col gap-3">
                        {data.transactions.map(tx => (
                          <div key={tx.id} className="card flex-row justify-between items-center" style={{ padding: '1rem', borderRadius: '16px' }}>
                            <div className="flex-row gap-3 items-center">
                              <div 
                                style={{ 
                                  width: 40, 
                                  height: 40, 
                                  borderRadius: '12px', 
                                  backgroundColor: tx.type === 'income' ? 'var(--income-bg)' : 'var(--expense-bg)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.2rem'
                                }}
                              >
                                {tx.type === 'income' ? '💰' : '💸'}
                              </div>
                              <div>
                                <p className="text-bold m-0" style={{ fontSize: '0.95rem' }}>{tx.category}</p>
                                <p className="text-small text-muted m-0">{format(new Date(tx.date), 'MMM d, yyyy')}</p>
                              </div>
                            </div>
                            
                            <div className="flex-row items-center gap-4">
                              <div style={{ textAlign: 'right' }}>
                                <p className={`text-bold m-0 ${tx.type === 'income' ? 'text-positive' : 'text-negative'}`} style={{ fontSize: '1rem' }}>
                                  {tx.type === 'income' ? '+' : '-'}₵{tx.amount.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex-row gap-2 border-l pl-3" style={{ borderColor: 'var(--border-light)' }}>
                                <button 
                                  onClick={() => navigate(`/edit-transaction/${tx.id}`)}
                                  className="btn-icon"
                                  style={{ width: 32, height: 32 }}
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm('Delete this transaction?')) {
                                      deleteTransaction(tx.id);
                                    }
                                  }}
                                  className="btn-icon"
                                  style={{ width: 32, height: 32, color: 'var(--expense)' }}
                                >
                                  <X size={14} />
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
        </div>
      ) : (
        /* EDIT MODE */
        <div className="flex-col gap-6">
          <div className="flex-row gap-3 items-center py-4">
            <button 
              className="btn-icon" 
              onClick={() => setIsEditing(false)}
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-h2 m-0">Edit Profile</h2>
          </div>

          <div className="card">
            <div className="flex-col items-center mb-6">
              <img 
                src={profile?.avatar_url || avatars[0]} 
                alt="Current Avatar" 
                style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--primary)', padding: 3, marginBottom: '1rem' }}
              />
              <p className="text-small text-muted">Select a new avatar below</p>
            </div>

            <div className="flex-row flex-wrap gap-3 justify-center mb-8">
              {avatars.map(url => (
                <button 
                  key={url}
                  onClick={() => selectAvatar(url)}
                  style={{ 
                    background: 'none', 
                    border: profile?.avatar_url === url ? '3px solid var(--primary)' : '3px solid transparent',
                    borderRadius: '50%',
                    padding: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  className="hover-scale"
                >
                  <img src={url} alt="Option" style={{ width: 50, height: 50, borderRadius: '50%' }} />
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label flex-row gap-2">
                <User size={14} /> Full Name
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
              />
            </div>

            <div className="flex-row gap-3 mt-4">
              <button 
                className="btn btn-outline flex-1" 
                onClick={() => setIsEditing(false)}
              >
                <X size={18} /> Cancel
              </button>
              <button 
                className="btn btn-primary flex-1" 
                onClick={handleUpdate}
                disabled={saving || !editName.trim()}
              >
                {saving ? 'Saving...' : <><Check size={18} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

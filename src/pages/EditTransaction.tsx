import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const EditTransaction = () => {
  const { id } = useParams();
  const { transactions, updateTransaction } = useAppContext();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setType(tx.type);
      setAmount(tx.amount.toString());
      setCategory(tx.category);
      setDescription(tx.description || '');
      setDate(new Date(tx.date).toISOString().split('T')[0]);
    }
  }, [id, transactions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    setLoading(true);
    try {
      await updateTransaction(id!, {
        type,
        amount: Number(amount),
        category,
        description,
        date: new Date(date).toISOString()
      });
      navigate('/profile');
    } catch (error: any) {
      console.error(error);
      alert('Failed to update transaction: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const categories = type === 'income' 
    ? ['Allowance', 'Work', 'Gift', 'Other']
    : ['Food', 'Transport', 'Academic', 'Entertainment', 'Health', 'Other'];

  return (
    <div className="page-enter-active">
      <h2 className="text-h2" style={{ marginBottom: '1.5rem' }}>Edit Transaction</h2>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="flex-row gap-2 mb-4" style={{ background: 'var(--bg-input)', padding: '4px', borderRadius: '12px' }}>
          <button 
            type="button" 
            className={`flex-1 btn btn-small ${type === 'income' ? 'btn-primary' : ''}`}
            onClick={() => setType('income')}
            style={type !== 'income' ? { border: 'none' } : {}}
          >
            Income
          </button>
          <button 
            type="button" 
            className={`flex-1 btn btn-small ${type === 'expense' ? 'btn-primary' : ''}`}
            onClick={() => setType('expense')}
            style={type !== 'expense' ? { border: 'none' } : {}}
          >
            Expense
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Amount (GHS)</label>
          <input 
            type="number" 
            step="0.01"
            className="form-input" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select 
            className="form-input" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input 
            type="date" 
            className="form-input" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description (Optional)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="What was this for?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
        
        <button 
          type="button" 
          className="btn btn-outline" 
          style={{ width: '100%', marginTop: '0.75rem' }} 
          onClick={() => navigate('/profile')}
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditTransaction;

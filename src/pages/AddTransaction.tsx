import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction } = useAppContext();
  
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const expenseCategories = ['Food & Dining', 'Transportation (Trotro/Uber)', 'Academics (Handouts etc)', 'Entertainment', 'Personal Care', 'Bills', 'Other'];
  const incomeCategories = ['Allowance', 'Salary/Side Hustle', 'Gift', 'Other'];

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory(newType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    setLoading(true);
    try {
      await addTransaction({
        type,
        amount: Number(amount),
        category,
        description,
        date: new Date(date).toISOString()
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter-active flex-col h-full">
      <h2 className="text-h2" style={{ marginBottom: '1.5rem' }}>Add Transaction</h2>
      
      <form onSubmit={handleSubmit} className="card flex-col flex-1">
        <div className="flex-row mb-4" style={{ marginBottom: '1.5rem', background: 'var(--bg-input)', borderRadius: '12px', padding: '4px' }}>
          <button 
            type="button"
            className={`flex-1 btn ${type === 'expense' ? 'btn-primary' : 'btn-outline'}`}
            style={type === 'expense' ? { backgroundColor: 'var(--expense)', color: '#fff', border: 'none', padding: '0.75rem' } : { border: 'none', padding: '0.75rem' }}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button 
            type="button"
            className={`flex-1 btn ${type === 'income' ? 'btn-primary' : 'btn-outline'}`}
            style={type === 'income' ? { backgroundColor: 'var(--success)', color: '#fff', border: 'none', padding: '0.75rem' } : { border: 'none', padding: '0.75rem' }}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Amount (GHS)</label>
          <input 
            type="number" 
            step="0.01"
            className="form-input" 
            placeholder="0.00" 
            style={{ fontSize: '1.5rem', fontWeight: 600 }} 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
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
          <label className="form-label">Category</label>
          <select 
            className="form-input form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {type === 'expense' 
              ? expenseCategories.map(c => <option key={c} value={c}>{c}</option>)
              : incomeCategories.map(c => <option key={c} value={c}>{c}</option>)
            }
          </select>
        </div>
        
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Description (Optional)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="What was this for?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={50}
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} disabled={loading}>
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';

const BudgetSetup = () => {
  const { budgets, transactions, updateBudget } = useAppContext();
  const currentMonth = format(new Date(), 'yyyy-MM');
  
  const currentBudget = budgets.find(b => b.month === currentMonth);
  const targetAmount = currentBudget?.amount || 0;
  
  const monthExpenses = transactions
    .filter(t => t.date.startsWith(currentMonth) && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const left = Math.max(0, targetAmount - monthExpenses);
  const progressPercent = targetAmount > 0 ? Math.min(100, (monthExpenses / targetAmount) * 100) : 0;
  
  const [loading, setLoading] = useState(false);
  const [newAmount, setNewAmount] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || isNaN(Number(newAmount))) return;
    
    setLoading(true);
    try {
      await updateBudget(currentMonth, Number(newAmount));
      setNewAmount('');
    } catch (error) {
      console.error(error);
      alert('Failed to update budget');
    } finally {
      setLoading(false);
    }
  };

  const isOverBudget = monthExpenses > targetAmount;
  const progressColor = isOverBudget ? 'var(--expense)' : progressPercent > 80 ? '#FFB800' : 'var(--primary)';

  return (
    <div className="page-enter-active">
      <h2 className="text-h2" style={{ marginBottom: '1.5rem' }}>Monthly Budget</h2>
      
      <div className="card mb-4" style={{ marginBottom: '1.5rem' }}>
        <p className="text-small text-muted mb-1">Target for {format(new Date(), 'MMMM yyyy')}</p>
        <div className="flex-row items-baseline gap-2 mb-2">
          <h1 className="text-h1">₵ {targetAmount.toFixed(2)}</h1>
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <div className="flex-row justify-between text-small mb-1">
            <span>Spent: ₵ {monthExpenses.toFixed(2)}</span>
            <span style={{ color: isOverBudget ? 'var(--expense)' : '' }}>
              {isOverBudget ? `Overspent: ₵ ${(monthExpenses - targetAmount).toFixed(2)}` : `Left: ₵ ${left.toFixed(2)}`}
            </span>
          </div>
          
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: progressColor, borderRadius: '4px', transition: 'width var(--transition-normal)' }}></div>
          </div>
          
          <p className="text-small text-muted mt-2" style={{ textAlign: 'center' }}>
            {targetAmount === 0 
              ? 'No budget set for this month.' 
              : isOverBudget 
                ? 'You exceeded your target ⚠️' 
                : progressPercent > 80 
                  ? "Careful, you're almost at your limit!" 
                  : 'You are on track! 🚀'
            }
          </p>
        </div>
      </div>
      
      <form onSubmit={handleUpdate} className="card">
        <h3 className="text-h3" style={{ marginBottom: '1rem' }}>Adjust Budget</h3>
        <div className="form-group">
          <label className="form-label">New Monthly Target (GHS)</label>
          <input 
            type="number" 
            step="0.01"
            className="form-input" 
            placeholder="e.g. 1500" 
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
          {loading ? 'Updating...' : 'Update Budget'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-small text-muted" style={{ marginTop: '1rem', fontStyle: 'italic' }}>
          "A budget is telling your money where to go instead of wondering where it went."
        </p>
      </div>
    </div>
  );
};

export default BudgetSetup;

import { useAppContext } from '../context/AppContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const { user, transactions, loading } = useAppContext();
  
  if (loading) return null;

  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  
  const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Expense by Category Chart Data
  const expensesByCategory = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FFB800', // Primary Gold
          '#008B74', // Secondary Teal
          '#FF4B4B', // Accent Red
          '#3B82F6', // Blue
          '#8B5CF6', // Purple
        ],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#9BA3AF', font: { family: 'Inter', size: 12 } }
      }
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('food')) return '🍔';
    if (category.toLowerCase().includes('transport')) return '🚕';
    if (category.toLowerCase().includes('academic')) return '📚';
    if (category.toLowerCase().includes('allowance')) return '💰';
    return '📝';
  };

  return (
    <div className="page-enter-active">
      <div className="flex-row justify-between items-center mb-4" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2 className="text-h2">Hi, {user?.email?.split('@')[0]} 👋</h2>
          <p className="text-muted">Here's your financial overview</p>
        </div>
      </div>
      
      <div className="card mb-4" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, #111 100%)' }}>
        <p className="text-small text-muted mb-1">Total Balance (This Month)</p>
        <h1 className="text-h1 mb-2">₵ {balance.toFixed(2)}</h1>
        
        <div className="flex-row justify-between mt-4">
          <div>
            <p className="text-small flex-row items-center gap-1"><span style={{width: 8, height: 8, backgroundColor: 'var(--success)', borderRadius: '50%', display: 'inline-block'}}></span> Income</p>
            <p className="text-h3 text-positive">₵ {totalIncome.toFixed(2)}</p>
          </div>
          <div style={{width: 1, backgroundColor: 'var(--border-light)'}}></div>
          <div>
            <p className="text-small flex-row items-center gap-1"><span style={{width: 8, height: 8, backgroundColor: 'var(--expense)', borderRadius: '50%', display: 'inline-block'}}></span> Expenses</p>
            <p className="text-h3 text-negative">₵ {totalExpense.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card mb-4" style={{ marginBottom: '1.5rem' }}>
          <h3 className="text-h3 mb-2">Where your money went</h3>
          <div style={{ height: '200px', position: 'relative' }}>
            <Doughnut data={chartData} options={chartOptions} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <span className="text-small text-muted">Expenses</span>
              <p className="text-bold" style={{ fontSize: '1.1rem' }}>₵ {totalExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4" style={{ marginBottom: '1.5rem' }}>
        <h3 className="text-h3 mb-2" style={{ marginBottom: '1rem' }}>Recent Transactions</h3>
        
        {recentTransactions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <p className="text-muted">No transactions yet.</p>
          </div>
        ) : (
          <div className="flex-col gap-3">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="card flex-row justify-between items-center" style={{ padding: '1rem' }}>
                <div className="flex-row gap-3 items-center">
                  <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: tx.type === 'income' ? 'var(--income-bg)' : 'var(--expense-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {getCategoryIcon(tx.category)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, textTransform: 'capitalize' }}>{tx.category}</h4>
                    <p className="text-small text-muted">{tx.description || tx.type}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 className={tx.type === 'income' ? 'text-positive' : 'text-negative'} style={{ margin: 0 }}>
                    {tx.type === 'income' ? '+' : '-'} ₵ {tx.amount.toFixed(2)}
                  </h4>
                  <p className="text-small text-muted">{format(new Date(tx.date), 'MMM d, yy')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

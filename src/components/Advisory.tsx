import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';

const Advisory = () => {
  const { transactions, budgets } = useAppContext();
  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const monthBudget = budgets.find(b => b.month === currentMonth);

  if (!monthBudget) return (
    <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
      <p className="text-bold mb-1">💡 Pro Tip</p>
      <p className="text-small text-muted">Set a budget target for this month to get personalized financial advice!</p>
    </div>
  );

  const expenses = monthTransactions.filter(t => t.type === 'expense');
  const totalSpent = expenses.reduce((s, t) => s + t.amount, 0);
  const ratio = totalSpent / monthBudget.amount;

  let advice = "";
  let icon = "🚀";

  if (ratio > 1) {
    advice = "You've exceeded your budget! Try to limit 'Other' expenses for the rest of the month.";
    icon = "⚠️";
  } else if (ratio > 0.8) {
    advice = "You're at 80% of your budget. Consider cutting back on non-essential categories.";
    icon = "📉";
  } else if (ratio > 0.5) {
    advice = "Halfway through your budget. You're doing okay, but keep tracking!";
    icon = "📊";
  } else {
    advice = "Great job! You're well within your budget. Keep it up!";
    icon = "✅";
  }

  // Find highest category
  const categories = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories).sort((a,b) => b[1] - a[1])[0];
  if (topCategory && ratio > 0.6) {
    advice += ` You've spent the most on ${topCategory[0]} (₵ ${topCategory[1].toFixed(2)}).`;
  }

  return (
    <div className="card" style={{ borderLeft: '4px solid var(--primary)', backgroundColor: 'rgba(255, 184, 0, 0.05)' }}>
      <p className="text-bold mb-1">{icon} Budget Advisor</p>
      <p className="text-small text-muted">{advice}</p>
    </div>
  );
};

export default Advisory;

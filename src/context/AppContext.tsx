import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Transaction, Budget } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AppContextType = {
  user: User | null;
  session: Session | null;
  transactions: Transaction[];
  budgets: Budget[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateBudget: (month: string, amount: number) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshData();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) refreshData();
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshData = async () => {
    setLoading(true);
    if (!user) return;

    try {
      const [txRes, budgetsRes] = await Promise.all([
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('budgets').select('*')
      ]);

      if (txRes.data) setTransactions(txRes.data as Transaction[]);
      if (budgetsRes.data) setBudgets(budgetsRes.data as Budget[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('transactions').insert([{ ...tx, user_id: user.id }]).select();
      if (error) throw error;
      if (data) setTransactions(prev => [data[0] as Transaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateBudget = async (month: string, amount: number) => {
    if (!user) return;
    try {
      // Check if budget exists for this month
      const existing = budgets.find(b => b.month === month);
      
      if (existing) {
        const { error } = await supabase.from('budgets').update({ amount }).eq('id', existing.id);
        if (error) throw error;
        setBudgets(prev => prev.map(b => b.id === existing.id ? { ...b, amount } : b));
      } else {
        const { data, error } = await supabase.from('budgets').insert([{ user_id: user.id, month, amount }]).select();
        if (error) throw error;
        if (data) setBudgets(prev => [...prev, data[0] as Budget]);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ user, session, transactions, budgets, loading, refreshData, addTransaction, updateBudget }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

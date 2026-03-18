import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import BudgetSetup from './pages/BudgetSetup';
import Auth from './pages/Auth';
import { AppProvider, useAppContext } from './context/AppContext';

const AuthenticatedApp = () => {
  const { session, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex-col justify-center items-center h-full page-enter-active" style={{ minHeight: '100vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>
          {`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}
        </style>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/budget" element={<BudgetSetup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-container">
          <AuthenticatedApp />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

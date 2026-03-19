import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, PieChart, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path;
    return `nav-item flex-col items-center gap-1 ${isActive ? 'active' : ''}`;
  };

  return (
    <>
      <style>
        {`
          .nav-item {
            color: var(--text-muted);
            text-decoration: none;
            display: flex;
            padding: 0.5rem;
            transition: all var(--transition-fast);
            position: relative;
            flex: 1;
            z-index: 1;
          }
          .nav-item:active { transform: translateY(2px); }
          .nav-item.active {
            color: var(--primary);
          }
          .nav-item.active::after {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 30%;
            height: 3px;
            background-color: var(--primary);
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            box-shadow: 0 4px 10px rgba(255, 184, 0, 0.4);
          }
          .bottom-nav {
            position: fixed;
            bottom: 0;
            width: 100%;
            max-width: var(--max-width);
            height: var(--nav-height);
            background: rgba(26, 31, 42, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--border-light);
            z-index: 1000;
            padding: 0 1rem;
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
          }
          .add-btn-container {
            flex: 1;
            display: flex;
            justify-content: center;
            position: relative;
          }
          .add-btn-wrapper {
            position: absolute;
            top: -35px; /* Elevated significantly */
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .add-btn {
            background: var(--primary);
            color: #000;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 25px rgba(255, 184, 0, 0.5);
            border: 4px solid var(--bg-main);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .add-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 12px 30px rgba(255, 184, 0, 0.6);
          }
          .add-btn:active {
            transform: translateY(0) scale(0.95);
          }
          /* Visual glow behind FAB */
          .add-glow {
            position: absolute;
            width: 70px;
            height: 70px;
            background: var(--primary);
            opacity: 0.1;
            filter: blur(20px);
            border-radius: 50%;
            z-index: -1;
            top: -40px;
          }
        `}
      </style>
      <div className="bottom-nav">
        <Link to="/" className={getNavClass('/')}>
          <Home size={22} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
          <span className="text-small" style={{ fontSize: '0.65rem', fontWeight: location.pathname === '/' ? 700 : 500 }}>Home</span>
        </Link>
        
        <div className="add-btn-container">
          <Link to="/add" style={{ textDecoration: 'none' }}>
            <div className="add-glow"></div>
            <div className="add-btn-wrapper">
              <div className="add-btn">
                <Plus size={32} strokeWidth={3} />
              </div>
            </div>
          </Link>
        </div>

        <Link to="/budget" className={getNavClass('/budget')}>
          <PieChart size={22} strokeWidth={location.pathname === '/budget' ? 2.5 : 2} />
          <span className="text-small" style={{ fontSize: '0.65rem', fontWeight: location.pathname === '/budget' ? 700 : 500 }}>Budget</span>
        </Link>

        <Link to="/profile" className={getNavClass('/profile')}>
          <User size={22} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
          <span className="text-small" style={{ fontSize: '0.65rem', fontWeight: location.pathname === '/profile' ? 700 : 500 }}>Profile</span>
        </Link>
      </div>
    </>
  );
};

export default BottomNav;

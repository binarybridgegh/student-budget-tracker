import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, PieChart } from 'lucide-react';

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
          }
          .nav-item:active { transform: scale(0.9); }
          .nav-item.active {
            color: var(--primary);
          }
          .nav-item.active::after {
            content: '';
            position: absolute;
            bottom: -0.2rem;
            width: 20px;
            height: 3px;
            background-color: var(--primary);
            border-radius: 4px;
          }
          .add-btn-wrapper {
            position: relative;
            top: -15px;
            background: var(--bg-main);
            padding: 5px;
            border-radius: 50%;
            display: flex;
          }
          .add-btn {
            background: var(--primary);
            color: #000;
            border-radius: 50%;
            padding: 0.75rem;
            box-shadow: 0 4px 15px rgba(255, 184, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
      <div className="bottom-nav">
        <Link to="/" className={getNavClass('/')}>
          <Home size={24} />
          <span className="text-small" style={{ fontSize: '0.7rem' }}>Home</span>
        </Link>
        
        <Link to="/add" style={{ textDecoration: 'none' }}>
          <div className="add-btn-wrapper">
            <div className="add-btn">
              <PlusCircle size={28} />
            </div>
          </div>
        </Link>

        <Link to="/budget" className={getNavClass('/budget')}>
          <PieChart size={24} />
          <span className="text-small" style={{ fontSize: '0.7rem' }}>Budget</span>
        </Link>
      </div>
    </>
  );
};

export default BottomNav;

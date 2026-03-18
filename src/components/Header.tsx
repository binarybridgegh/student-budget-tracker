import { Wallet } from 'lucide-react';

const Header = () => {
  return (
    <header className="top-header">
      <div className="flex-row items-center gap-2">
        <div style={{ backgroundColor: 'var(--primary)', padding: '0.5rem', borderRadius: '12px', color: '#000' }}>
          <Wallet size={24} />
        </div>
        <div>
          <h1 className="text-h3" style={{ margin: 0, lineHeight: 1 }}>Student</h1>
          <span className="text-small" style={{ color: 'var(--primary)' }}>Budget Tracker</span>
        </div>
      </div>
      
      <div className="avatar" style={{
        width: '36px', height: '36px', borderRadius: '50%', 
        backgroundColor: 'var(--bg-input)', display: 'flex', 
        alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--border-light)'
      }}>
        CU {/* Placeholder for Campus User */}
      </div>
    </header>
  );
};

export default Header;

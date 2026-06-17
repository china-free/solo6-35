import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { CustomerList } from './pages/CustomerList';
import { CustomerDetail } from './pages/CustomerDetail';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customer/:id" element={<CustomerDetail />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

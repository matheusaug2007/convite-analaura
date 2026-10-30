import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const AdminPage = lazy(() => import('./admin/AdminPage'));
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin';

if (isAdmin) {
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex,nofollow';
  document.head.appendChild(meta);
  document.title = 'Painel • Ana Laura 15 Anos';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
);

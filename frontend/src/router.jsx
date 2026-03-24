import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ProxyDashboard from './pages/ProxyDashboard.jsx';
import NFTGallery from './components/Proxy/NFTGallery.jsx';
import DeflectionHistory from './pages/DeflectionHistory.jsx';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <ProxyDashboard /> },
            { path: '/login', element: <LoginPage /> },
            { path: '/signup', element: <SignupPage /> },
            { path: '/nft-gallery', element: <NFTGallery /> },
            { path: '/history', element: <DeflectionHistory /> },
            { path: '/dashboard', element: <ProxyDashboard /> },
            { path: '/proxy-dashboard', element: <ProxyDashboard /> },
            {
                path: '*',
                element: (
                    <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
                        <div className="text-center bg-slate-900 border border-slate-800 rounded-3xl p-12 max-w-md shadow-2xl">
                            <h1 className="text-6xl font-black text-indigo-500 mb-4">404</h1>
                            <h2 className="text-2xl font-bold text-white mb-4">Relative Not Found</h2>
                            <p className="text-slate-500 mb-6">Even we couldn't deflect this one.</p>
                            <a href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl inline-block font-bold hover:bg-indigo-500 transition-colors">
                                Back to Deflection HQ
                            </a>
                        </div>
                    </div>
                ),
            },
        ],
    },
]);

export default router;

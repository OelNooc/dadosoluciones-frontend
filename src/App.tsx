import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './presentation/components/Layout/Layout';

// Pages - Auth
import LoginPage from '@presentation/pages/Auth/LoginPage';
import RegisterProfessional from '@presentation/pages/Auth/RegisterProfessional';
import RegisterClient from '@presentation/pages/Auth/RegisterClient';

// Pages - Subscription
import SelectPlan from '@presentation/pages/Subscription/SelectPlan';
import SubscriptionSuccess from '@presentation/pages/Subscription/SubscriptionSuccess';

// Pages - Professional
import ProfessionalList from '@presentation/pages/Professional/ProfessionalList';
import ProfessionalProfile from '@presentation/pages/Professional/ProfessionalProfile';
import DashboardPage from '@presentation/pages/Professional/Dashboard/DashboardPage';

// Pages - Booking
import BookingPage from '@presentation/pages/Booking/BookingPage';
import PaymentStatus from '@presentation/pages/Booking/PaymentStatus';

// Pages - Admin
import AdminPage from '@presentation/pages/Admin/AdminPage';

// Pages - Other
import HomePage from '@presentation/pages/Home/HomePage';
import AboutPage from '@presentation/pages/About/AboutPage';
import ContactPage from '@presentation/pages/Contact/ContactPage';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Home */}
                    <Route path="/" element={<HomePage />} />

                    {/* Auth */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register/professional" element={<RegisterProfessional />} />
                    <Route path="/register/client" element={<RegisterClient />} />

                    {/* Subscription */}
                    <Route path="/select-plan" element={<SelectPlan />} />
                    <Route path="/subscription/success" element={<SubscriptionSuccess />} />

                    {/* Professionals */}
                    <Route path="/profesionales" element={<ProfessionalList />} />
                    <Route path="/profesionales/:id" element={<ProfessionalProfile />} />

                    {/* Dashboard (Professional) */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/dashboard/professional" element={<DashboardPage />} />

                    {/* Booking */}
                    <Route path="/booking/:professionalId" element={<BookingPage />} />
                    <Route path="/payment-status" element={<PaymentStatus />} />

                    {/* Admin */}
                    <Route path="/admin" element={<AdminPage />} />

                    {/* Other Pages */}
                    <Route path="/sobre-nosotros" element={<AboutPage />} />
                    <Route path="/contacto" element={<ContactPage />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

// 404 Page
const NotFoundPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
            <a
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                Volver al Inicio
            </a>
        </div>
    </div>
);

export default App;
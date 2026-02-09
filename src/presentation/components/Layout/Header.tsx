import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    name: string;
    path: string;
    requiresAuth?: boolean;
    authOnly?: boolean;
}

const Header: React.FC = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Detectar scroll para cambiar el estilo del header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Verificar autenticación
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    // Items de navegación sin autenticación
    const publicNavItems: NavItem[] = [
        { name: 'Inicio', path: '/' },
        { name: 'Profesionales', path: '/profesionales' },
        { name: 'Iniciar Sesión', path: '/login', authOnly: false },
        { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
        { name: 'Contacto', path: '/contacto' },
    ];

    // Items cuando está autenticado
    const authenticatedNavItems: NavItem[] = [
        { name: 'Inicio', path: '/' },
        { name: 'Profesionales', path: '/profesionales' },
        { name: 'Mi Perfil', path: '/dashboard', requiresAuth: true },
        { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
        { name: 'Contacto', path: '/contacto' },
    ];

    const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <header
            className={`
                fixed top-0 left-0 right-0 z-50 transition-all duration-300
                ${isScrolled
                    ? 'bg-black/95 backdrop-blur-md shadow-lg'
                    : 'bg-black'
                }
            `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src="/assets/images/logo_dadosoluciones_dark.png"
                            alt="Dado Soluciones"
                            className="h-12 w-auto"
                            onError={(e) => {
                                // Fallback si no existe la imagen
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <span className="hidden text-2xl font-bold text-white">
                            DadoSoluciones
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    relative px-4 py-2 text-sm font-medium transition-colors
                                    ${isActive(item.path)
                                        ? 'text-white'
                                        : 'text-gray-300 hover:text-white'
                                    }
                                `}
                            >
                                {item.name}
                                {/* Barra inferior para página activa */}
                                {isActive(item.path) && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
                                )}
                            </Link>
                        ))}

                        {/* Botón de Cerrar Sesión */}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => {
                            // Toggle mobile menu (implementar si es necesario)
                            alert('Mobile menu - To implement');
                        }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
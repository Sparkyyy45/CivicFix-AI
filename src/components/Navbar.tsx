"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, isAdmin, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/20' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                                <Sparkles className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-600 font-heading">
                                CivicFix<span className="font-light text-slate-600">AI</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-6">
                        {user ? (
                            <>
                                <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                    Home
                                </Link>
                                {isAdmin && (
                                    <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                        Dashboard
                                    </Link>
                                )}
                                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                        {user.email?.split('@')[0]}
                                    </span>
                                    <button
                                        onClick={() => logout()}
                                        className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/login" // Assuming login handles signup toggle or redirection
                                    className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-blue-600 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden glass border-t border-white/20 animate-in slide-in-from-top-4 duration-200">
                    <div className="pt-2 pb-4 space-y-1 px-4">
                        {user ? (
                            <>
                                <Link href="/" className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                                    Home
                                </Link>
                                {isAdmin && (
                                    <Link href="/dashboard" className="block px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => logout()}
                                    className="w-full text-left px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 mt-4">
                                <Link href="/login" className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold text-slate-700 bg-white border border-slate-200 shadow-sm">
                                    Login
                                </Link>
                                <Link href="/login" className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold text-white bg-blue-600 shadow-lg shadow-blue-500/30">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }

            if (email.endsWith('@admin.com')) {
                router.push('/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center relative">

            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

            <div className="glass p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/60 relative z-10 backdrop-blur-xl overflow-hidden">
                {/* Decorative sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>

                <div className="text-center mb-8 relative">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30 transform rotate-3">
                        <Sparkles className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 text-slate-800 font-heading tracking-tight">
                        {isSignUp ? 'Join the Movement' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {isSignUp ? 'Create an account to start reporting issues.' : 'Login to manage your civic contributions.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 flex items-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-5 relative">
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-4 pl-4 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border-2 border-slate-100 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 p-4 pl-4 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-xl hover:shadow-blue-500/40 transition-all font-bold text-lg shadow-xl shadow-blue-500/20 hover:-translate-y-1 flex items-center justify-center group"
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center relative">
                    <p className="text-slate-500 font-medium">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-blue-600 hover:text-blue-700 font-black hover:underline transition-all"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

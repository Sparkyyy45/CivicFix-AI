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

            <div className="glass p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/60 relative z-10 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-800 font-heading">
                        {isSignUp ? 'Join the Movement' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isSignUp ? 'Create an account to start reporting issues.' : 'Login to manage your civic contributions.'}
                    </p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 flex items-center">{error}</div>}

                <form onSubmit={handleAuth} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-xl border-slate-200 bg-white/50 focus:bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 transition-all outline-none"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-xl border-slate-200 bg-white/50 focus:bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 transition-all outline-none"
                            minLength={6}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 flex items-center justify-center"
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="w-4 h-4 ml-2 opacity-80" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-600">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-1 text-blue-600 hover:text-blue-700 font-bold hover:underline"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>

                {!isSignUp && (
                    <div className="mt-8 pt-6 border-t border-slate-200/60 text-xs text-center text-slate-400">
                        <p>Demo Admin: demo@admin.com (Pass: password)</p>
                    </div>
                )}
            </div>
        </div>
    );
}

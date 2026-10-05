import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError(t('login_error_fields'));
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/profile');
        } catch (err: any) {
            setError(err.message || t('login_error_invalid'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoFill = () => {
        setEmail('learner@lingopath.ai');
        setPassword('Learner123!');
        setError(null);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

                {/* Left Desktop Illustration & Marketing Banner */}
                <div className="hidden md:block md:col-span-5 space-y-6">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-brand-50 rounded-full text-xs font-bold text-brand-700">
                        <Sparkles className="w-4 h-4 text-brand-600" />
                        <span>{t('login_title')}</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                        {t('login_subtitle')}
                    </h2>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        {t('login_description')}
                    </p>

                    <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl text-xs text-teal-900 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-teal-800">
                            <ShieldCheck className="w-4 h-4 text-teal-600" />
                            <span>Project Reviewer Quick Demo</span>
                        </div>
                        <p className="text-slate-600">
                            Click the Quick Demo button on the login form to automatically populate sample credentials.
                        </p>
                    </div>
                </div>

                {/* Right Form Card */}
                <div className="md:col-span-7">
                    <Card className="p-6 sm:p-8 border-slate-200/80 shadow-2xl">
                        <div className="text-center md:text-left mb-6 space-y-1">
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('login_signin_btn')}</h1>
                            <p className="text-sm text-slate-500">{t('login_subtitle')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label={t('login_email')}
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail className="w-4 h-4" />}
                                required
                            />

                            <Input
                                label={t('login_password')}
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="w-4 h-4" />}
                                required
                            />

                            <div className="flex items-center justify-between text-xs pt-1">
                                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset links will be sent to your registered email address.'); }} className="font-semibold text-brand-600 hover:underline">
                                    {t('login_forgot_password')}
                                </a>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-600">
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className="space-y-3 pt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    isLoading={isLoading}
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                >
                                    {t('login_signin_btn')}
                                </Button>

                                <Button
                                    type="button"
                                    variant="amber"
                                    size="md"
                                    className="w-full font-bold"
                                    onClick={handleDemoFill}
                                    leftIcon={<Zap className="w-4 h-4" />}
                                >
                                    Quick Demo Credentials
                                </Button>
                            </div>

                            <div className="text-center pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-600">
                                    <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4">
                                        {t('login_no_account')}
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </Card>
                </div>

            </div>
        </div>
    );
};

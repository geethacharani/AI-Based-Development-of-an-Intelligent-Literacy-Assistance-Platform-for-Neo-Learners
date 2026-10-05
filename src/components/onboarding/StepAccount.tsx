import React from 'react';
import { RegistrationStep1Data } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { User, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface StepAccountProps {
    data: RegistrationStep1Data;
    onChange: (data: Partial<RegistrationStep1Data>) => void;
    onNext: () => void;
    onLoginClick: () => void;
}

export const StepAccount: React.FC<StepAccountProps> = ({
    data,
    onChange,
    onNext,
    onLoginClick,
}) => {
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const hasMinLength = data.password.length >= 8;
    const hasNumber = /\d/.test(data.password);
    const passwordsMatch = data.password.length > 0 && data.password === data.confirm_password;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!data.full_name.trim()) newErrors.full_name = 'Please enter your full name';
        if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!hasMinLength || !hasNumber) {
            newErrors.password = 'Password does not meet requirements';
        }
        if (!passwordsMatch) {
            newErrors.confirm_password = "Passwords don't match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onNext();
    };

    return (
        <Card className="p-6 sm:p-8 bg-white border-2 border-b-6 border-slate-200/90 shadow-xl rounded-3xl space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Let's get started 👋
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-600">
                    Create your free account to save your daily learning streak & progress.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Full Name"
                    placeholder="e.g. Geetha Swaminathan"
                    value={data.full_name}
                    onChange={(e) => onChange({ full_name: e.target.value })}
                    leftIcon={<User className="w-5 h-5 text-brand-600" />}
                    error={errors.full_name}
                    required
                    className="text-base py-3.5 pl-12 pr-4 font-bold border-2 border-slate-200 focus:border-brand-500 rounded-2xl"
                />

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={data.email}
                    onChange={(e) => onChange({ email: e.target.value })}
                    leftIcon={<Mail className="w-5 h-5 text-teal-600" />}
                    error={errors.email}
                    required
                    className="text-base py-3.5 pl-12 pr-4 font-bold border-2 border-slate-200 focus:border-brand-500 rounded-2xl"
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={data.password}
                    onChange={(e) => onChange({ password: e.target.value })}
                    leftIcon={<Lock className="w-5 h-5 text-indigo-600" />}
                    error={errors.password}
                    required
                    className="text-base py-3.5 pl-12 pr-4 font-bold border-2 border-slate-200 focus:border-brand-500 rounded-2xl"
                />

                {/* Live Password Requirements */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2 text-xs sm:text-sm">
                    <p className="font-extrabold text-slate-800">Password checklist:</p>
                    <div className="flex items-center space-x-2">
                        <CheckCircle2
                            className={`w-4 h-4 transition-colors ${hasMinLength ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                                }`}
                        />
                        <span className={hasMinLength ? 'text-emerald-700 font-extrabold' : 'text-slate-500 font-semibold'}>
                            At least 8 characters
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CheckCircle2
                            className={`w-4 h-4 transition-colors ${hasNumber ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                                }`}
                        />
                        <span className={hasNumber ? 'text-emerald-700 font-extrabold' : 'text-slate-500 font-semibold'}>
                            Contains a number
                        </span>
                    </div>
                </div>

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={data.confirm_password}
                    onChange={(e) => onChange({ confirm_password: e.target.value })}
                    leftIcon={<Lock className="w-5 h-5 text-indigo-600" />}
                    error={errors.confirm_password}
                    required
                    className="text-base py-3.5 pl-12 pr-4 font-bold border-2 border-slate-200 focus:border-brand-500 rounded-2xl"
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full text-base py-4 font-black shadow-lg border-2 border-b-4 border-brand-800 active:border-b-0 active:translate-y-1"
                        rightIcon={<ArrowRight className="w-6 h-6" />}
                    >
                        Continue
                    </Button>
                </div>

                <div className="text-center pt-4 border-t-2 border-slate-100">
                    <p className="text-sm sm:text-base text-slate-600 font-semibold">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="font-black text-brand-600 hover:text-brand-700 underline underline-offset-4"
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </form>
        </Card>
    );
};

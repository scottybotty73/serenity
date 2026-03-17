import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import Link from 'next/link';

export const LoginScreen = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
            <i className="fas fa-brain text-slate-900 text-3xl"></i>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-100">Welcome to Serenity AI</CardTitle>
          <CardDescription className="text-slate-400">
            The autonomous AI psychotherapist platform. <br/>
            Please sign in to access your clinical dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/auth/sign-in">
            <Button className="w-full h-12 text-base bg-white text-slate-900 hover:bg-slate-100 transition-all font-semibold">
              Sign in
            </Button>
          </Link>
            
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-600">
              Restricted Access. HIPAA Compliant System.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
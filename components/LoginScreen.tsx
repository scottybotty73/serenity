import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

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
            <form
              action={async () => {
                // In a server component we would use "use server", but we'll call the API from the client for now or redirect
                // Since this component is used in a Client Component (App), we can simply link to the signin endpoint or use the button
                // However, standard NextAuth v5 client way:
                window.location.href = "/api/auth/signin";
              }}
            >
              <Button className="w-full h-12 text-base bg-white text-slate-900 hover:bg-slate-100 transition-all font-semibold flex items-center gap-3">
                <img src="https://authjs.dev/img/providers/google.svg" className="w-5 h-5" alt="Google" />
                Sign in with Google
              </Button>
            </form>
            
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
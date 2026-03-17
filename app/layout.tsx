import React from 'react';
import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { ClientUserButton } from '@/components/ClientUserButton';
import './globals.css';

export const metadata = {
  title: 'Serenity AI',
  description: 'AI Psychotherapist Agent',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      slate: {
                        850: '#1e293b',
                        900: '#0f172a',
                        950: '#020617',
                      },
                      emerald: {
                        450: '#10b981',
                      }
                    },
                    fontFamily: {
                      sans: ['Inter', 'sans-serif'],
                    }
                  }
                }
              }
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{
            __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
            `
        }} />
      </head>
      <body>
        <NeonAuthUIProvider authClient={authClient} redirectTo="/account/settings" emailOTP>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <ClientUserButton />
          </header>
          <div id="root">{children}</div>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
import React from 'react';
import RegisterForm from '../components/RegisterForm';
import Link from 'next/link';
import { Logo } from '../components/ui/Logo';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-light-gray/30 to-white">
      <header className="w-full py-4 px-6">
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <RegisterForm />
          
          <div className="mt-8 text-center text-medium-gray text-sm">
            <p>
              Centro de Investigación de Metaverso de la Universidad Metropolitana
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 
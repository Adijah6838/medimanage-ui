import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Link from 'next/link';
import { Users, Building2 } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MediManage',
  description: 'Hospital Staff Management Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex h-screen overflow-hidden`}>
        <Providers>
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-blue-600">MediManage</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors">
                <Users size={20} />
                <span className="font-medium">Staff Directory</span>
              </Link>
              <Link href="/departments" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors">
                <Building2 size={20} />
                <span className="font-medium">Departments</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
              <h1 className="text-xl font-bold text-blue-600">MediManage</h1>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
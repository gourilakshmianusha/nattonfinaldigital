import { ArrowLeft, Home } from 'lucide-react';
import { RoutePath } from '../types';

interface NotFoundProps {
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

export default function NotFound({ setPath, darkMode }: NotFoundProps) {
  return (
    <section className={`min-h-[calc(100vh-6.5rem)] flex items-center justify-center px-6 py-20 ${darkMode ? 'bg-[#110B33] text-white' : 'bg-[#F5F9FA] text-[#110B33]'}`}>
      <div className="max-w-xl text-center">
        <p className="text-sm font-mono font-bold tracking-[0.3em] text-primary">ERROR 404</p>
        <h1 className="mt-5 text-5xl sm:text-7xl font-black font-display tracking-tight">Page not found</h1>
        <p className={`mt-5 text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
          The address you entered does not match an active Natton Digital page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.history.length > 1 ? window.history.back() : setPath('home')}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors ${darkMode ? 'border-white/10 text-gray-200 hover:border-primary hover:text-white' : 'border-slate-300 text-slate-700 hover:border-primary hover:text-primary'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
          <button
            type="button"
            onClick={() => setPath('home')}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Go home
          </button>
        </div>
      </div>
    </section>
  );
}
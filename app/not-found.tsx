import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">404 - Page Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The page or tool you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all"
        >
          Return to ToolImg Home
        </Link>
      </div>
    </div>
  );
}

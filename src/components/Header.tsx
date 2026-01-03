import { Languages } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Languages className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learn Tamil</h1>
          <p className="text-sm text-gray-600">English to Tamil Language Learning</p>
        </div>
      </div>
    </header>
  );
}

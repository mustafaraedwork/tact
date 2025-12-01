import Link from "next/link";
import { Home } from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold text-dark">الصفحة غير موجودة</h2>
        <p className="text-gray-600">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 btn-primary"
        >
          <Home size={20} />
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
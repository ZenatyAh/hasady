import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#19361f] text-white/80 py-16 px-6 sm:px-10">
      <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="text-2xl font-bold text-white mb-6">محاصيل</h4>
          <p className="text-sm leading-relaxed text-white/70">
            منصة محاصيل الإلكترونية لبيع وشراء المنتجات الزراعية والمحاصيل الطازجة عبر مزادات أو
            أسعار ثابتة.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-6">روابط سريعة</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/welcome" className="hover:text-white transition-colors">
                عن المنصة
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                تسجيل الدخول
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white transition-colors">
                حساب جديد
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-6">الدعم والمساعدة</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                الشروط والأحكام
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                سياسة الخصوصية
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                الأسئلة الشائعة
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-6">تواصل معنا</h4>
          <div className="space-y-3 text-sm text-white/70">
            <p>info@mahaseel.com</p>
            <p dir="ltr" className="text-right">
              +966 50 000 0000
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/50">
        <p>&copy; {new Date().getFullYear()} منصة محاصيل. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}

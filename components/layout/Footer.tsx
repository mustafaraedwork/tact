import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                T
                            </div>
                            <span className="text-2xl font-bold text-white font-heading">
                                TACT
                            </span>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            نقدم أرقى تصاميم المطابخ العصرية بجودة عالية ولمسات فنية تناسب ذوقك الرفيع.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/share/1DQJDcEo7G/?mibextid=wwXIfr"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://www.instagram.com/tact.kitchen1?igsh=ZTN1d2QyenhxMHh6"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-heading">روابط سريعة</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    الرئيسية
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/cost-calculator"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    حاسبة التكلفة
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/gallery"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    معرض الأعمال
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-400 hover:text-primary transition-colors"
                                >
                                    تواصل معنا
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-heading">معلومات التواصل</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                                <span>بغداد - العامرية</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="text-primary shrink-0" size={20} />
                                <span className="ltr-content">0771 333 5020</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="text-primary shrink-0" size={20} />
                                <span className="ltr-content">info@tactkitchen.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 font-heading">أوقات العمل</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex justify-between">
                                <span>مفتوح دائماً</span>
                                <span>9:00 ص - 9:00 م</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} TACT Kitchens. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
}

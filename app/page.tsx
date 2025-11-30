"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, CheckCircle2, Star, Users, Clock, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function Home() {
  const [featuredKitchens, setFeaturedKitchens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("kitchens")
        .select("*, kitchen_images(image_url)")
        .eq("is_featured", true)
        .limit(3);

      if (data) setFeaturedKitchens(data);
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center bg-dark overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2768&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading leading-tight">
                مطابخ TACT
                <br />
                <span className="text-primary">جودة عالية بتصاميم عصرية</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                نحول مطبخ أحلامك إلى واقع ملموس بأحدث التصاميم وأجود الخامات.
                خبرة تمتد لسنوات في صناعة المطابخ الفاخرة.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/cost-calculator"
                  className="btn-primary w-full sm:w-auto text-lg px-8 py-4"
                >
                  احسب تكلفة مطبخك الآن
                </Link>
                <Link
                  href="/gallery"
                  className="btn-secondary w-full sm:w-auto text-lg px-8 py-4 !text-white !border-white hover:!bg-white hover:!text-dark"
                >
                  شاهد أعمالنا
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why TACT Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-heading">
                لماذا تختار TACT؟
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                نتميز بالدقة في التنفيذ والسرعة في الإنجاز مع ضمان الجودة العالية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Star className="w-12 h-12 text-primary" />,
                  title: "جودة عالية",
                  description: "نستخدم أفضل أنواع الأخشاب والإكسسوارات لضمان المتانة والفخامة."
                },
                {
                  icon: <Clock className="w-12 h-12 text-primary" />,
                  title: "سرعة التنفيذ",
                  description: "نلتزم بالمواعيد المحددة للتسليم دون المساومة على الجودة."
                },
                {
                  icon: <Award className="w-12 h-12 text-primary" />,
                  title: "تصاميم عصرية",
                  description: "نواكب أحدث صيحات التصميم العالمية لتناسب ذوقك الرفيع."
                }
              ].map((item, index) => (
                <div key={index} className="card text-center p-8 hover:bg-bg-secondary border border-transparent hover:border-primary/10">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 font-heading">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Works Preview */}
        <section className="py-20 bg-bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-heading">
                  أحدث أعمالنا
                </h2>
                <p className="text-gray-600">
                  تشكيلة مختارة من المطابخ التي قمنا بتنفيذها
                </p>
              </div>
              <Link href="/gallery" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                شاهد المزيد <ArrowLeft size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {loading ? (
                // Loading Skeletons
                [1, 2, 3].map((item) => (
                  <div key={item} className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-200 animate-pulse" />
                ))
              ) : featuredKitchens.length > 0 ? (
                featuredKitchens.map((kitchen) => (
                  <Link href={`/gallery`} key={kitchen.id} className="group relative overflow-hidden rounded-xl aspect-[4/3] block">
                    <img
                      src={kitchen.kitchen_images?.[0]?.image_url || 'https://via.placeholder.com/400'}
                      alt={kitchen.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold mb-2">{kitchen.title}</h3>
                        <p className="text-sm text-gray-200 line-clamp-2">{kitchen.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  لا توجد أعمال مميزة حالياً
                </div>
              )}
            </div>

            <div className="text-center md:hidden">
              <Link href="/gallery" className="btn-secondary inline-flex items-center gap-2">
                شاهد المزيد <ArrowLeft size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 bg-dark text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "+500", label: "مطبخ منجز" },
                { number: "+10", label: "سنوات خبرة" },
                { number: "+15", label: "محافظة نغطيها" },
                { number: "100%", label: "رضا العملاء" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-heading">
                    {stat.number}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Simple motion wrapper to avoid client-side issues in server component
function MotionDiv({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

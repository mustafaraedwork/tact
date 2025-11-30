"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Kitchen {
    id: string;
    title: string;
    description: string;
    material: string;
    kitchen_type: string;
    kitchen_images: { id: string; image_url: string }[];
    kitchen_videos: { id: string; youtube_url: string; caption: string }[];
}

type Slide =
    | { type: 'image'; url: string; id: string }
    | { type: 'video'; url: string; id: string; caption?: string };

export default function KitchenDetailsPage() {
    const { id } = useParams();
    const [kitchen, setKitchen] = useState<Kitchen | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isPlaying, setIsPlaying] = useState(false); // For carousel video

    useEffect(() => {
        const fetchKitchen = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from("kitchens")
                    .select(`
            *,
            kitchen_images (id, image_url),
            kitchen_videos (id, youtube_url, caption)
          `)
                    .eq("id", id)
                    .single();

                if (error) throw error;
                setKitchen(data);

                // Prepare slides: Images first, then Videos
                const imageSlides: Slide[] = (data.kitchen_images || []).map((img: any) => ({
                    type: 'image',
                    url: img.image_url,
                    id: img.id
                }));
                const videoSlides: Slide[] = (data.kitchen_videos || []).map((vid: any) => ({
                    type: 'video',
                    url: vid.youtube_url,
                    id: vid.id,
                    caption: vid.caption
                }));
                setSlides([...imageSlides, ...videoSlides]);

            } catch (error) {
                console.error("Error fetching kitchen details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchKitchen();
    }, [id]);

    const nextSlide = () => {
        setIsPlaying(false); // Reset video state
        setCurrentSlideIndex((prev) =>
            prev === slides.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setIsPlaying(false); // Reset video state
        setCurrentSlideIndex((prev) =>
            prev === 0 ? slides.length - 1 : prev - 1
        );
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Custom Video Player Component
    const VideoThumbnailPlayer = ({ url, autoPlay = false }: { url: string, autoPlay?: boolean }) => {
        const [play, setPlay] = useState(autoPlay);
        const videoId = getYouTubeId(url);

        if (!videoId) return null;

        if (play) {
            return (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video player"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
        }

        return (
            <div
                className="relative w-full h-full cursor-pointer group"
                onClick={() => setPlay(true)}
            >
                <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play size={32} fill="currentColor" />
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!kitchen) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-2xl font-bold mb-4">المطبخ غير موجود</h1>
                    <Link href="/gallery" className="btn-primary">
                        العودة للمعرض
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const currentSlide = slides[currentSlideIndex];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-bg-secondary pb-20">
                {/* Carousel */}
                <div className="relative h-[60vh] bg-black group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlideIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full"
                        >
                            {currentSlide?.type === 'image' ? (
                                <img
                                    src={currentSlide.url}
                                    alt={kitchen.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : currentSlide?.type === 'video' ? (
                                // For carousel, we control play state centrally to reset on slide change
                                isPlaying ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeId(currentSlide.url)}?autoplay=1`}
                                        className="w-full h-full"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div
                                        className="relative w-full h-full cursor-pointer"
                                        onClick={() => setIsPlaying(true)}
                                    >
                                        <img
                                            src={`https://img.youtube.com/vi/${getYouTubeId(currentSlide.url)}/maxresdefault.jpg`}
                                            alt="Video Thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                                <Play size={40} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : null}
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Navigation Buttons */}
                    <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 pointer-events-none">
                        <button
                            onClick={nextSlide}
                            className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            <ArrowRight size={24} />
                        </button>
                        <button
                            onClick={prevSlide}
                            className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-8 left-8 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentSlideIndex + 1} / {slides.length}
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Title & Info Card */}
                            <div className="card bg-white p-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-heading">
                                    {kitchen.title}
                                </h1>
                                <div className="flex flex-wrap gap-4 mb-6">
                                    {kitchen.material && (
                                        <span className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
                                            المادة: {kitchen.material}
                                        </span>
                                    )}
                                    {kitchen.kitchen_type && (
                                        <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium">
                                            التصميم: {kitchen.kitchen_type}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {kitchen.description || "لا يوجد وصف متاح لهذا المطبخ."}
                                </p>
                            </div>

                            {/* Videos Section (Bottom) */}
                            {kitchen.kitchen_videos && kitchen.kitchen_videos.length > 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-dark font-heading flex items-center gap-2">
                                        <Play className="text-primary fill-primary" size={24} />
                                        فيديو توضيحي
                                    </h2>
                                    <div className="grid grid-cols-1 gap-6">
                                        {kitchen.kitchen_videos.map((video) => (
                                            <div key={video.id} className="card bg-white p-4 overflow-hidden">
                                                <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4">
                                                    <VideoThumbnailPlayer url={video.youtube_url} />
                                                </div>
                                                {video.caption && (
                                                    <p className="text-gray-600 font-medium">{video.caption}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="card bg-white p-6 border-2 border-primary/10">
                                    <h3 className="text-xl font-bold mb-4 font-heading">هل أعجبك هذا التصميم؟</h3>
                                    <p className="text-gray-600 mb-6">
                                        يمكننا تنفيذ مطبخ مشابه لك بمواصفات تناسب مساحتك واحتياجاتك.
                                    </p>

                                    <a
                                        href={`https://wa.me/9647700000000?text=${encodeURIComponent(
                                            `مرحباً TACT، أعجبني تصميم "${kitchen.title}" وأرغب في الاستفسار عنه.`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary w-full flex items-center justify-center gap-2 mb-4 !bg-[#25D366] hover:!bg-[#128C7E]"
                                    >
                                        <MessageCircle size={20} />
                                        تواصل عبر واتساب
                                    </a>

                                    <Link
                                        href="/cost-calculator"
                                        className="btn-secondary w-full flex items-center justify-center gap-2"
                                    >
                                        احسب تكلفة مطبخك
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky WhatsApp Button (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:hidden z-40">
                <a
                    href={`https://wa.me/9647700000000?text=${encodeURIComponent(
                        `مرحباً TACT، أعجبني تصميم "${kitchen?.title}" وأرغب في الاستفسار عنه.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-2 !bg-[#25D366]"
                >
                    <MessageCircle size={20} />
                    تواصل عبر واتساب
                </a>
            </div>

            <Footer />
        </div>
    );
}

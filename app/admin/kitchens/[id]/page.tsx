"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Save, ArrowRight, Upload, X, Trash2, Video, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminKitchenFormPage() {
    const router = useRouter();
    const { id } = useParams(); // If editing
    const isEditing = id && id !== "new";

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        material: "hdf",
        kitchen_type: "straight",
        is_featured: false,
        display_order: 0,
    });

    // Images state
    const [images, setImages] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    // Videos state
    const [videos, setVideos] = useState<any[]>([]);
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [addingVideo, setAddingVideo] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchKitchenDetails();
        }
    }, [id]);

    const fetchKitchenDetails = async () => {
        const { data, error } = await supabase
            .from("kitchens")
            .select(`
        *,
        kitchen_images (*),
        kitchen_videos (*)
      `)
            .eq("id", id)
            .single();

        if (error) {
            toast.error("فشل تحميل البيانات");
            router.push("/admin/kitchens");
        } else {
            setFormData({
                title: data.title,
                description: data.description || "",
                material: data.material || "hdf",
                kitchen_type: data.kitchen_type || "straight",
                is_featured: data.is_featured,
                display_order: data.display_order || 0,
            });
            setImages(data.kitchen_images || []);
            setVideos(data.kitchen_videos || []);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let kitchenId = id;

            if (isEditing) {
                const { error } = await supabase
                    .from("kitchens")
                    .update(formData)
                    .eq("id", id);
                if (error) throw error;
                toast.success("تم تحديث البيانات بنجاح");
            } else {
                const { data, error } = await supabase
                    .from("kitchens")
                    .insert(formData)
                    .select()
                    .single();
                if (error) throw error;
                kitchenId = data.id;
                toast.success("تم إنشاء المطبخ بنجاح");
                router.push(`/admin/kitchens/${kitchenId}`); // Redirect to edit to add images
                return;
            }
        } catch (error: any) {
            toast.error("حدث خطأ: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        if (!isEditing) {
            toast.error("يرجى حفظ المطبخ أولاً قبل رفع الصور");
            return;
        }

        setUploading(true);
        const files = Array.from(e.target.files);

        for (const file of files) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `kitchens/${id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("kitchens") // Ensure this bucket exists
                .upload(filePath, file);

            if (uploadError) {
                toast.error(`فشل رفع الصورة ${file.name}`);
                continue;
            }

            const { data: publicUrlData } = supabase.storage
                .from("kitchens")
                .getPublicUrl(filePath);

            await supabase.from("kitchen_images").insert({
                kitchen_id: id,
                image_url: publicUrlData.publicUrl,
                display_order: images.length + 1,
            });
        }

        // Refresh images
        const { data } = await supabase
            .from("kitchen_images")
            .select("*")
            .eq("kitchen_id", id)
            .order("display_order");

        setImages(data || []);
        setUploading(false);
        toast.success("تم رفع الصور بنجاح");
    };

    const handleDeleteImage = async (imageId: string, imageUrl: string) => {
        if (!confirm("حذف الصورة؟")) return;

        // Delete from DB
        await supabase.from("kitchen_images").delete().eq("id", imageId);

        // Ideally delete from storage too, but skipping for simplicity now

        setImages(images.filter(img => img.id !== imageId));
        toast.success("تم حذف الصورة");
    };

    const handleAddVideo = async () => {
        if (!newVideoUrl) return;
        setAddingVideo(true);

        // Basic YouTube URL validation
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = newVideoUrl.match(regExp);

        if (!match || match[2].length !== 11) {
            toast.error("رابط يوتيوب غير صحيح");
            setAddingVideo(false);
            return;
        }

        const { data, error } = await supabase.from("kitchen_videos").insert({
            kitchen_id: id,
            youtube_url: newVideoUrl,
            caption: "" // Optional caption
        }).select().single();

        if (error) {
            toast.error("فشل إضافة الفيديو");
        } else {
            setVideos([...videos, data]);
            setNewVideoUrl("");
            toast.success("تم إضافة الفيديو");
        }
        setAddingVideo(false);
    };

    const handleDeleteVideo = async (videoId: string) => {
        if (!confirm("حذف الفيديو؟")) return;

        const { error } = await supabase.from("kitchen_videos").delete().eq("id", videoId);

        if (error) {
            toast.error("فشل حذف الفيديو");
        } else {
            setVideos(videos.filter(v => v.id !== videoId));
            toast.success("تم حذف الفيديو");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/kitchens" className="text-gray-500 hover:text-primary">
                    <ArrowRight size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-dark font-heading">
                    {isEditing ? "تعديل المطبخ" : "إضافة مطبخ جديد"}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card bg-white p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    عنوان المطبخ
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        المادة
                                    </label>
                                    <select
                                        name="material"
                                        value={formData.material}
                                        onChange={handleInputChange}
                                        className="input"
                                    >
                                        <option value="hdf">HDF</option>
                                        <option value="plywood">Plywood</option>
                                        <option value="acrylic">Acrylic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        التصميم
                                    </label>
                                    <select
                                        name="kitchen_type"
                                        value={formData.kitchen_type}
                                        onChange={handleInputChange}
                                        className="input"
                                    >
                                        <option value="straight">مستقيم (Straight)</option>
                                        <option value="L">حرف L</option>
                                        <option value="U">حرف U</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    الوصف
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="input resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleCheckboxChange}
                                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                                    />
                                    <span className="text-gray-700">مطبخ مميز (يظهر في الرئيسية)</span>
                                </label>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    <span>{loading ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Media Section (Images & Videos) */}
                {isEditing && (
                    <div className="lg:col-span-1 space-y-6">
                        {/* Images */}
                        <div className="card bg-white p-6">
                            <h3 className="font-bold text-lg mb-4 font-heading flex items-center gap-2">
                                <Upload size={20} />
                                صور المطبخ
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {images.map((img) => (
                                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => handleDeleteImage(img.id, img.image_url)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <label className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer">
                                <Upload size={20} />
                                <span>{uploading ? "جاري الرفع..." : "رفع صور جديدة"}</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        {/* Videos */}
                        <div className="card bg-white p-6">
                            <h3 className="font-bold text-lg mb-4 font-heading flex items-center gap-2">
                                <Video size={20} />
                                فيديوهات يوتيوب
                            </h3>

                            <div className="space-y-4 mb-6">
                                {videos.map((video) => (
                                    <div key={video.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Video size={20} />
                                            </div>
                                            <a
                                                href={video.youtube_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline truncate"
                                            >
                                                رابط الفيديو
                                            </a>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteVideo(video.id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="رابط يوتيوب..."
                                    value={newVideoUrl}
                                    onChange={(e) => setNewVideoUrl(e.target.value)}
                                    className="input text-sm"
                                />
                                <button
                                    onClick={handleAddVideo}
                                    disabled={addingVideo || !newVideoUrl}
                                    className="btn-primary px-3"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

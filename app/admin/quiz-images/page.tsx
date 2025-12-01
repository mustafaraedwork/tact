"use client";

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Trash2, Check, X, Filter } from "lucide-react";
import toast from "react-hot-toast";
import ImageCropper from "@/components/admin/ImageCropper";

interface QuizImage {
    id: string;
    image_url: string;
    title: string;
    category: string;
    is_active: boolean;
    display_order: number;
}

export default function AdminQuizImagesPage() {
    const [images, setImages] = useState<QuizImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("design"); // design, material, shape
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [pendingShape, setPendingShape] = useState<string | null>(null);

    const fetchImages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("quiz_selection_images")
            .select("*")
            .eq("category", selectedCategory)
            .order("display_order");

        if (error) {
            toast.error("فشل تحميل الصور");
        } else {
            setImages(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, [selectedCategory]);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, shapeTitle?: string) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setCropImage(reader.result as string);
            setPendingShape(shapeTitle || null);
        });
        reader.readAsDataURL(file);
        // Reset input value to allow selecting same file again
        e.target.value = "";
    };

    const handleCropSave = async (blob: Blob) => {
        setUploading(true);
        const fileName = `${Date.now()}.jpg`; // Always save as jpg from cropper
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
            .from("quiz-images")
            .upload(filePath, blob, {
                contentType: 'image/jpeg'
            });

        if (uploadError) {
            console.error("Upload Error Details:", uploadError);
            toast.error(`فشل رفع الصورة: ${uploadError.message}`);
            setUploading(false);
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from("quiz-images")
            .getPublicUrl(filePath);

        // If uploading a shape
        if (selectedCategory === 'shape' && pendingShape) {
            const existingShape = images.find(img => img.title === pendingShape);

            if (existingShape) {
                // Update existing
                const { error: updateError } = await supabase
                    .from("quiz_selection_images")
                    .update({ image_url: publicUrlData.publicUrl })
                    .eq("id", existingShape.id);

                if (updateError) toast.error("فشل تحديث الصورة");
                else toast.success("تم تحديث الصورة بنجاح");
            } else {
                // Insert new
                const { error: insertError } = await supabase.from("quiz_selection_images").insert({
                    image_url: publicUrlData.publicUrl,
                    display_order: 1,
                    is_active: true,
                    category: 'shape',
                    title: pendingShape
                });
                if (insertError) toast.error("فشل حفظ الصورة");
                else toast.success("تم حفظ الصورة بنجاح");
            }
        } else {
            // Normal upload for design/material
            const { error: dbError } = await supabase.from("quiz_selection_images").insert({
                image_url: publicUrlData.publicUrl,
                display_order: images.length + 1,
                is_active: true,
                category: selectedCategory,
                title: selectedCategory === 'material' ? 'New Material' : 'New Design'
            });

            if (dbError) {
                toast.error("فشل حفظ بيانات الصورة");
            } else {
                toast.success("تم إضافة الصورة بنجاح");
            }
        }

        fetchImages();
        setUploading(false);
        setCropImage(null);
        setPendingShape(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("حذف هذه الصورة؟")) return;
        const { error } = await supabase.from("quiz_selection_images").delete().eq("id", id);
        if (error) toast.error("فشل الحذف");
        else {
            toast.success("تم الحذف");
            fetchImages();
        }
    };

    const toggleActive = async (id: string, currentState: boolean) => {
        const { error } = await supabase
            .from("quiz_selection_images")
            .update({ is_active: !currentState })
            .eq("id", id);

        if (error) toast.error("فشل التحديث");
        else fetchImages();
    };

    const updateTitle = async (id: string, newTitle: string) => {
        const { error } = await supabase
            .from("quiz_selection_images")
            .update({ title: newTitle })
            .eq("id", id);

        if (error) toast.error("فشل تحديث العنوان");
        else {
            toast.success("تم تحديث العنوان");
            fetchImages();
        }
    };

    const renderShapeUploader = (shapeId: string, shapeLabel: string) => {
        const shapeImage = images.find(img => img.title === shapeId);

        return (
            <div className="card bg-white p-6 flex flex-col items-center gap-4">
                <h3 className="font-bold text-lg font-heading">{shapeLabel}</h3>
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center border-2 border-dashed border-gray-300">
                    {shapeImage ? (
                        <img src={shapeImage.image_url} alt={shapeLabel} className="w-full h-full object-contain p-4" />
                    ) : (
                        <span className="text-gray-400">لا توجد صورة</span>
                    )}
                </div>
                <label className="btn-primary w-full flex items-center justify-center gap-2 cursor-pointer">
                    <Upload size={18} />
                    <span>{shapeImage ? "تغيير الصورة" : "رفع صورة"}</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onFileSelect(e, shapeId)}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {cropImage && (
                <ImageCropper
                    imageSrc={cropImage}
                    onCancel={() => {
                        setCropImage(null);
                        setPendingShape(null);
                    }}
                    onSave={handleCropSave}
                    aspect={1} // Square aspect ratio for all images
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark font-heading">صور الكويز</h1>
                    <p className="text-gray-500 text-sm">إدارة صور التصاميم والمواد والأشكال</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                        <button
                            onClick={() => setSelectedCategory("design")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${selectedCategory === "design" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            التصاميم
                        </button>
                        <button
                            onClick={() => setSelectedCategory("material")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${selectedCategory === "material" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            المواد
                        </button>
                        <button
                            onClick={() => setSelectedCategory("shape")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${selectedCategory === "shape" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            أشكال المطبخ
                        </button>
                    </div>

                    {selectedCategory !== 'shape' && (
                        <label className="btn-primary flex items-center gap-2 cursor-pointer">
                            <Upload size={20} />
                            <span>{uploading ? "جاري الرفع..." : "إضافة صورة"}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => onFileSelect(e)}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                    )}
                </div>
            </div>

            {selectedCategory === 'shape' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderShapeUploader('straight', 'مطبخ مستقيم (Straight)')}
                    {renderShapeUploader('L', 'مطبخ حرف L')}
                    {renderShapeUploader('U', 'مطبخ حرف U')}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-gray-500 col-span-3 text-center py-8">جاري التحميل...</p>
                    ) : images.length === 0 ? (
                        <div className="col-span-3 text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">لا توجد صور في هذا القسم</p>
                        </div>
                    ) : (
                        images.map((img) => (
                            <div key={img.id} className="card bg-white p-4 group">
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4 relative">
                                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => handleDelete(img.id)}
                                            className="p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {selectedCategory === 'material' && (
                                        <input
                                            type="text"
                                            defaultValue={img.title}
                                            onBlur={(e) => {
                                                if (e.target.value !== img.title) {
                                                    updateTitle(img.id, e.target.value);
                                                }
                                            }}
                                            className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                                            placeholder="اسم المادة (مثلاً: HDF)"
                                        />
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-700 text-sm">#{img.display_order}</span>
                                        <button
                                            onClick={() => toggleActive(img.id, img.is_active)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${img.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            {img.is_active ? (
                                                <>
                                                    <Check size={12} /> نشط
                                                </>
                                            ) : (
                                                <>
                                                    <X size={12} /> غير نشط
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

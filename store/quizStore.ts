import { create } from "zustand";

export type KitchenType = "straight" | "L" | "U" | null;
export type Material = "hdf" | "plywood" | "acrylic" | null;

interface QuizState {
    currentStep: number;
    kitchenType: KitchenType;
    dimensions: {
        wall1?: number;
        wall2?: number;
        wall3?: number;
    };
    selectedDesigns: string[]; // array of image IDs
    material: Material;
    phone: string;
    governorate: string;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setKitchenType: (type: KitchenType) => void;
    setDimensions: (dimensions: QuizState["dimensions"]) => void;
    toggleDesign: (id: string) => void;
    setMaterial: (material: Material) => void;
    setPhone: (phone: string) => void;
    setGovernorate: (governorate: string) => void;
    reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
    currentStep: 1,
    kitchenType: null,
    dimensions: {},
    selectedDesigns: [],
    material: null,
    phone: "",
    governorate: "بغداد",

    setStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 6)
    })),

    prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
    })),

    setKitchenType: (type) => set({ kitchenType: type }),

    setDimensions: (dimensions) => set({ dimensions }),

    toggleDesign: (id) => set((state) => {
        const isSelected = state.selectedDesigns.includes(id);
        if (isSelected) {
            return { selectedDesigns: state.selectedDesigns.filter((d) => d !== id) };
        }
        if (state.selectedDesigns.length >= 3) {
            return state; // Max 3 designs
        }
        return { selectedDesigns: [...state.selectedDesigns, id] };
    }),

    setMaterial: (material) => set({ material }),

    setPhone: (phone) => set({ phone }),

    setGovernorate: (governorate) => set({ governorate }),

    reset: () => set({
        currentStep: 1,
        kitchenType: null,
        dimensions: {},
        selectedDesigns: [],
        material: null,
        phone: "",
        governorate: "بغداد",
    }),
}));

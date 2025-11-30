"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                style: {
                    fontFamily: "var(--font-ibm)",
                    borderRadius: "8px",
                    background: "#333",
                    color: "#fff",
                },
                success: {
                    style: {
                        background: "var(--success)",
                    },
                },
                error: {
                    style: {
                        background: "var(--danger)",
                    },
                },
            }}
        />
    );
}

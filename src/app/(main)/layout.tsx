import MainAside from "@/components/home/aside";
import MainSidebar from "@/components/home/sidebar";
import React from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container relative flex gap-4 p-4 mx-auto">
            <div className="w-1/4 relative">
                <MainSidebar />
            </div>
            <div className="w-2/4">
                {children}
            </div>
            <div className="w-1/4 relative">
                <MainAside />
            </div>
        </div>
    )
}
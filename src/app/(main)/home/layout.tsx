import MainAside from "@/components/home/aside";
import MainSidebar from "@/components/home/sidebar";
import React from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container flex p-4 mx-auto">
            <MainSidebar />
            <div className="w-1/2">
                {children}
            </div>
            <MainAside />
        </div>
    )
}
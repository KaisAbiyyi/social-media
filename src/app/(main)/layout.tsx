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
            <div className="lg:w-1/4 w-fit relative">
                <MainSidebar />
            </div>
            <div className="flex-grow">
                {children}
            </div>
            <div className="w-1/4 relative hidden lg:block">
                <MainAside />
            </div>
        </div>
    )
}
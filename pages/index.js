"use client";
import { IosPickerItem } from "@/ui/embla";
import Head from "next/head";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ShareComponent = dynamic(() => import("@/ui/share"), { ssr: false });



export default function Home() {
    // State
    const [value, setValue] = useState("silence is art maybe");
    const [font, setFont] = useState("Montserrat");

    // Fonts
    const fonts = [
        { name: "Raleway", value: "--font-raleway" },
        { name: "Cabin", value: "--font-cabin" },
        { name: "Dancing Script", value: "--font-dancing-script" },
        { name: "Anton", value: "--font-anton" },
        { name: "Caveat", value: "--font-caveat" },
        { name: "Shadows Into Light", value: "--font-shadows-into-light" },
        { name: "Satisfy", value: "--font-satisfy" },
        { name: "Doto", value: "--font-doto" },
        { name: "Permanent Marker", value: "--font-permanent-marker" },
        { name: "Indie Flower", value: "--font-indie-flower" },
        { name: "Amatic SC", value: "--font-amatic-sc" },
        { name: "Bangers", value: "--font-bangers" },
        { name: "Silkscreen", value: "--font-silkscreen" },
        { name: "Gloria Hallelujah", value: "--font-gloria-hallelujah" },
        { name: "Sacramento", value: "--font-sacramento" },
        { name: "Zeyada", value: "--font-zeyada" }
    ];

    // Markup
    return (
        <div className="h-screen bg-[#161618] relative flex flex-col">
            {/* Meta */}
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
            </Head>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-transparent flex items-center justify-center h-16 p-4 text-white">
                {/* Logo */}
                <img src="/logo.svg" className="w-auto h-6" alt="Logo" />
            </div>

            {/* Fonts */}
            <div className="flex-1 h-screen flex items-center justify-center overflow-hidden relative z-0">
                <div className="embla w-full h-full flex items-center justify-center">
                    <IosPickerItem
                        setValue={setValue}
                        setFont={setFont}
                        value={value}
                        slideCount={fonts.length}
                        perspective="left"
                        loop={false}
                        slides={fonts}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center h-16 py-12 px-10 text-white">
                <ShareComponent value={value} font={font} />
            </div>
        </div>
    );
}

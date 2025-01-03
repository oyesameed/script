import { FontPicker } from "@/ui/embla";
import { detectIOS, FONTS, handleShare } from "@/ui/utils";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function Home() {

    // States
    const [value, setValue] = useState("silence is art maybe");
    const [font, setFont] = useState("Montserrat");
    const [copied, setCopied] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    // Function to detect iOS devices
    useEffect(() => {

        // Detect if the device is iOS
        setIsIOS(detectIOS());

    }, []);
   
      
    // Markup
    return <div className="h-screen bg-white relative flex flex-col">

        {/* Meta */}
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        </Head>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-transparent flex items-center justify-start h-16 px-8 py-10 text-black">
            {/* Logo */}
            <img src="/logo.svg" className="w-auto h-6" alt="Logo" />

            {/* <img src="/icons/5.svg" className="w-auto h-10" alt="Logo" /> */}

        </div>

        {/* Fonts */}
        <FontPicker
            setValue={setValue}
            setFont={setFont}
            value={value}
            fonts={FONTS}
        />

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-center h-16 py-12 px-10 text-white">

            {/* Download button */}
            <button
                className="btn w-full px-4 py-3 rounded-2xl"
                onClick={() => handleShare(value, font, isIOS, setCopied)}
            >
                {copied ? "Copied!" : "Copy to Clipboard"}
            </button>

        </div>

    </div>

}
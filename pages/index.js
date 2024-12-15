import { FontPicker } from "@/ui/embla";
import { detectIOS, FONTS, generateImage } from "@/ui/utils";
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

        // Detect iOS devices
        setIsIOS(detectIOS());

    }, []);

    // Function to handle sharing
    const handleShare = async () => {

        // Generate the image data URL
        const dataUrl = generateImage(value, font);

        // Check if the device is iOS
        if (isIOS) {

            try {

                // Generate the file object
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'text-image.png', { type: 'image/png' });
                
                // Check if the Web Share API is supported
                if (navigator.share) {

                    // Share the file
                    await navigator.share({
                        files: [file]
                    });

                    // Alert the user
                    setCopied(true);

                    // Reset after 2 seconds
                    setTimeout(() => setCopied(false), 2000);
                } else {

                    // Throw an error
                    throw new Error('Web Share API not supported');
                }
            } catch (error) {

                // Handle errors
                console.error("Error sharing:", error);
                
                // Alert the user
                alert("Sharing failed. Please try copying the image manually.");
            }
        } else {
            
            // For Android and other devices, 
            // use the existing clipboard functionality
            try {

                // Generate the response from the image data URL
                const response = await fetch(dataUrl);
                const blob = await response.blob();

                // Check if the clipboard API is supported
                if (navigator.clipboard && navigator.clipboard.write) {
                    
                    // Write the blob to the clipboard
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            [blob.type]: blob
                        })
                    ]);

                    // Alert the user
                    setCopied(true);

                    // Reset after 2 seconds
                    setTimeout(() => setCopied(false), 2000);

                } else {

                    // Throw an error
                    throw new Error('Clipboard API not supported');
                }
            } catch (error) {

                // Handle errors
                console.error("Failed to copy image to clipboard", error);
                alert("Failed to copy image. Please try saving it manually.");

                // Fallback to download
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${value}.png`;
                link.click();
            }
        }
    };

    // Fonts
   
      
    // Markup
    return <div className="h-screen bg-[#161618] relative flex flex-col">

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
                onClick={() => handleShare()}
            >
                {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
        </div>

    </div>

}
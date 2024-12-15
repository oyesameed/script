import { IosPickerItem } from "@/ui/embla";
import Head from "next/head";
import { useState, useEffect } from "react";
import text2png from "text2png";

export default function Home() {
    // State
    const [value, setValue] = useState("silence is art maybe");
    const [font, setFont] = useState("Montserrat");
    const [copied, setCopied] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS devices
        setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
    }, []);

    // Function to generate the text image
    const generateImage = () => {
        return text2png(value, {
            font: `500px ${font.name}`,
            localFontName: font.name,
            color: "black",
            output: 'dataURL',
        });
    };

    // Function to handle sharing
    const handleShare = async () => {
        const dataUrl = generateImage();

        if (isIOS) {
            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'text-image.png', { type: 'image/png' });
                
                if (navigator.share) {
                    await navigator.share({
                        files: [file],
                        title: 'Shared Text Image',
                        text: 'Check out this text image!',
                    });
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } else {
                    throw new Error('Web Share API not supported');
                }
            } catch (error) {
                console.error("Error sharing:", error);
                alert("Sharing failed. Please try copying the image manually.");
            }
        } else {
            // For Android and other devices, use the existing clipboard functionality
            try {
                const response = await fetch(dataUrl);
                const blob = await response.blob();

                if (navigator.clipboard && navigator.clipboard.write) {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            [blob.type]: blob
                        })
                    ]);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } else {
                    throw new Error('Clipboard API not supported');
                }
            } catch (error) {
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
        {/* Download button */}
        <button
            className="btn w-full px-4 py-3 rounded-2xl"
            onClick={() => handleShare()}
        >
            {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
    </div>

</div>

    );
}
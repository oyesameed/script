import { IosPickerItem } from "@/ui/embla";
import { useState } from "react";
import text2png from "text2png";

export default function Home() {

    // State
    const [value, setValue] = useState("silence is art maybe");
    const [font, setFont] = useState("Montserrat");
    const [copied, setCopied] = useState(false);

    // Function to generate and download the text image
    const download = async () => {

        // Generate the image data URL
        const dataUrl = text2png(value, {
            font: `500px ${font.name}`,
            localFontName: font,
            color: "black",
            output: 'dataURL',
        });

        // Copy the image to the clipboard
        try {
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            // Write the image to the clipboard
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);

            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds

        } catch (error) {
            console.error("Failed to copy image to clipboard", error);
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
        <div className="h-screen bg-[#161618] flex flex-col">

    {/* Header */}
    <div className="flex items-center justify-center h-16 p-4 text-white">
        {/* Logo */}
        <img src="/logo.svg" className="w-auto h-6" alt="Logo" />
    </div>

    {/* Fonts */}
    <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="embla">
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
    <div className="flex items-center justify-center h-16 py-12 px-10 text-white">

        {/* Download button */}
        <button
            className="btn w-full px-4 py-3 rounded-2xl"
            onClick={() => download()}
        >
            {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
    </div>
</div>
    );
}

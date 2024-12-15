import { IosPickerItem } from "@/ui/embla";
import Head from "next/head";
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
            localFontName: font.name,
            color: "black",
            output: 'dataURL',
        });

        // Copy the image to the clipboard
        try {

            // Check if clipboard API is available
            if (!navigator.clipboard || !navigator.clipboard.write) {

                // Alert the user
                alert("Failed to copy image to clipboard. Please copy to clipboard manually.");

                // Download the image
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${value}.png`;
                link.click();

                // Alert the user
                setCopied(true);

                // Reset after 2 seconds
                setTimeout(() => setCopied(false), 2000);

                return;

               
            }

            // Generate response from the 
            // image data URL and blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            // Write the image to the clipboard
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);

            // Alert the user
            setCopied(true);

            // Reset after 2 seconds
            setTimeout(() => setCopied(false), 2000);

        } catch (error) {

            // Handle errors
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
            onClick={() => download()}
        >
            {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
    </div>

</div>

    );
}
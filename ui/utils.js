// This file contains utility functions 
// for the app

// Imports
import text2png from "text2png";

// Function to generate the text image
export const generateImage = (value, font) => {
    return text2png(value, {
        font: `500px ${font.name}`,
        localFontName: font.name,
        color: "black",
        output: "dataURL",
    });
};

// Function to detect iOS devices
export const detectIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Fonts array
export const FONTS = [
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

// Function to handle sharing
export const handleShare = async (value, font, isIOS, setCopied) => {

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


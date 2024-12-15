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
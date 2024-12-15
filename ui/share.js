// components/ShareComponent.js

"use client";
import React, { useState } from "react";
import text2png from "text2png";

const ShareComponent = ({ value, font }) => {

    const [copied, setCopied] = useState(false);

    const share = async (dataUrl) => {
        try {
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], "image.png", { type: "image/png" });
            const shareData = {
                files: [file],
                title: "Shared Image",
                text: "Check out this image!",
            };

            if (typeof window !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log("Share successful!");
            } else {
                throw new Error("Web Share API is not supported or cannot share this data.");
            }
        } catch (err) {
            console.error("Sharing failed:", err);
            alert("Sharing is not supported on this device/browser.");
        }
    };

    const download = async () => {

        // Generate the image data URL
        const dataUrl = text2png(value, {
            font: `500px ${font.name}`,
            localFontName: font.name,
            color: "black",
            output: 'dataURL',
        });


        if (navigator.share) {

            try {
              await navigator.share({
                title: 'Check out this cat!',
                text: 'I found this cute cat and wanted to share it with you!',
                url: dataUrl,
              })
            } catch (error) {
              if (error instanceof DOMException && error.name === 'AbortError') {
                console.log('Share was cancelled')
              } else {
                console.error('Error sharing:', error)
              }
            }
          } else {
            alert('Share API is not supported in this browser.');
          }


        // try {
        //     if (navigator.clipboard && navigator.clipboard.write) {
        //         const response = await fetch(dataUrl);
        //         const blob = await response.blob();
        //         await navigator.clipboard.write([
        //             new ClipboardItem({
        //                 [blob.type]: blob,
        //             }),
        //         ]);
        //         setCopied(true);
        //         setTimeout(() => setCopied(false), 2000);
        //     } else if (navigator.share) {
        //         await share(dataUrl);
        //         setCopied(true);
        //         setTimeout(() => setCopied(false), 2000);
        //     } else {
        //         alert("Clipboard API and Share API are not supported.");
        //     }
        // } catch (error) {
        //     console.error("Failed to copy image to clipboard", error);
        // }
    };

    return (
        <button className="btn w-full px-4 py-3 rounded-2xl" onClick={download}>
            {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
    );
};

export default ShareComponent;

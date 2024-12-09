import { IosPickerItem } from "@/ui/embla";

export default function Home() {
    
    // Data
    const data = [
        "--font-roboto",
        "--font-open-sans",
        "--font-lato",
        "--font-montserrat",
        "--font-oswald",
        "--font-poppins",
        "--font-raleway",
        "--font-nunito",
        "--font-merriweather",
    ];    

    // Markup
    return (
        <div className={`h-screen`}>
            
            {/* Slider */}
            <IosPickerItem
                value="silence is art maybe"
                slideCount={data.length}
                perspective="left"
                loop={false}
                slides={data}
            />
        </div>
    );
}

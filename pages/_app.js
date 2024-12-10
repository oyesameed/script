import '@/styles/globals.css';

// Fonts
import {
  Raleway,
  Cabin,
  Dancing_Script,
  Anton,
  Caveat,
  Shadows_Into_Light,
  Satisfy,
  Doto,
  Permanent_Marker,
  Indie_Flower,
  Amatic_SC,
  Bangers,
  Silkscreen,
  Gloria_Hallelujah,
  Sacramento,
  Zeyada
} from "next/font/google";

// Font Setup
const fontRaleway = Raleway({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-raleway",
});

const fontCabin = Cabin({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cabin",
});

const fontDancingScript = Dancing_Script({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

const fontAnton = Anton({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-anton",
});

const fontCaveat = Caveat({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-caveat",
});

const fontShadowsIntoLight = Shadows_Into_Light({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-shadows-into-light",
});

const fontSatisfy = Satisfy({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-satisfy",
});

const fontDoto = Doto({
   weight: ["500"],
  subsets: ["latin"],
  variable: "--font-doto",
});

const fontPermanentMarker = Permanent_Marker({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-permanent-marker",
});

const fontIndieFlower = Indie_Flower({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-indie-flower",
});

const fontAmaticSC = Amatic_SC({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-amatic-sc",
});

const fontBangers = Bangers({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bangers",
});

const fontSilkscreen = Silkscreen({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

const fontGloriaHallelujah = Gloria_Hallelujah({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-gloria-hallelujah",
});

const fontSacramento = Sacramento({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sacramento",
});

const fontZeyada = Zeyada({
   weight: ["400"],
  subsets: ["latin"],
  variable: "--font-zeyada",
});

// App Component
export default function App({ Component, pageProps }) {
  return (
    <main className={`${fontRaleway.variable} ${fontCabin.variable} ${fontDancingScript.variable} ${fontAnton.variable} ${fontCaveat.variable} ${fontShadowsIntoLight.variable} ${fontSatisfy.variable} ${fontDoto.variable} ${fontPermanentMarker.variable} ${fontIndieFlower.variable} ${fontAmaticSC.variable} ${fontBangers.variable} ${fontSilkscreen.variable} ${fontGloriaHallelujah.variable} ${fontSacramento.variable} ${fontZeyada.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

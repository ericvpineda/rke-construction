import Footer from "@components/Footer";
import Hero from "@components/Hero";
import ImageSection from "@components/ImageSection";
import MissionStatement from "@components/MissionStatement";

export default function Home() {
  return (
   <main className="p-0 m-0">
    <Hero/>
    <MissionStatement/>
    <ImageSection/>
    <Footer/>
   </main> 
  )
}

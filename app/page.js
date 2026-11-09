import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import { Faculty, Courses } from "@/components/CardGrid";
import Gallery from "@/components/Gallery";
import Admissions from "@/components/Admissions";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="scene-3d" aria-hidden="true">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
        <div className="orb orb--3"></div>
      </div>
      <Header />
      <main>
        <Hero />
        <About />
        <Faculty />
        <Courses />
        <Gallery />
        <Admissions />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TeamsSection from "@/components/home/TeamsSection";
import EventsSection from "@/components/home/EventsSection";
import AnnouncementsSection from "@/components/home/AnnouncementsSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import CTASection from "@/components/home/CTASection";
import PublicBanners from "@/components/home/PublicBanners";
import { usePageTitle } from "@/hooks/use-page-title";

const Index = () => {
  usePageTitle("Home");
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <PublicBanners />
        <HeroSection />
        <TeamsSection />
        <EventsSection />
        <AnnouncementsSection />
        <GalleryPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

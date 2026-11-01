import Navbar from "@/components/navbar"
import HeroCarousel from "@/components/hero-carousel"
import ToursSection from "@/components/tours-section"
import Footer from "@/components/footer"
import DiscountModal from "@/components/discount-modal"
import Blogs from "@/components/BlogSection"
import Video from "@/components/video_back"
import BenefitsStrip from "@/components/benefits-strip"

export default function Home() {
  return (
    <main className="w-full">
      <DiscountModal />
      <Navbar />
      <HeroCarousel />
      <BenefitsStrip />
      <ToursSection />
      <Video/>
      <Blogs />
      <Footer />
    </main>
  )
}

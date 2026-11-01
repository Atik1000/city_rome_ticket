import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TourDetailPage from "@/components/tour-detail-page"

export default async function TourPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <main className="w-full">
            <Navbar />
            <TourDetailPage tourId={Number.parseInt(id)} />
            <Footer />
        </main>
    )
}

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TourAvailabilityPage from "@/components/tour-availability-page"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <main className="w-full">
            <Navbar />
            <TourAvailabilityPage tourId={Number.parseInt(id)} />
            <Footer />
        </main>
    )
}

import RenterDetails from "@/components/renter-details"
import Header from "@/components/ui/Header";

export default function Home() {
  return (
    <>
    <Header />
    <main className="min-h-screen bg-gray-50">
      <RenterDetails />
    </main>
    </>
  );
}

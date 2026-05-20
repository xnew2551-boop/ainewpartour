import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TourCard from '../../components/TourCard';

async function getTours() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/tours`, { cache: 'no-store' });
  if (!res.ok) return [];
  return (await res.json()).tours || [];
}

export const metadata = { title: 'แพ็กเกจทัวร์ | ไอนิวพาทัวร์' };

export default async function ToursPage() {
  const tours = await getTours();
  return (
    <>
      <Header />
      <main className="container-pad py-12">
        <h1 className="text-4xl font-bold">แพ็กเกจทัวร์ทั้งหมด</h1>
        <p className="mt-3 text-slate-600">เลือกปลายทางที่ใช่ แล้วจองพร้อมชำระเงินได้ในขั้นตอนเดียว</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
        </div>
      </main>
      <Footer />
    </>
  );
}

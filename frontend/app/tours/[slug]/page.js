import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BookingForm from '../../../components/BookingForm';
import { money } from '../../../lib/format';
import { BedDouble, CalendarDays, MapPin } from 'lucide-react';

async function getTour(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/tours/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return (await res.json()).tour;
}

export default async function TourDetail({ params }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return <main className="p-10">ไม่พบแพ็กเกจทัวร์</main>;
  return (
    <>
      <Header />
      <main>
        <section className="relative h-[440px] text-white">
          <Image src={tour.imageUrl} alt={tour.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
          <div className="container-pad absolute inset-x-0 bottom-10">
            <h1 className="max-w-3xl text-5xl font-bold">{tour.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-white/90">
              <span className="inline-flex items-center gap-2"><MapPin size={18} />{tour.location}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays size={18} />{tour.durationDays} วัน</span>
              <span className="inline-flex items-center gap-2"><BedDouble size={18} />{tour.hotel}</span>
            </div>
          </div>
        </section>
        <section className="container-pad grid gap-8 py-12 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="text-3xl font-bold text-ocean">{money(tour.price)} <span className="text-base text-slate-500">/ คน</span></p>
            <p className="mt-5 text-lg leading-8 text-slate-700">{tour.description}</p>
            <h2 className="mt-10 text-2xl font-bold">ตารางเดินทาง</h2>
            <div className="mt-5 space-y-4">
              {tour.itinerary.map((item, index) => (
                <div className="card flex gap-4 p-5" key={item}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-skysoft font-bold text-ocean">{index + 1}</span>
                  <p className="pt-2 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <BookingForm tour={tour} />
        </section>
      </main>
      <Footer />
    </>
  );
}

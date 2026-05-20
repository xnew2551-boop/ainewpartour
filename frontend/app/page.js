import Header from '../components/Header';
import Footer from '../components/Footer';
import TourCard from '../components/TourCard';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import { MotionHero } from '../components/MotionHero';

async function getTours() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/tours`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.tours || [];
}

export default async function Home() {
  const tours = await getTours();
  const popular = tours.filter((tour) => tour.isPopular).slice(0, 6);
  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[640px] overflow-hidden bg-ink text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/65 to-transparent" />
          <div className="container-pad relative flex min-h-[640px] items-center">
            <MotionHero>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">Ainewpartour</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight md:text-7xl">เที่ยวสนุก ครบ จบในที่เดียว</h1>
              <p className="mt-5 max-w-xl text-lg text-white/82">จองแพ็กเกจทัวร์คุณภาพ พร้อมระบบสมาชิก ชำระเงิน PromptPay และทีมงานดูแลทุกขั้นตอน</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/tours" className="btn-primary gap-2">จองทัวร์เลย <ArrowRight size={18} /></Link>
                <a href="tel:0962032266" className="btn-outline border-white/30 text-white hover:bg-white/10">โทร 096-203-2266</a>
              </div>
            </MotionHero>
          </div>
        </section>

        <section className="container-pad -mt-16 relative z-10 grid gap-4 md:grid-cols-3">
          {[
            ['จองง่าย', 'เลือกวันและจำนวนคนได้ทันที', Sparkles],
            ['ชำระสะดวก', 'PromptPay QR พร้อมอัปโหลดสลิป', WalletCards],
            ['ปลอดภัย', 'JWT, Validation และ Protected Routes', ShieldCheck]
          ].map(([title, text, Icon]) => (
            <div className="card p-5" key={title}>
              <Icon className="text-gold" />
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="text-slate-600">{text}</p>
            </div>
          ))}
        </section>

        <section className="container-pad mt-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-ocean">Popular Packages</p>
              <h2 className="text-3xl font-bold">แพ็กเกจยอดนิยม</h2>
            </div>
            <Link href="/tours" className="btn-outline">ดูทั้งหมด</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popular.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

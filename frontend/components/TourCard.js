import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { money } from '../lib/format';

export default function TourCard({ tour }) {
  return (
    <article className="card overflow-hidden">
      <div className="relative h-56">
        <Image src={tour.imageUrl} alt={tour.title} fill className="object-cover" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1"><MapPin size={15} />{tour.location}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays size={15} />{tour.durationDays} วัน</span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-ink">{tour.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{tour.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-ocean">{money(tour.price)}</span>
          <Link className="btn-outline" href={`/tours/${tour.slug}`}>จอง</Link>
        </div>
      </div>
    </article>
  );
}

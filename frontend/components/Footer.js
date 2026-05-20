export default function Footer() {
  return (
    <footer className="mt-20 bg-ink py-10 text-white">
      <div className="container-pad grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold">ไอนิวพาทัวร์</h3>
          <p className="mt-2 text-white/70">เที่ยวสนุก ครบ จบในที่เดียว พร้อมทีมดูแลการจองและการชำระเงิน</p>
        </div>
        <div>
          <p className="font-semibold text-gold">ติดต่อ</p>
          <p className="mt-2 text-white/75">096-203-2266</p>
          <p className="text-white/75">udomdath21112551@gmail.com</p>
        </div>
        <div className="text-white/65 md:text-right">© 2026 Ainewpartour. All rights reserved.</div>
      </div>
    </footer>
  );
}

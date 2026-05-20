import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Prompt } from 'next/font/google';

const prompt = Prompt({ subsets: ['thai', 'latin'], weight: ['300', '400', '500', '600', '700'] });

export const metadata = {
  title: 'ไอนิวพาทัวร์ | เที่ยวสนุก ครบ จบในที่เดียว',
  description: 'เว็บไซต์จองแพ็กเกจทัวร์ พร้อมระบบสมาชิก ชำระเงิน PromptPay และหลังบ้าน',
  openGraph: {
    title: 'ไอนิวพาทัวร์',
    description: 'เที่ยวสนุก ครบ จบในที่เดียว'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

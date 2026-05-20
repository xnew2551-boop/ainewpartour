import AuthForm from '../../components/AuthForm';

export const metadata = { title: 'เข้าสู่ระบบ | ไอนิวพาทัวร์' };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}

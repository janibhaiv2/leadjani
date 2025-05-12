import Dashboard from './components/Dashboard';
import MainLayout from './components/MainLayout';

export const metadata = {
  title: "Home - Lead Management System",
  description: "CULTJANI's lead management dashboard for processing Meta/Facebook leads. Filter, format, and distribute your leads efficiently.",
  openGraph: {
    title: "CULTJANI - Home Dashboard",
    description: "Manage your Meta/Facebook leads with our powerful lead management system",
  },
};

export default function Home() {
  return (
    <MainLayout>
      <div className="container">
        <Dashboard />
      </div>
    </MainLayout>
  );
}

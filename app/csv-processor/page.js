import CSVProcessor from '../components/CSVProcessor';
import MainLayout from '../components/MainLayout';

// Metadata is defined in layout.js

export default function CSVProcessorPage() {
  return (
    <MainLayout>
      <div className="container">
        <CSVProcessor />
      </div>
    </MainLayout>
  );
}

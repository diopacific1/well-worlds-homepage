import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CryptoDashboard from './pages/CryptoDashboard';
import PlantJournal from './pages/PlantJournal';
import Stories from './pages/Stories';
import Baseball from './pages/Baseball';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="crypto" element={<CryptoDashboard />} />
          <Route path="plants" element={<PlantJournal />} />
          <Route path="stories" element={<Stories />} />
          <Route path="baseball" element={<Baseball />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

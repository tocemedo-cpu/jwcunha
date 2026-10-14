import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Hse from './pages/Hse';
import Mobilisation from './pages/Mobilisation';
import NotFound from './pages/NotFound';
import Sectors from './pages/Sectors';
import ServicePage from './pages/ServicePage';
import { useI18n } from './i18n/I18nProvider';

export default function App() {
  const { c } = useI18n();
  const services = [c.services.facility, c.services.property, c.services.waste, c.services.supplies];
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        {services.map((s) => (
          <Route key={s.slug} path={s.path.slice(1)} element={<ServicePage service={s} />} />
        ))}
        <Route path="sectors" element={<Sectors />} />
        <Route path="hse-quality" element={<Hse />} />
        <Route path="mobilisation" element={<Mobilisation />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

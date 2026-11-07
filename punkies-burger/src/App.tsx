import { BrandSprite } from './components/brand/Brand';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Cinta } from './components/sections/Cinta';
import { Menu } from './components/sections/Menu';
import { Experiencia } from './components/sections/Experiencia';
import { Especiales } from './components/sections/Especiales';
import { Universo } from './components/sections/Universo';
import { Ubicacion } from './components/sections/Ubicacion';
import { ProductDialog } from './components/order/ProductDialog';
import { CartDrawer } from './components/order/CartDrawer';
import { MobileOrderBar } from './components/order/MobileOrderBar';
import { Toast } from './components/order/Toast';
import { CartProvider } from './state/cart';
import { UIProvider } from './state/ui';

export default function App() {
  return (
    <CartProvider>
          <UIProvider>
            <BrandSprite />
            <a href="#menu" className="sr-only z-[70] rounded-full bg-amarillo px-5 py-3 font-bold text-tinta focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
              Saltar al menú
            </a>
            <Header />
            <main id="contenido">
              <Hero />
              <Cinta />
              <Menu />
              <Experiencia />
              <Especiales />
              <Universo />
              <Ubicacion />
            </main>
            <Footer />
            <MobileOrderBar />
            <ProductDialog />
            <CartDrawer />
            <Toast />
          </UIProvider>
    </CartProvider>
  );
}

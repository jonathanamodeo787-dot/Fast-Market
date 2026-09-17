import { type ReactNode, useState } from 'react';
import {
  ArrowRight,
  Beer,
  ChevronUp,
  Clock3,
  Edit3,
  ExternalLink,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Milk,
  PackageOpen,
  Save,
  ShoppingBasket,
  Snowflake,
  Truck,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const whatsappUrl = 'https://wa.me/5492364206053';

type Offer = {
  id: number;
  icon: 'basket' | 'milk' | 'beer' | 'package';
  name: string;
  detail: string;
  previous: string;
  current: string;
};

const initialOffers: Offer[] = [
  { id: 1, icon: 'basket', name: 'Nombre del producto', detail: 'Presentación [A CONFIRMAR]', previous: 'Precio anterior [A CONFIRMAR]', current: 'Precio oferta [A CONFIRMAR]' },
  { id: 2, icon: 'milk', name: 'Nombre del producto', detail: 'Presentación [A CONFIRMAR]', previous: 'Precio anterior [A CONFIRMAR]', current: 'Precio oferta [A CONFIRMAR]' },
  { id: 3, icon: 'beer', name: 'Nombre del producto', detail: 'Presentación [A CONFIRMAR]', previous: 'Precio anterior [A CONFIRMAR]', current: 'Precio oferta [A CONFIRMAR]' },
  { id: 4, icon: 'package', name: 'Nombre del producto', detail: 'Presentación [A CONFIRMAR]', previous: 'Precio anterior [A CONFIRMAR]', current: 'Precio oferta [A CONFIRMAR]' },
];

const branches = [
  {
    number: '01',
    address: 'Av. República 929',
    hours: 'L-S 9:00 a 21:30 | D 10:00-13:30 y 17:00-21:30',
  },
  {
    number: '02',
    address: 'Remedios de Escalada de San Martín 25',
    hours: 'L-S 9:00 a 21:00 | D 10:00-13:30 y 17:00-21:30',
  },
  {
    number: '03',
    address: 'Primera Junta 1102',
    hours: 'L-S 9:00 a 21:00 | D 10:00-13:30 y 17:00-21:30',
  },
];

function Logo() {
  return (
    <span className="fm-logo" data-testid="brand-logo">
      <span className="fm-logo-mark" aria-hidden="true"><span>FM</span></span>
      <span>
        <span className="fm-logo-word">Fast Market</span>
        <span className="fm-logo-place">Junín · cerca tuyo</span>
      </span>
    </span>
  );
}

function OfferIcon({ icon }: { icon: Offer['icon'] }) {
  if (icon === 'milk') return <Milk size={68} strokeWidth={1.2} />;
  if (icon === 'beer') return <Beer size={68} strokeWidth={1.2} />;
  if (icon === 'package') return <PackageOpen size={68} strokeWidth={1.2} />;
  return <ShoppingBasket size={68} strokeWidth={1.2} />;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fm-header" data-testid="header-site">
      <div className="fm-container fm-header-inner">
        <a href="#inicio" onClick={closeMenu} aria-label="Ir al inicio de Fast Market Junín" data-testid="link-logo">
          <Logo />
        </a>
        <nav className={`fm-nav ${menuOpen ? 'fm-nav-open' : ''}`} aria-label="Navegación principal">
          <a href="#ofertas" onClick={closeMenu} data-testid="link-nav-ofertas">Ofertas</a>
          <a href="#delivery" onClick={closeMenu} data-testid="link-nav-delivery">Delivery</a>
          <a href="#sucursales" onClick={closeMenu} data-testid="link-nav-sucursales">Sucursales</a>
          <a href="#contacto" onClick={closeMenu} data-testid="link-nav-contacto">Contacto</a>
        </nav>
        <div className="flex items-center gap-2">
          <a className="fm-top-cta" href={whatsappUrl} target="_blank" rel="noreferrer" data-testid="link-header-whatsapp">
            <MessageCircle size={15} strokeWidth={2.5} /> WhatsApp
          </a>
          <button className="fm-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} data-testid="button-menu">
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="fm-container md:hidden" style={{ paddingBottom: 18 }}>
          <div className="fm-nav" style={{ display: 'grid', gap: 13, paddingTop: 10 }}>
            <a href="#ofertas" onClick={closeMenu} data-testid="link-mobile-ofertas">Ofertas</a>
            <a href="#delivery" onClick={closeMenu} data-testid="link-mobile-delivery">Delivery</a>
            <a href="#sucursales" onClick={closeMenu} data-testid="link-mobile-sucursales">Sucursales</a>
            <a href="#contacto" onClick={closeMenu} data-testid="link-mobile-contacto">Contacto</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="fm-hero" id="inicio" data-testid="section-hero">
      <div className="fm-container fm-hero-grid">
        <div className="fm-reveal">
          <p className="fm-hero-kicker">Supermercado de barrio · Junín</p>
          <h1 className="fm-hero-title">Siempre cerca <em>tuyo</em>,<br />siempre al mejor precio!</h1>
          <p className="fm-hero-text">
            Todo lo que necesitás para el día a día, a mano y sin vueltas. Encontrá tu Fast Market más cercano.
          </p>
          <div className="fm-hero-actions">
            <a className="fm-button fm-button-primary" href="#ofertas" data-testid="link-hero-ofertas">
              Ver ofertas <ArrowRight size={17} />
            </a>
            <a className="fm-button fm-button-secondary" href="#delivery" data-testid="link-hero-delivery">
              Pedir delivery <Truck size={17} />
            </a>
            <a className="fm-button fm-button-outline" href="#sucursales" data-testid="link-hero-sucursales">
              Sucursales <MapPin size={16} />
            </a>
          </div>
          <div className="fm-hero-note"><MapPin size={15} /> Compras rápidas, cerca de casa.</div>
        </div>
        <div className="fm-hero-illustration fm-reveal fm-delay-2" aria-label="Cartel ilustrado de Fast Market" data-testid="hero-illustration">
          <div className="fm-hero-sun" />
          <div className="fm-hero-sign">
            <div className="fm-sign-line" />
            <div className="fm-sign-small">el súper de todos los días</div>
            <div className="fm-sign-large">FAST<br />MARKET</div>
            <div className="fm-sign-sub">Junín · Argentina</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Offers() {
  const [offers, setOffers] = useState(initialOffers);
  const [editingId, setEditingId] = useState<number | null>(null);

  const updateOffer = (id: number, field: keyof Offer, value: string) => {
    setOffers((current) => current.map((offer) => offer.id === id ? { ...offer, [field]: value } : offer));
  };

  return (
    <section className="fm-section" id="ofertas" data-testid="section-offers">
      <div className="fm-container">
        <div className="fm-section-head">
          <div>
            <span className="fm-eyebrow">Lo que conviene mirar</span>
            <h2 className="fm-section-title">Ofertas de la semana</h2>
          </div>
          <p className="fm-section-copy">Valores y productos a confirmar. Esta grilla está lista para actualizar con las ofertas vigentes.</p>
        </div>
        <div className="fm-offers-grid">
          {offers.map((offer) => (
            <article className="fm-offer-card" key={offer.id} data-testid={`card-offer-${offer.id}`}>
              <div className="fm-offer-image">
                <span className="fm-offer-badge">OFERTA</span>
                <span className="fm-offer-icon" data-testid={`img-placeholder-offer-${offer.id}`}><OfferIcon icon={offer.icon} /></span>
                <button className="fm-offer-edit" type="button" onClick={() => setEditingId(editingId === offer.id ? null : offer.id)} aria-label={`Editar oferta ${offer.id}`} data-testid={`button-edit-offer-${offer.id}`}>
                  {editingId === offer.id ? <X size={15} /> : <Edit3 size={15} />}
                </button>
              </div>
              {editingId === offer.id ? (
                <div className="fm-edit-panel" data-testid={`form-edit-offer-${offer.id}`}>
                  <input value={offer.name} onChange={(event) => updateOffer(offer.id, 'name', event.target.value)} aria-label="Nombre de la oferta" data-testid={`input-offer-name-${offer.id}`} />
                  <input value={offer.detail} onChange={(event) => updateOffer(offer.id, 'detail', event.target.value)} aria-label="Detalle de la oferta" data-testid={`input-offer-detail-${offer.id}`} />
                  <input value={offer.previous} onChange={(event) => updateOffer(offer.id, 'previous', event.target.value)} aria-label="Precio anterior de la oferta" data-testid={`input-offer-previous-${offer.id}`} />
                  <input value={offer.current} onChange={(event) => updateOffer(offer.id, 'current', event.target.value)} aria-label="Precio nuevo de la oferta" data-testid={`input-offer-current-${offer.id}`} />
                  <div className="fm-edit-actions">
                    <button className="fm-mini-action" type="button" onClick={() => setEditingId(null)} data-testid={`button-save-offer-${offer.id}`}><Save size={13} /> Guardar</button>
                    <button className="fm-mini-action cancel" type="button" onClick={() => setEditingId(null)} data-testid={`button-cancel-offer-${offer.id}`}>Cerrar</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="fm-offer-name" data-testid={`text-offer-name-${offer.id}`}>{offer.name}</h3>
                  <p className="fm-offer-detail" data-testid={`text-offer-detail-${offer.id}`}>{offer.detail}</p>
                  <div className="fm-price-line">
                    <span className="fm-price-old" data-testid={`text-offer-previous-${offer.id}`}>{offer.previous}</span>
                    <span className="fm-price-new" data-testid={`text-offer-current-${offer.id}`}>{offer.current}</span>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
        <p className="fm-confirm-note" data-testid="text-offers-confirmation">* Precios, productos e imágenes de ejemplo — [A CONFIRMAR].</p>
      </div>
    </section>
  );
}

function Delivery() {
  return (
    <section className="fm-delivery" id="delivery" data-testid="section-delivery">
      <div className="fm-container fm-delivery-grid">
        <div>
          <span className="fm-eyebrow">Cuando no podés acercarte</span>
          <h2 className="fm-delivery-title">Los mejores precios - <mark>Más cerca tuyo</mark></h2>
          <p className="fm-delivery-copy">¿Necesitás hacer un pedido? Escribinos por WhatsApp y consultá el servicio de delivery. La disponibilidad y condiciones están [A CONFIRMAR].</p>
          <a className="fm-button fm-delivery-action" href={whatsappUrl} target="_blank" rel="noreferrer" data-testid="link-delivery-whatsapp">
            <MessageCircle size={18} /> Escribir por WhatsApp <ArrowRight size={16} />
          </a>
        </div>
        <div className="fm-delivery-stamp" data-testid="delivery-stamp"><span>tu súper<br />a un mensaje<br />de distancia</span></div>
      </div>
    </section>
  );
}

function Branches() {
  return (
    <section className="fm-section fm-branches" id="sucursales" data-testid="section-branches">
      <div className="fm-container">
        <div className="fm-section-head">
          <div>
            <span className="fm-eyebrow">Encontranos en tu barrio</span>
            <h2 className="fm-section-title">Tres lugares,<br />una misma cercanía.</h2>
          </div>
          <p className="fm-section-copy">Elegí la sucursal que te queda más cómoda y consultá cómo llegar.</p>
        </div>
        <div className="fm-branches-grid">
          {branches.map((branch) => (
            <article className="fm-branch-card" data-number={branch.number} key={branch.number} data-testid={`card-branch-${branch.number}`}>
              <div className="fm-branch-no">SUCURSAL {branch.number}</div>
              <h3 className="fm-branch-name" data-testid={`text-branch-address-${branch.number}`}>{branch.address}</h3>
              <p className="fm-branch-hours" data-testid={`text-branch-hours-${branch.number}`}><Clock3 size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />{branch.hours}</p>
              <a className="fm-branch-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.address}, Junín, Argentina`)}`} target="_blank" rel="noreferrer" data-testid={`link-map-branch-${branch.number}`}>
                Ver en Google Maps <ExternalLink size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const categories = [
    { label: 'Bebidas', icon: <Beer size={36} strokeWidth={1.4} /> },
    { label: 'Lácteos', icon: <Milk size={36} strokeWidth={1.4} /> },
    { label: 'Almacén', icon: <PackageOpen size={36} strokeWidth={1.4} /> },
    { label: 'Congelados', icon: <Snowflake size={36} strokeWidth={1.4} /> },
    { label: 'Más categorías [A CONFIRMAR]', icon: <ShoppingBasket size={36} strokeWidth={1.4} /> },
  ];

  return (
    <section className="fm-section fm-section-tinted fm-categories" id="categorias" data-testid="section-categories">
      <div className="fm-container">
        <div className="fm-section-head">
          <div>
            <span className="fm-eyebrow">Para cada compra</span>
            <h2 className="fm-section-title">Lo que buscás,<br />sin dar mil vueltas.</h2>
          </div>
        </div>
        <div className="fm-category-grid">
          {categories.map((category, index) => (
            <div className="fm-category" key={category.label} data-testid={`category-${index + 1}`}>
              <span className="fm-category-icon" aria-hidden="true">{category.icon}</span>
              <span>{category.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="fm-contact" id="contacto" data-testid="section-contact">
      <div className="fm-container fm-contact-grid">
        <div>
          <span className="fm-eyebrow">Hablemos</span>
          <h2 className="fm-contact-title">Siempre hay<br />alguien del otro lado.</h2>
          <p className="fm-contact-copy">Consultas, pedidos o simplemente saber qué hay de oferta. Estamos cerca también por acá.</p>
          <div className="fm-contact-links">
            <a className="fm-contact-link" href={whatsappUrl} target="_blank" rel="noreferrer" data-testid="link-contact-whatsapp">
              <span><MessageCircle size={19} /> WhatsApp · 2364 206053</span><ArrowRight size={16} />
            </a>
            <a className="fm-contact-link" href="https://www.instagram.com/fastmarketjunin/" target="_blank" rel="noreferrer" data-testid="link-contact-instagram">
              <span><Instagram size={19} /> Instagram · @fastmarketjunin</span><ExternalLink size={15} />
            </a>
          </div>
          <p className="fm-confirm-note" data-testid="text-instagram-confirmation">Instagram: usuario placeholder — [A CONFIRMAR].</p>
        </div>
        <div className="fm-values" data-testid="values-list">
          <div className="fm-values-title">Lo que nos mueve</div>
          <div className="fm-value" data-testid="value-calidad">Calidad</div>
          <div className="fm-value" data-testid="value-precios">Precios Bajos</div>
          <div className="fm-value" data-testid="value-atencion">Atención Siempre</div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="fm-footer" data-testid="footer-site">
      <div className="fm-container fm-footer-inner">
        <a href="#inicio" aria-label="Volver al inicio" data-testid="link-footer-logo"><Logo /></a>
        <p className="fm-footer-copy">Fast Market Junín · Información de sucursales confirmada en este sitio.</p>
        <a className="fm-back-top" href="#inicio" data-testid="link-back-top">Volver arriba <ChevronUp size={14} /></a>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <main className="fm-page">
      <Header />
      <Hero />
      <Offers />
      <Delivery />
      <Branches />
      <Categories />
      <Contact />
      <Footer />
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
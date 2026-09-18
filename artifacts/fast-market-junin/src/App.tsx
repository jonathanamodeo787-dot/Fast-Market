import { type ChangeEvent, type ReactNode, useEffect, useState } from 'react';
import {
  ArrowRight,
  Beer,
  ChevronUp,
  Clock3,
  ExternalLink,
  ImagePlus,
  Instagram,
  LockKeyhole,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Milk,
  PackageOpen,
  Plus,
  Save,
  ShoppingBasket,
  Snowflake,
  Store,
  Tags,
  Trash2,
  Truck,
  UserPlus,
  UsersRound,
  Wine,
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
const offersStorageKey = 'fast-market-junin-offers';
const categoriesStorageKey = 'fast-market-junin-categories';
const suppliersStorageKey = 'fast-market-junin-suppliers';
const usersStorageKey = 'fast-market-junin-users';
const adminUsername = 'admin';
const adminPassword = 'fastmarket';

type Category = string;
type Offer = {
  id: number;
  icon: 'basket' | 'milk' | 'beer' | 'package' | 'wine';
  image?: string;
  alt: string;
  name: string;
  detail: string;
  price: string;
  offer?: string;
  category: Category;
  supplierId?: number;
  comment?: string;
};

type Supplier = {
  id: number;
  name: string;
  contact?: string;
};

type AdminUser = {
  id: number;
  username: string;
  password: string;
  role: string;
};

const initialCategories: Category[] = ['Bebidas', 'Lácteos', 'Almacén', 'Congelados'];
const initialSuppliers: Supplier[] = [];
const initialUsers: AdminUser[] = [{ id: 1, username: adminUsername, password: adminPassword, role: 'Administrador' }];

const initialOffers: Offer[] = [
  { id: 1, icon: 'package', image: '/products/milka-oreo.jpg', alt: 'Tableta de chocolate Milka Oreo', name: 'Chocolate Milka Oreo', detail: 'Tableta 100 g', price: '$ 4.800', offer: '$ 3.990', category: 'Almacén' },
  { id: 2, icon: 'package', image: '/products/bon-o-bon.jpg', alt: 'Pack de chocolates Bon o Bon', name: 'Bon o Bon', detail: 'Pack x 6 unidades', price: '$ 3.600', offer: '$ 2.990', category: 'Almacén' },
  { id: 3, icon: 'wine', image: '/products/vino-tinto.jpg', alt: 'Botella de vino tinto', name: 'Vino tinto', detail: 'Botella 750 ml', price: '$ 6.500', offer: '$ 5.490', category: 'Bebidas' },
  { id: 4, icon: 'beer', image: '/products/cerveza-corona.jpg', alt: 'Lata de cerveza Corona Extra', name: 'Cerveza Corona Extra', detail: 'Lata 473 ml', price: '$ 2.200', offer: '$ 1.790', category: 'Bebidas' },
  { id: 5, icon: 'milk', image: '/products/leche-serenisima.jpg', alt: 'Caja de leche entera La Serenísima', name: 'Leche entera La Serenísima', detail: 'Pack 1 litro', price: '$ 1.900', offer: '$ 1.590', category: 'Lácteos' },
  { id: 6, icon: 'package', image: '/products/fideos-conzazoni.jpg', alt: 'Paquete de fideos Conzazoni', name: 'Fideos secos', detail: 'Paquete 500 g', price: '$ 1.700', offer: '$ 1.390', category: 'Almacén' },
  { id: 7, icon: 'basket', image: '/products/papas-mccain.jpg', alt: 'Paquete de papas fritas congeladas McCain', name: 'Papas congeladas McCain', detail: 'Paquete 900 g', price: '$ 5.900', offer: '$ 4.990', category: 'Congelados' },
];

function loadOffers(): Offer[] {
  if (typeof window === 'undefined') return initialOffers;
  try {
    const stored = window.localStorage.getItem(offersStorageKey);
    if (!stored) return initialOffers;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return initialOffers;
    return parsed.map((item) => {
      const legacy = item as Offer & { previous?: string; current?: string };
      return {
        ...legacy,
        price: legacy.price || legacy.previous || legacy.current || '',
        offer: legacy.offer || (legacy.previous && legacy.current && legacy.previous !== legacy.current ? legacy.current : ''),
        category: legacy.category || 'Almacén',
      };
    });
  } catch {
    return initialOffers;
  }
}

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

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
      <img className="fm-logo-image" src="/fast-market-logo.jpg" alt="" aria-hidden="true" />
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
  if (icon === 'wine') return <Wine size={68} strokeWidth={1.2} />;
  if (icon === 'package') return <PackageOpen size={68} strokeWidth={1.2} />;
  return <ShoppingBasket size={68} strokeWidth={1.2} />;
}

function Header({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fm-header" data-testid="header-site">
      <div className="fm-container fm-header-inner">
        <button className="fm-restricted-link" type="button" onClick={onOpenAdmin} data-testid="button-restricted-access">
          Acceso restringido
        </button>
        <a href="#inicio" onClick={closeMenu} aria-label="Ir al inicio de Fast Market Junín" data-testid="link-logo">
          <Logo />
        </a>
        <nav className={`fm-nav ${menuOpen ? 'fm-nav-open' : ''}`} aria-label="Navegación principal">
          <a href="#ofertas" onClick={closeMenu} data-testid="link-nav-ofertas">Ofertas</a>
           <a href="#catalogo" onClick={closeMenu} data-testid="link-nav-catalogo">Catálogo</a>
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
            <a href="#catalogo" onClick={closeMenu} data-testid="link-mobile-catalogo">Catálogo</a>
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
          <h1 className="fm-hero-title text-[98px]">Siempre cerca <em>tuyo</em>,<br />siempre al mejor precio!</h1>
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

function ProductGrid({ products, testIdPrefix }: { products: Offer[]; testIdPrefix: string }) {
  return (
    <div className="fm-offers-grid">
      {products.map((offer) => (
        <article className="fm-offer-card" key={offer.id} data-testid={`card-${testIdPrefix}-${offer.id}`}>
          <div className="fm-offer-image">
            {offer.offer && <span className="fm-offer-badge">OFERTA</span>}
            {offer.image ? (
              <img className="fm-product-image" src={offer.image} alt={offer.alt} data-testid={`img-${testIdPrefix}-${offer.id}`} />
            ) : (
              <span className="fm-offer-fallback" aria-label={offer.alt}><OfferIcon icon={offer.icon} /></span>
            )}
          </div>
          <span className="fm-offer-category">{offer.category}</span>
          <h3 className="fm-offer-name" data-testid={`text-${testIdPrefix}-name-${offer.id}`}>{offer.name}</h3>
          <p className="fm-offer-detail" data-testid={`text-${testIdPrefix}-detail-${offer.id}`}>{offer.detail}</p>
          {offer.comment && <p className="fm-offer-comment">{offer.comment}</p>}
          <div className="fm-price-line">
            {offer.offer ? (
              <>
                <span className="fm-price-old" data-testid={`text-${testIdPrefix}-price-${offer.id}`}>{offer.price}</span>
                <span className="fm-price-new" data-testid={`text-${testIdPrefix}-offer-${offer.id}`}>{offer.offer}</span>
              </>
            ) : (
              <span className="fm-price-new fm-price-single" data-testid={`text-${testIdPrefix}-price-${offer.id}`}>{offer.price}</span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function Offers({ offers, selectedCategory }: { offers: Offer[]; selectedCategory: Category | null }) {
  const visibleOffers = offers.filter((offer) => offer.offer && (!selectedCategory || offer.category === selectedCategory));
  return (
    <section className="fm-section" id="ofertas" data-testid="section-offers">
      <div className="fm-container">
        <div className="fm-section-head">
          <div>
            <span className="fm-eyebrow">Lo que conviene mirar</span>
            <h2 className="fm-section-title">Ofertas de la semana</h2>
          </div>
          <div className="fm-section-tools">
            <p className="fm-section-copy">Productos conocidos para una compra rápida. Estos precios son de prueba y están listos para actualizar.</p>
            {selectedCategory && <span className="fm-active-filter">Mostrando: {selectedCategory}</span>}
          </div>
        </div>
        <ProductGrid products={visibleOffers} testIdPrefix="offer" />
        {visibleOffers.length === 0 && <p className="fm-empty-state">Todavía no hay ofertas cargadas en esta categoría.</p>}
        <p className="fm-confirm-note" data-testid="text-offers-confirmation">* Precios de prueba, sujetos a actualización según las ofertas vigentes.</p>
      </div>
    </section>
  );
}

function Catalog({ offers, selectedCategory }: { offers: Offer[]; selectedCategory: Category | null }) {
  const visibleProducts = selectedCategory ? offers.filter((offer) => offer.category === selectedCategory) : offers;
  return (
    <section className="fm-section fm-catalog" id="catalogo" data-testid="section-catalog">
      <div className="fm-container">
        <div className="fm-section-head">
          <div>
            <span className="fm-eyebrow">Todo el surtido</span>
            <h2 className="fm-section-title">Catálogo completo</h2>
          </div>
          <div className="fm-section-tools">
            <p className="fm-section-copy">Conocé todos los productos disponibles, con su precio habitual y las ofertas vigentes.</p>
            {selectedCategory && <span className="fm-active-filter">Mostrando: {selectedCategory}</span>}
          </div>
        </div>
        <ProductGrid products={visibleProducts} testIdPrefix="catalog" />
        {visibleProducts.length === 0 && <p className="fm-empty-state">Todavía no hay productos cargados en esta categoría.</p>}
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
          <p className="fm-delivery-copy">¿Necesitás hacer un pedido? Escribinos por WhatsApp y consultá la disponibilidad y las condiciones del servicio de delivery.</p>
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

function getCategoryIcon(category: Category) {
  const normalized = category.toLocaleLowerCase();
  if (normalized.includes('bebid')) return <Beer size={36} strokeWidth={1.4} />;
  if (normalized.includes('láct') || normalized.includes('lact')) return <Milk size={36} strokeWidth={1.4} />;
  if (normalized.includes('congel')) return <Snowflake size={36} strokeWidth={1.4} />;
  return <PackageOpen size={36} strokeWidth={1.4} />;
}

function Categories({ categories, selectedCategory, onSelectCategory }: { categories: Category[]; selectedCategory: Category | null; onSelectCategory: (category: Category | null) => void }) {

  return (
    <section className="fm-section fm-section-tinted fm-categories" id="categorias" data-testid="section-categories">
      <div className="fm-container">
        <div className="fm-section-head">
          <div>
            <span className="fm-eyebrow">Para cada compra</span>
            <h2 className="fm-section-title">Lo que buscás,<br />sin dar mil vueltas.</h2>
          </div>
           <button className="fm-clear-filter" type="button" onClick={() => onSelectCategory(null)} data-testid="button-show-all-products">
             Ver catálogo completo
          </button>
        </div>
        <div className="fm-category-grid">
          {categories.map((category, index) => (
            <button className={`fm-category ${selectedCategory === category ? 'is-selected' : ''}`} type="button" key={category} onClick={() => onSelectCategory(category)} data-testid={`category-${index + 1}`} aria-pressed={selectedCategory === category}>
              <span className="fm-category-icon" aria-hidden="true">{getCategoryIcon(category)}</span>
              <span>{category}</span>
            </button>
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

type OfferDraft = Omit<Offer, 'id'>;

const emptyOfferDraft: OfferDraft = {
  icon: 'package',
  image: '',
  alt: '',
  name: '',
  detail: '',
  price: '',
  offer: '',
  category: 'Almacén',
  comment: '',
};

type AdminTab = 'products' | 'categories' | 'suppliers' | 'users';
type SupplierDraft = Omit<Supplier, 'id'>;
type UserDraft = Omit<AdminUser, 'id'>;

function AdminAccess({
  open,
  offers,
  onChange,
  categories,
  onCategoriesChange,
  suppliers,
  onSuppliersChange,
  users,
  onUsersChange,
  onClose,
}: {
  open: boolean;
  offers: Offer[];
  onChange: (offers: Offer[]) => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  suppliers: Supplier[];
  onSuppliersChange: (suppliers: Supplier[]) => void;
  users: AdminUser[];
  onUsersChange: (users: AdminUser[]) => void;
  onClose: () => void;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [draft, setDraft] = useState<OfferDraft>(emptyOfferDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState('');
  const [categoryDraft, setCategoryDraft] = useState('');
  const [supplierDraft, setSupplierDraft] = useState<SupplierDraft>({ name: '', contact: '' });
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
  const [userDraft, setUserDraft] = useState<UserDraft>({ username: '', password: '', role: 'Editor' });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [managementError, setManagementError] = useState('');

  useEffect(() => {
    if (!open) {
      setAuthenticated(false);
      setUsername('');
      setPassword('');
      setLoginError('');
      setActiveTab('products');
      setEditingId(null);
      setDraft(emptyOfferDraft);
      setCategoryDraft('');
      setSupplierDraft({ name: '', contact: '' });
      setEditingSupplierId(null);
      setUserDraft({ username: '', password: '', role: 'Editor' });
      setEditingUserId(null);
      setManagementError('');
    }
  }, [open]);

  if (!open) return null;

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (users.some((user) => user.username === username && user.password === password)) {
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos.');
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => ({ ...current, image: String(reader.result), alt: current.alt || file.name }));
    reader.readAsDataURL(file);
  };

  const handleDraftChange = (field: keyof OfferDraft, value: string | number | undefined) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setDraft(emptyOfferDraft);
    setEditingId(null);
    setFormError('');
  };

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.price.trim()) {
      setFormError('El nombre y el precio son obligatorios.');
      return;
    }
    const product = {
      ...draft,
      name: draft.name.trim(),
      detail: draft.detail.trim() || 'Consultar presentación',
      alt: draft.alt.trim() || draft.name.trim(),
      price: draft.price.trim(),
      offer: draft.offer?.trim() || '',
      comment: draft.comment?.trim() || '',
    };
    if (editingId === null) {
      onChange([{ ...product, id: Date.now() }, ...offers]);
    } else {
      onChange(offers.map((offer) => offer.id === editingId ? { ...product, id: editingId } : offer));
    }
    resetForm();
  };

  const editProduct = (offer: Offer) => {
    setEditingId(offer.id);
    setDraft({ ...emptyOfferDraft, ...offer });
    setFormError('');
  };

  const deleteProduct = (id: number) => {
    if (window.confirm('¿Eliminar este producto de la lista?')) {
      onChange(offers.filter((offer) => offer.id !== id));
      if (editingId === id) resetForm();
    }
  };

  const addCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = categoryDraft.trim();
    if (!name) return;
    if (categories.some((category) => category.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setManagementError('Esa categoría ya existe.');
      return;
    }
    onCategoriesChange([...categories, name]);
    setCategoryDraft('');
    setManagementError('');
  };

  const deleteCategory = (category: Category) => {
    if (offers.some((offer) => offer.category === category)) {
      setManagementError('No podés eliminar una categoría que todavía tiene productos.');
      return;
    }
    if (window.confirm(`¿Eliminar la categoría ${category}?`)) {
      onCategoriesChange(categories.filter((item) => item !== category));
      setManagementError('');
    }
  };

  const saveSupplier = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supplierDraft.name.trim()) {
      setManagementError('El nombre del proveedor es obligatorio.');
      return;
    }
    const supplier = { name: supplierDraft.name.trim(), contact: supplierDraft.contact?.trim() || '' };
    if (editingSupplierId === null) {
      onSuppliersChange([{ ...supplier, id: Date.now() }, ...suppliers]);
    } else {
      onSuppliersChange(suppliers.map((item) => item.id === editingSupplierId ? { ...supplier, id: editingSupplierId } : item));
    }
    setSupplierDraft({ name: '', contact: '' });
    setEditingSupplierId(null);
    setManagementError('');
  };

  const editSupplier = (supplier: Supplier) => {
    setSupplierDraft({ name: supplier.name, contact: supplier.contact || '' });
    setEditingSupplierId(supplier.id);
    setManagementError('');
  };

  const deleteSupplier = (id: number) => {
    if (window.confirm('¿Eliminar este proveedor?')) {
      onSuppliersChange(suppliers.filter((supplier) => supplier.id !== id));
      onChange(offers.map((offer) => offer.supplierId === id ? { ...offer, supplierId: undefined } : offer));
    }
  };

  const saveUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userDraft.username.trim() || !userDraft.password.trim()) {
      setManagementError('El usuario y la contraseña son obligatorios.');
      return;
    }
    if (users.some((user) => user.username === userDraft.username.trim() && user.id !== editingUserId)) {
      setManagementError('Ese usuario ya existe.');
      return;
    }
    const user = { ...userDraft, username: userDraft.username.trim(), password: userDraft.password.trim(), role: userDraft.role.trim() || 'Editor' };
    if (editingUserId === null) {
      onUsersChange([{ ...user, id: Date.now() }, ...users]);
    } else {
      onUsersChange(users.map((item) => item.id === editingUserId ? { ...user, id: editingUserId } : item));
    }
    setUserDraft({ username: '', password: '', role: 'Editor' });
    setEditingUserId(null);
    setManagementError('');
  };

  const editUser = (user: AdminUser) => {
    setUserDraft({ username: user.username, password: user.password, role: user.role });
    setEditingUserId(user.id);
    setManagementError('');
  };

  const deleteUser = (id: number) => {
    if (users.length === 1) {
      setManagementError('Debe quedar al menos un usuario administrador.');
      return;
    }
    if (window.confirm('¿Eliminar este usuario?')) onUsersChange(users.filter((user) => user.id !== id));
  };

  const tabs: Array<{ id: AdminTab; label: string; icon: ReactNode }> = [
    { id: 'products', label: 'Productos', icon: <ShoppingBasket size={15} /> },
    { id: 'categories', label: 'Categorías', icon: <Tags size={15} /> },
    { id: 'suppliers', label: 'Proveedores', icon: <Store size={15} /> },
    { id: 'users', label: 'Usuarios', icon: <UsersRound size={15} /> },
  ];

  return (
    <div className="fm-admin-backdrop" role="dialog" aria-modal="true" aria-label="Administración de productos">
      <section className="fm-admin-panel">
        <button className="fm-admin-close" type="button" onClick={onClose} aria-label="Cerrar acceso restringido"><X size={20} /></button>
        {!authenticated ? (
          <div className="fm-login-card">
            <span className="fm-admin-kicker"><LockKeyhole size={15} /> Acceso restringido</span>
            <h2>Administrar productos</h2>
            <p>Ingresá con tus credenciales para gestionar las ofertas visibles en la web.</p>
            <form className="fm-login-form" onSubmit={handleLogin}>
              <label>Usuario<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
              <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
              {loginError && <p className="fm-form-error">{loginError}</p>}
              <button className="fm-admin-primary" type="submit">Ingresar <ArrowRight size={16} /></button>
            </form>
          </div>
        ) : (
          <>
            <div className="fm-admin-header">
              <div>
                <span className="fm-admin-kicker"><LockKeyhole size={15} /> Panel privado</span>
                <h2>Productos y ofertas</h2>
                <p>Agregá fotos, precios y comentarios sin tocar las tarjetas públicas.</p>
              </div>
              <button className="fm-admin-logout" type="button" onClick={() => setAuthenticated(false)}><LogOut size={15} /> Salir</button>
            </div>
            <div className="fm-admin-tabs" role="tablist" aria-label="Secciones de administración">
              {tabs.map((tab) => <button className={activeTab === tab.id ? 'is-active' : ''} type="button" role="tab" aria-selected={activeTab === tab.id} key={tab.id} onClick={() => { setActiveTab(tab.id); setManagementError(''); }}>{tab.icon}{tab.label}</button>)}
            </div>
            {managementError && <p className="fm-form-error fm-management-error">{managementError}</p>}
            {activeTab === 'products' && (
              <div className="fm-admin-layout">
                <form className="fm-product-form" onSubmit={saveProduct}>
                  <div className="fm-form-heading"><span>{editingId === null ? 'Nuevo producto' : 'Editar producto'}</span>{editingId === null ? <Plus size={17} /> : <Save size={16} />}</div>
                  <label>Nombre<input value={draft.name} onChange={(event) => handleDraftChange('name', event.target.value)} placeholder="Ej. Yogur natural" required /></label>
                  <label>Detalle<input value={draft.detail} onChange={(event) => handleDraftChange('detail', event.target.value)} placeholder="Presentación o tamaño" /></label>
                  <label>Categoría<select value={draft.category} onChange={(event) => handleDraftChange('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                  <label>Proveedor<select value={draft.supplierId ?? ''} onChange={(event) => handleDraftChange('supplierId', event.target.value ? Number(event.target.value) : undefined)}><option value="">Sin proveedor</option>{suppliers.map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.name}</option>)}</select></label>
                  <div className="fm-form-row">
                    <label>Precio<input value={draft.price} onChange={(event) => handleDraftChange('price', event.target.value)} placeholder="$ 0" required /></label>
                    <label>Oferta opcional<input value={draft.offer} onChange={(event) => handleDraftChange('offer', event.target.value)} placeholder="$ 0" /></label>
                  </div>
                  <label>Comentario opcional<textarea value={draft.comment} onChange={(event) => handleDraftChange('comment', event.target.value)} placeholder="Ej. Solo por esta semana" rows={3} /></label>
                  <label className="fm-file-field"><span>Foto del producto</span><input type="file" accept="image/*" onChange={handlePhotoChange} /><small><ImagePlus size={14} /> JPG, PNG o WebP</small></label>
                  {draft.image && <img className="fm-admin-preview" src={draft.image} alt="Vista previa del producto" />}
                  {formError && <p className="fm-form-error">{formError}</p>}
                  <div className="fm-form-actions">
                    <button className="fm-admin-primary" type="submit">{editingId === null ? 'Agregar producto' : 'Guardar cambios'} <Save size={15} /></button>
                    {editingId !== null && <button className="fm-admin-secondary" type="button" onClick={resetForm}>Cancelar</button>}
                  </div>
                </form>
                <div className="fm-admin-products">
                  <div className="fm-form-heading"><span>Productos cargados ({offers.length})</span></div>
                  <div className="fm-admin-product-list">
                    {offers.map((offer) => (
                      <article className="fm-admin-product-row" key={offer.id}>
                        <div className="fm-admin-product-thumb">{offer.image ? <img src={offer.image} alt="" /> : <OfferIcon icon={offer.icon} />}</div>
                        <div className="fm-admin-product-info"><strong>{offer.name}</strong><small>{offer.category} · {offer.offer ? `${offer.price} / oferta ${offer.offer}` : offer.price}</small></div>
                        <button className="fm-admin-icon-button" type="button" onClick={() => editProduct(offer)} aria-label={`Editar ${offer.name}`}><Save size={15} /></button>
                        <button className="fm-admin-icon-button danger" type="button" onClick={() => deleteProduct(offer.id)} aria-label={`Eliminar ${offer.name}`}><Trash2 size={15} /></button>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'categories' && (
              <div className="fm-admin-layout fm-simple-manager">
                <form className="fm-product-form" onSubmit={addCategory}>
                  <div className="fm-form-heading"><span>Nueva categoría</span><Tags size={17} /></div>
                  <label>Nombre<input value={categoryDraft} onChange={(event) => setCategoryDraft(event.target.value)} placeholder="Ej. Limpieza" required /></label>
                  <button className="fm-admin-primary" type="submit">Agregar categoría <Plus size={15} /></button>
                </form>
                <div className="fm-admin-products"><div className="fm-form-heading"><span>Categorías visibles ({categories.length})</span></div><div className="fm-admin-product-list">{categories.map((category) => <div className="fm-admin-product-row fm-simple-row fm-single-action" key={category}><div className="fm-admin-product-thumb">{getCategoryIcon(category)}</div><div className="fm-admin-product-info"><strong>{category}</strong><small>{offers.filter((offer) => offer.category === category).length} productos</small></div><button className="fm-admin-icon-button danger" type="button" onClick={() => deleteCategory(category)} aria-label={`Eliminar categoría ${category}`}><Trash2 size={15} /></button></div>)}</div></div>
              </div>
            )}
            {activeTab === 'suppliers' && (
              <div className="fm-admin-layout fm-simple-manager">
                <form className="fm-product-form" onSubmit={saveSupplier}>
                  <div className="fm-form-heading"><span>{editingSupplierId === null ? 'Nuevo proveedor' : 'Editar proveedor'}</span><Store size={17} /></div>
                  <label>Nombre<input value={supplierDraft.name} onChange={(event) => setSupplierDraft({ ...supplierDraft, name: event.target.value })} placeholder="Ej. Distribuidora Norte" required /></label>
                  <label>Contacto opcional<input value={supplierDraft.contact} onChange={(event) => setSupplierDraft({ ...supplierDraft, contact: event.target.value })} placeholder="Teléfono o email" /></label>
                  <div className="fm-form-actions"><button className="fm-admin-primary" type="submit">{editingSupplierId === null ? 'Agregar proveedor' : 'Guardar cambios'} <Save size={15} /></button>{editingSupplierId !== null && <button className="fm-admin-secondary" type="button" onClick={() => { setSupplierDraft({ name: '', contact: '' }); setEditingSupplierId(null); }}>Cancelar</button>}</div>
                </form>
                <div className="fm-admin-products"><div className="fm-form-heading"><span>Proveedores ({suppliers.length})</span></div><div className="fm-admin-product-list">{suppliers.length === 0 && <p className="fm-empty-state">Todavía no hay proveedores cargados.</p>}{suppliers.map((supplier) => <div className="fm-admin-product-row fm-simple-row" key={supplier.id}><div className="fm-admin-product-thumb"><Store size={19} /></div><div className="fm-admin-product-info"><strong>{supplier.name}</strong><small>{supplier.contact || 'Sin contacto'}</small></div><button className="fm-admin-icon-button" type="button" onClick={() => editSupplier(supplier)} aria-label={`Editar ${supplier.name}`}><Save size={15} /></button><button className="fm-admin-icon-button danger" type="button" onClick={() => deleteSupplier(supplier.id)} aria-label={`Eliminar ${supplier.name}`}><Trash2 size={15} /></button></div>)}</div></div>
              </div>
            )}
            {activeTab === 'users' && (
              <div className="fm-admin-layout fm-simple-manager">
                <form className="fm-product-form" onSubmit={saveUser}>
                  <div className="fm-form-heading"><span>{editingUserId === null ? 'Nuevo usuario' : 'Editar usuario'}</span><UserPlus size={17} /></div>
                  <label>Usuario<input value={userDraft.username} onChange={(event) => setUserDraft({ ...userDraft, username: event.target.value })} placeholder="Nombre de usuario" required /></label>
                  <label>Contraseña<input type="password" value={userDraft.password} onChange={(event) => setUserDraft({ ...userDraft, password: event.target.value })} placeholder="Contraseña" required /></label>
                  <label>Rol<input value={userDraft.role} onChange={(event) => setUserDraft({ ...userDraft, role: event.target.value })} placeholder="Ej. Editor" /></label>
                  <div className="fm-form-actions"><button className="fm-admin-primary" type="submit">{editingUserId === null ? 'Agregar usuario' : 'Guardar cambios'} <Save size={15} /></button>{editingUserId !== null && <button className="fm-admin-secondary" type="button" onClick={() => { setUserDraft({ username: '', password: '', role: 'Editor' }); setEditingUserId(null); }}>Cancelar</button>}</div>
                </form>
                <div className="fm-admin-products"><div className="fm-form-heading"><span>Usuarios autorizados ({users.length})</span></div><div className="fm-admin-product-list">{users.map((user) => <div className="fm-admin-product-row fm-simple-row" key={user.id}><div className="fm-admin-product-thumb"><UsersRound size={19} /></div><div className="fm-admin-product-info"><strong>{user.username}</strong><small>{user.role}</small></div><button className="fm-admin-icon-button" type="button" onClick={() => editUser(user)} aria-label={`Editar ${user.username}`}><Save size={15} /></button><button className="fm-admin-icon-button danger" type="button" onClick={() => deleteUser(user.id)} aria-label={`Eliminar ${user.username}`}><Trash2 size={15} /></button></div>)}</div></div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
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
  const [offers, setOffers] = useState<Offer[]>(loadOffers);
  const [categories, setCategories] = useState<Category[]>(() => loadStored(categoriesStorageKey, initialCategories));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadStored(suppliersStorageKey, initialSuppliers));
  const [users, setUsers] = useState<AdminUser[]>(() => loadStored(usersStorageKey, initialUsers));
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(offersStorageKey, JSON.stringify(offers));
  }, [offers]);
  useEffect(() => {
    window.localStorage.setItem(categoriesStorageKey, JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    window.localStorage.setItem(suppliersStorageKey, JSON.stringify(suppliers));
  }, [suppliers]);
  useEffect(() => {
    window.localStorage.setItem(usersStorageKey, JSON.stringify(users));
  }, [users]);

  const selectCategory = (category: Category | null) => {
    setSelectedCategory(category);
     window.setTimeout(() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <main className="fm-page">
      <Header onOpenAdmin={() => setAdminOpen(true)} />
      <AdminAccess
        open={adminOpen}
        offers={offers}
        onChange={setOffers}
        categories={categories}
        onCategoriesChange={setCategories}
        suppliers={suppliers}
        onSuppliersChange={setSuppliers}
        users={users}
        onUsersChange={setUsers}
        onClose={() => setAdminOpen(false)}
      />
      <Hero />
      <Offers offers={offers} selectedCategory={selectedCategory} />
      <Catalog offers={offers} selectedCategory={selectedCategory} />
      <Delivery />
      <Branches />
      <Categories categories={categories} selectedCategory={selectedCategory} onSelectCategory={selectCategory} />
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
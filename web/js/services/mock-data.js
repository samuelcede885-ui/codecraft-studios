// Datos de ejemplo usados por los placeholders de api.js. Borrar al conectar la BD.

const RESTAURANT_ID = '00000000-0000-0000-0000-000000000001';
const img = (id) => `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&auto=format`;

export const mockDb = {
  restaurant: {
    id: RESTAURANT_ID,
    name: 'La Trattoria',
    slug: 'la-trattoria',
    description: 'Cocina italiana casera desde 1998',
    currency: 'USD',
    is_published: true,
  },
  branding: {
    restaurant_id: RESTAURANT_ID,
    logo_url: null,
    primary_color: '#C2410C',
    secondary_color: '#6B7280',
    accent_color: '#F59E0B',
    background_color: '#FFFFFF',
    text_color: '#111827',
    font_family: 'Inter',
  },
  categories: [
    { id: 'c1', restaurant_id: RESTAURANT_ID, name: 'Entradas', position: 0, is_active: true },
    { id: 'c2', restaurant_id: RESTAURANT_ID, name: 'Pizzas', position: 1, is_active: true },
    { id: 'c3', restaurant_id: RESTAURANT_ID, name: 'Pastas', position: 2, is_active: true },
    { id: 'c4', restaurant_id: RESTAURANT_ID, name: 'Postres', position: 3, is_active: true },
  ],
  products: [
    { id: 'p1', restaurant_id: RESTAURANT_ID, category_id: 'c1', name: 'Bruschetta', description: 'Pan tostado, tomate, albahaca y aceite de oliva.', price: 6.5, image_url: img('photo-1572695157366-5e585ab2b69f'), tags: ['vegano'], position: 0, is_available: true },
    { id: 'p2', restaurant_id: RESTAURANT_ID, category_id: 'c1', name: 'Burrata', description: 'Burrata cremosa con tomates cherry.', price: 11, image_url: img('photo-1626200419199-391ae4be7a41'), tags: [], position: 1, is_available: true },
    { id: 'p3', restaurant_id: RESTAURANT_ID, category_id: 'c2', name: 'Margarita', description: 'Tomate San Marzano, mozzarella fior di latte y albahaca.', price: 12, image_url: img('photo-1574071318508-1cdbab80d002'), tags: [], position: 2, is_available: true },
    { id: 'p4', restaurant_id: RESTAURANT_ID, category_id: 'c2', name: 'Diavola', description: 'Salami picante, mozzarella y chile.', price: 14, image_url: img('photo-1628840042765-356cda07504e'), tags: ['picante'], position: 3, is_available: true },
    { id: 'p5', restaurant_id: RESTAURANT_ID, category_id: 'c3', name: 'Carbonara', description: 'Guanciale, yema, pecorino y pimienta negra.', price: 13.5, image_url: img('photo-1612874742237-6526221588e3'), tags: [], position: 4, is_available: true },
    { id: 'p6', restaurant_id: RESTAURANT_ID, category_id: 'c3', name: 'Lasaña', description: 'Ragú boloñesa, bechamel y parmesano.', price: 15, image_url: null, tags: [], position: 5, is_available: false },
    { id: 'p7', restaurant_id: RESTAURANT_ID, category_id: 'c4', name: 'Tiramisú', description: 'Mascarpone, café y cacao.', price: 7, image_url: img('photo-1571877227200-a0d98ea607e9'), tags: [], position: 6, is_available: true },
  ],
};

import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Especiales } from './Especiales';
import { CartProvider } from '../../state/cart';
import { UIProvider } from '../../state/ui';
import { PRODUCTS, type Product } from '../../data/menu';

const wrap = (products: Product[]) =>
  render(
    <CartProvider>
      <UIProvider>
        <Especiales products={products} />
      </UIProvider>
    </CartProvider>,
  );

describe('Especiales', () => {
  it('sin especial activo muestra el estado vacío y el archivo, sin botón de pedido', () => {
    wrap(PRODUCTS);
    expect(screen.getByText('Ahora mismo no hay un especial activo.')).toBeTruthy();
    expect(screen.getByText('Especial de septiembre')).toBeTruthy();
    expect(screen.getByText('Terminado')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Añadir al pedido' })).toBeNull();
  });

  it('un especial activo se puede ver y añadir al pedido', () => {
    const activo: Product = { ...PRODUCTS.find((p) => p.id === 'especial-septiembre')!, id: 'especial-prueba', status: 'disponible' };
    wrap([activo]);
    expect(screen.queryByText('Ahora mismo no hay un especial activo.')).toBeNull();
    expect(screen.getByRole('button', { name: 'Ver especial' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Añadir al pedido' })).toBeTruthy();
  });
});

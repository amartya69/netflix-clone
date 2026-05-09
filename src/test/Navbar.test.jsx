/**
 * Navbar tests — unit test (8.13)
 */
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Navbar — unit tests', () => {
  // ---------------------------------------------------------------------------
  // 8.13: Navbar has position sticky, zIndex >= 100, and red "NETFLIX" logo
  // ---------------------------------------------------------------------------
  it('8.13 has position sticky, zIndex >= 100, and red NETFLIX logo', () => {
    render(<Navbar />);

    // Find the container div — it's the root element rendered by Navbar
    // We look for the element that contains the NETFLIX text
    const logo = screen.getByText('NETFLIX');
    expect(logo).toBeInTheDocument();

    // Logo should be red (#e50914) and bold
    // jsdom converts hex colors to rgb() — #e50914 = rgb(229, 9, 20)
    expect(logo.style.color).toBe('rgb(229, 9, 20)');
    expect(logo.style.fontWeight).toBe('bold');

    // Container div is the parent of the logo span
    const container = logo.parentElement;
    expect(container).toBeInTheDocument();

    // Check sticky positioning
    expect(container.style.position).toBe('sticky');
    expect(container.style.top).toBe('0px');

    // zIndex should be >= 100
    const zIndex = parseInt(container.style.zIndex, 10);
    expect(zIndex).toBeGreaterThanOrEqual(100);
  });
});

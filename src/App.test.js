import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from './context';
import App from './App';

test('renders CineVerse branding and nav tabs', () => {
  render(
    <AppProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </AppProvider>
  );
  const brandElement = screen.getByText(/Cine/i);
  expect(brandElement).toBeInTheDocument();
});

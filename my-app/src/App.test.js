// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('Basic Component Checks', () => {
  test('renders at least one header', () => {
    render(<App />);
    // Check for existence rather than specific content
    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
  });

  test('has navigation links', () => {
    render(<App />);
    // Check for presence without worrying about duplicates
    expect(screen.getAllByText(/Home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/News/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/FAQ/i).length).toBeGreaterThan(0);
  });

  test('displays news content', () => {
    render(<App />);
    // Generic checks for news section elements
    expect(screen.getByText(/Latest News/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Update/i).length).toBeGreaterThan(0);
  });

  test('has footer content', () => {
    render(<App />);
    expect(screen.getByText(/RuneScape Fan Site/i)).toBeInTheDocument();
  });
});

describe('Presence Checks', () => {
  test('has interactive elements', () => {
    render(<App />);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
  });
});

test('matches snapshot', () => {
  const { container } = render(<App />);
  expect(container).toMatchSnapshot();
});
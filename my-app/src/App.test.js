
import { render } from '@testing-library/react';
import App from './App';

test('renders homepage', () => {
  const { container } = render(<App />);
  expect(container).toMatchSnapshot();
});
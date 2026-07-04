import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('renders the title and value', () => {
    render(<StatCard title="On-time rate" value="93.4%" color="success" />);
    expect(screen.getByText('On-time rate')).toBeInTheDocument();
    expect(screen.getByText('93.4%')).toBeInTheDocument();
  });

  it('renders an em dash when value is missing', () => {
    render(<StatCard title="Lead time" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});

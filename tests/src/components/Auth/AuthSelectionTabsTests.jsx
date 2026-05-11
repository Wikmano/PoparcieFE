import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthSelectionTabs from '../../../../src/components/Auth/AuthSelectionTabs.jsx';

const tabs = [
  { id: 'tab1', label: 'Zakładka 1', content: <div>Zawartość 1</div> },
  { id: 'tab2', label: 'Zakładka 2', content: <div>Zawartość 2</div> },
];

describe('AuthSelectionTabs', () => {
  it('should return null when tabs array is empty', () => {
    const { container } = render(<AuthSelectionTabs tabs={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render all tab buttons', () => {
    render(<AuthSelectionTabs tabs={tabs} />);
    expect(screen.getByRole('button', { name: 'Zakładka 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zakładka 2' })).toBeInTheDocument();
  });

  it('should show the first tab content by default', () => {
    render(<AuthSelectionTabs tabs={tabs} />);
    expect(screen.getByText('Zawartość 1')).toBeInTheDocument();
  });

  it('should show the defaultTabId tab content when provided', () => {
    render(<AuthSelectionTabs tabs={tabs} defaultTabId="tab2" />);
    expect(screen.getByText('Zawartość 2')).toBeInTheDocument();
  });

  it('should switch content when a tab button is clicked', () => {
    render(<AuthSelectionTabs tabs={tabs} />);
    fireEvent.click(screen.getByRole('button', { name: 'Zakładka 2' }));
    expect(screen.getByText('Zawartość 2')).toBeInTheDocument();
  });

  it('should mark the active tab button with "active" class', () => {
    render(<AuthSelectionTabs tabs={tabs} defaultTabId="tab1" />);
    const tab1Btn = screen.getByRole('button', { name: 'Zakładka 1' });
    expect(tab1Btn.className).toContain('active');
  });

  it('should remove "active" class from previous tab after switching', () => {
    render(<AuthSelectionTabs tabs={tabs} defaultTabId="tab1" />);
    fireEvent.click(screen.getByRole('button', { name: 'Zakładka 2' }));
    const tab1Btn = screen.getByRole('button', { name: 'Zakładka 1' });
    expect(tab1Btn.className).not.toContain('active');
  });
});

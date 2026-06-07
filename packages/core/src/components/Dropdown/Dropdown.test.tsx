import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dropdown } from './index';
import { Menu, MenuItem } from '../Menu';
import { Button } from '../Button';

const overlay = (
  <Menu>
    <MenuItem key="1">Edit</MenuItem>
    <MenuItem key="2">Delete</MenuItem>
  </Menu>
);

describe('Dropdown Component', () => {
  it('renders the trigger element', () => {
    render(
      <Dropdown overlay={overlay}>
        <Button>Actions</Button>
      </Dropdown>
    );
    expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
  });

  it('renders overlay menu items when visible', async () => {
    render(
      <Dropdown overlay={overlay} visible>
        <Button>Open</Button>
      </Dropdown>
    );
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('does not show overlay when visible is false', () => {
    render(
      <Dropdown overlay={overlay} visible={false}>
        <Button>Closed</Button>
      </Dropdown>
    );
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});

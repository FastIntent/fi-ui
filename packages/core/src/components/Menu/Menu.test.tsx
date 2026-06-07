import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Menu, MenuItem, SubMenu } from './index';

describe('Menu Component', () => {
  it('renders menu items correctly', async () => {
    await act(async () => {
      render(
        <Menu>
          <MenuItem key="home">Home</MenuItem>
          <MenuItem key="about">About</MenuItem>
        </Menu>
      );
    });
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('applies base prefix class', async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <Menu>
          <MenuItem key="1">Item</MenuItem>
        </Menu>
      ));
    });
    expect(container.querySelector('.atom-menu')).toBeInTheDocument();
  });

  it('applies sidebar class when sidebar prop is true', async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <Menu sidebar>
          <MenuItem key="1">Item</MenuItem>
        </Menu>
      ));
    });
    expect(container.querySelector('.atom-menu-sidebar')).toBeInTheDocument();
  });

  it('applies horizontal mode class', async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(
        <Menu mode="horizontal">
          <MenuItem key="1">Item</MenuItem>
        </Menu>
      ));
    });
    expect(container.querySelector('.atom-menu-horizontal')).toBeInTheDocument();
  });

  it('renders SubMenu with title', async () => {
    await act(async () => {
      render(
        <Menu defaultOpenKeys={['sub1']}>
          <SubMenu key="sub1" title="Settings">
            <MenuItem key="profile">Profile</MenuItem>
          </SubMenu>
        </Menu>
      );
    });
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});

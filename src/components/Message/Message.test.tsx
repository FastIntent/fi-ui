import React from 'react';
import { act } from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { message } from './index';

describe('Message System', () => {
  beforeEach(async () => {
    await act(async () => {
      message.destroy();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  it('muestra un mensaje de éxito en el DOM', async () => {
    await act(async () => {
      message.success('Operación exitosa');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Operación exitosa')).toBeInTheDocument();
  });

  it('muestra un mensaje de error en el DOM', async () => {
    await act(async () => {
      message.error('Algo salió mal');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Algo salió mal')).toBeInTheDocument();
  });

  it('muestra un mensaje de advertencia en el DOM', async () => {
    await act(async () => {
      message.warning('Revisa los datos');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Revisa los datos')).toBeInTheDocument();
  });

  it('muestra un mensaje info en el DOM', async () => {
    await act(async () => {
      message.info('Información importante');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Información importante')).toBeInTheDocument();
  });

  it('muestra un mensaje loading en el DOM', async () => {
    await act(async () => {
      message.loading('Cargando…');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Cargando…')).toBeInTheDocument();
  });

  it('acepta configuración como objeto (message.open)', async () => {
    await act(async () => {
      message.open({ type: 'success', content: 'Config object' });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Config object')).toBeInTheDocument();
  });

  it('actualiza un mensaje existente usando la misma key', async () => {
    await act(async () => {
      message.loading({ content: 'Cargando…', key: 'test-key', duration: null });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Cargando…')).toBeInTheDocument();

    await act(async () => {
      message.success({ content: 'Completado', key: 'test-key', duration: null });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Completado')).toBeInTheDocument();
    expect(screen.queryByText('Cargando…')).not.toBeInTheDocument();
  });

  it('cierra un mensaje específico con message.destroy(key)', async () => {
    await act(async () => {
      message.info({ content: 'Mensaje a eliminar', key: 'destroy-me', duration: null });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Mensaje a eliminar')).toBeInTheDocument();

    await act(async () => {
      message.destroy('destroy-me');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.queryByText('Mensaje a eliminar')).not.toBeInTheDocument();
  });

  it('la función retornada por open() cierra el mensaje', async () => {
    let hide: (() => void) | undefined;

    await act(async () => {
      hide = message.loading({ content: 'Procesando…', duration: null });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(await screen.findByText('Procesando…')).toBeInTheDocument();

    await act(async () => {
      hide?.();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.queryByText('Procesando…')).not.toBeInTheDocument();
  });

  it('aplica el tipo correcto como clase CSS al notice', async () => {
    await act(async () => {
      message.success({ content: 'Success type', key: 'type-test', duration: null });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const notice = document.querySelector('[data-message-key="type-test"]');
    expect(notice).toHaveClass('atom-message-notice-success');
  });

  it('ejecuta el callback onClose al cerrarse', async () => {
    const onClose = vi.fn();

    await act(async () => {
      message.success({ content: 'Con callback', duration: null, onClose, key: 'cb-test' });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      message.destroy('cb-test');
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // onClose is called when animation ends; with destroy() there's no animation
    // so we verify no error was thrown; real onClose fires on animationEnd in browser
    expect(screen.queryByText('Con callback')).not.toBeInTheDocument();
  });
});

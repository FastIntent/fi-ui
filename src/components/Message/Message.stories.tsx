import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Space } from '../Space/Space';
import { message } from './useMessage';

const meta: Meta = {
  title: 'Components/Message',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;

// ─── Types ────────────────────────────────────────────────────────────────────
export const Types: StoryObj = {
  name: 'Tipos',
  render: () => (
    <Space size="middle" wrap>
      <Button type="primary" onClick={() => message.success('Operación completada con éxito.')}>
        Success
      </Button>
      <Button onClick={() => message.error('Ocurrió un error inesperado.')}>Error</Button>
      <Button onClick={() => message.warning('Revisa los datos antes de continuar.')}>
        Warning
      </Button>
      <Button onClick={() => message.info('Tienes 3 nuevas notificaciones.')}>Info</Button>
    </Space>
  ),
};

// ─── Loading ──────────────────────────────────────────────────────────────────
export const Loading: StoryObj = {
  name: 'Loading / Cancelar',
  render: () => {
    const hideRef = useRef<(() => void) | null>(null);

    const handleStart = () => {
      hideRef.current = message.loading('Guardando cambios…', null);
    };

    const handleStop = () => {
      hideRef.current?.();
      message.success('Guardado correctamente.');
    };

    return (
      <Space size="middle">
        <Button type="primary" onClick={handleStart}>
          Iniciar carga
        </Button>
        <Button onClick={handleStop}>Finalizar</Button>
      </Space>
    );
  },
};

// ─── Duration ─────────────────────────────────────────────────────────────────
export const Duration: StoryObj = {
  name: 'Duración personalizada',
  render: () => (
    <Space size="middle" wrap>
      <Button onClick={() => message.info('Cierra en 1 segundo.', 1)}>1s</Button>
      <Button onClick={() => message.info('Cierra en 5 segundos.', 5)}>5s</Button>
      <Button onClick={() => message.info('No se cierra automáticamente.', null)}>
        Sin auto-cierre
      </Button>
      <Button type="primary" danger onClick={() => message.destroy()}>
        Cerrar todos
      </Button>
    </Space>
  ),
};

// ─── onClose callback ─────────────────────────────────────────────────────────
export const OnClose: StoryObj = {
  name: 'Callback onClose',
  render: () => (
    <Button
      type="primary"
      onClick={() =>
        message.success('Mensaje cerrado.', 2, () => {
          message.info('El mensaje anterior se cerró.');
        })
      }
    >
      Mostrar con callback
    </Button>
  ),
};

// ─── Update by key ────────────────────────────────────────────────────────────
export const UpdateByKey: StoryObj = {
  name: 'Actualizar por key',
  render: () => {
    const handleUpdate = () => {
      message.loading({ content: 'Cargando datos…', key: 'update-demo', duration: null });

      setTimeout(() => {
        message.success({ content: '¡Datos cargados!', key: 'update-demo', duration: 2 });
      }, 2000);
    };

    return (
      <Button type="primary" onClick={handleUpdate}>
        Cargar datos
      </Button>
    );
  },
};

// ─── Custom icon ──────────────────────────────────────────────────────────────
export const CustomIcon: StoryObj = {
  name: 'Icono personalizado',
  render: () => (
    <Button
      type="primary"
      onClick={() =>
        message.open({
          content: 'Mensaje con icono custom.',
          duration: 3,
          icon: (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              ✦
            </span>
          ),
        })
      }
    >
      Icono custom
    </Button>
  ),
};

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Steps, Step } from './Steps';
import { Tag } from '../Tag';

const meta: Meta<typeof Steps> = {
  title: 'Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Steps>;

export const Default: Story = {
  render: () => (
    <Steps current={1}>
      <Step title="Finished" description="This is a description." />
      <Step title="In Progress" description="This is a description." />
      <Step title="Waiting" description="This is a description." />
    </Steps>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Steps current={1} direction="vertical">
      <Step title="Finishedx" description="This is a description." />
      <Step title="In Progress" description="This is a description." />
      <Step title="Waiting" description="This is a description." />
    </Steps>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <Steps current={1} status="error">
      <Step title="Finished" />
      <Step title="In Progress" />
      <Step title="Waiting" />
    </Steps>
  ),
};

export const AllFinished: Story = {
  render: () => (
    <Steps current={3}>
      <Step title="Step 1" status="finish" />
      <Step title="Step 2" status="finish" />
      <Step title="Step 3" status="finish" />
    </Steps>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <p style={{ marginBottom: 12, fontWeight: 600 }}>Small (24px)</p>
        <Steps current={1} size="small">
          <Step title="Cuenta creada" description="Registro completado" />
          <Step title="Verificación" description="Confirma tu email" />
          <Step title="Listo" description="Todo configurado" />
        </Steps>
      </div>
      <div>
        <p style={{ marginBottom: 12, fontWeight: 600 }}>Middle — default (32px)</p>
        <Steps current={1} size="middle">
          <Step title="Cuenta creada" description="Registro completado" />
          <Step title="Verificación" description="Confirma tu email" />
          <Step title="Listo" description="Todo configurado" />
        </Steps>
      </div>
    </div>
  ),
};

export const SizesDetailed: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <p style={{ marginBottom: 12, fontWeight: 600 }}>Small (22px)</p>
        <Steps current={1} variant="detailed" size="small" showStepNumber style={{ maxWidth: 620 }}>
          <Step title="Generar AppGraph" description="Construyendo el contrato semántico">
            <Tag color="success">✓ Completado</Tag>
            <span>512ms</span>
          </Step>
          <Step title="Generar SQL" description="Derivando esquema y relaciones">
            <Tag color="processing">⏳ En progreso</Tag>
          </Step>
          <Step title="Ensamblar Proyecto" description="Generando archivos" />
        </Steps>
      </div>
      <div>
        <p style={{ marginBottom: 12, fontWeight: 600 }}>Middle — default (28px)</p>
        <Steps
          current={1}
          variant="detailed"
          size="middle"
          showStepNumber
          style={{ maxWidth: 620 }}
        >
          <Step title="Generar AppGraph" description="Construyendo el contrato semántico">
            <Tag color="success">✓ Completado</Tag>
            <span>512ms</span>
          </Step>
          <Step title="Generar SQL" description="Derivando esquema y relaciones">
            <Tag color="processing">⏳ En progreso</Tag>
          </Step>
          <Step title="Ensamblar Proyecto" description="Generando archivos" />
        </Steps>
      </div>
    </div>
  ),
};

export const Detailed: Story = {
  render: () => (
    <Steps current={6} variant="detailed" showStepNumber style={{ maxWidth: 780 }}>
      <Step
        stepNumber={1}
        title="Generar AppGraph"
        description="Construyendo el contrato semántico del dominio"
      />
      <Step title="Generar SQL (Postgres)" description="Derivando esquema y relaciones">
        <code>schema.sql</code>
        <Tag color="success">✓ Completado</Tag>
        <span>842ms</span>
      </Step>
      <Step
        title="Mapeo de habilidades (Skills)"
        description="Seleccionando y verificando preservación"
      >
        <code>skills-map.json</code>
        <Tag color="success">✓ Completado</Tag>
        <span>210ms</span>
      </Step>
      <Step title="Ensamblar Proyecto (Next.js)" description="Generando archivos de la aplicación">
        <code>/project</code>
        <Tag color="success">✓ Completado</Tag>
        <span>1.23s</span>
      </Step>
      <Step title="Verificar Estática" description="Typecheck, lint, build">
        <code>static-report.json</code>
        <Tag color="success">✓ Completado</Tag>
        <span>1.05s</span>
      </Step>
      <Step title="Levantar Runtime" description="Iniciando Next.js y esperando hidratación">
        <code>runtime.log</code>
        <Tag color="success">✓ Completado</Tag>
        <span>2.14s</span>
      </Step>
      <Step title="Probar Flujo Interactivo (P6)" description="Navegación, submit y persistencia">
        <Tag color="processing">⏳ En progreso (4/5)</Tag>
        <span>3.42s</span>
      </Step>
      <Step title="Generar Reporte Final" description="Consolidando resultados y artefactos">
        <code>report.json</code>
        <Tag>⏱ Pendiente</Tag>
      </Step>
    </Steps>
  ),
};

export const DetailedWithError: Story = {
  render: () => (
    <Steps current={2} status="error" variant="detailed" style={{ maxWidth: 780 }}>
      <Step title="Validar esquema" description="Verificando tipos y restricciones">
        <code>schema.json</code>
        <Tag color="success">✓ Completado</Tag>
        <span>120ms</span>
      </Step>
      <Step title="Ejecutar migraciones" description="Aplicando cambios a la base de datos">
        <code>migrations/</code>
        <Tag color="success">✓ Completado</Tag>
        <span>340ms</span>
      </Step>
      <Step title="Seeding inicial" description="Error de clave foránea en tabla reservas">
        <code>seed.sql</code>
        <Tag color="error">✗ Error</Tag>
        <span>55ms</span>
      </Step>
      <Step title="Verificar integridad" description="Comprobando relaciones y constraints">
        <code>integrity.log</code>
        <Tag>⏱ Pendiente</Tag>
      </Step>
    </Steps>
  ),
};

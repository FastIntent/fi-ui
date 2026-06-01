# Ejemplo de uso en Next.js (App Router)

### 1. Configuración Global (`app/layout.tsx`)

Importa los estilos en tu layout raíz para aplicar los tokens de diseño.

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font-google';
import 'fast-ui/design-system.css'; // Estilos base de la librería
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Fast App',
  description: 'Next.js app with fast-ui',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 2. Uso de Componentes en un Client Component (`app/page.tsx`)

Puesto que algunos componentes usan eventos (onClick) o hooks (useState), es
recomendable usarlos en Client Components.

```tsx
'use client';

import React, { useState } from 'react';
import { Button, Input, Modal, Title, Text } from 'fast-ui';

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Bienvenido a fast-ui</Title>
      <Text type="secondary">Una librería ligera para proyectos rápidos.</Text>

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <Button type="primary" onClick={() => setOpen(true)}>
          Abrir Modal
        </Button>
        <Button>Otro Botón</Button>
      </div>

      <div style={{ marginTop: 24 }}>
        <Input placeholder="Escribe algo..." allowClear />
      </div>

      <Modal
        title="Hola mundo"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <p>Este es un modal cargado desde fast-ui.</p>
        <Input placeholder="Prueba dentro del modal" />
      </Modal>
    </div>
  );
}
```

### 3. Tree-shaking Óptimo

Si solo necesitas el botón, puedes importar directamente el componente:

```tsx
import { Button } from 'fast-ui/Button';
```

Nota: Asegúrate de tener configurado los estilos CSS en tu proyecto.

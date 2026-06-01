# Input

Campo de entrada de texto versátil con soporte para prefijos, sufijos y estados
de validación.

## Importación

```tsx
import { Input } from 'fast-ui';
// o
import { Input } from 'fast-ui/Input';
```

## Props

| Prop          | Tipo                                        | Default    | Descripción                                |
| ------------- | ------------------------------------------- | ---------- | ------------------------------------------ |
| `size`        | `'large' \| 'middle' \| 'small'`            | `'middle'` | Tamaño del input                           |
| `status`      | `'error' \| 'warning'`                      | -          | Estado de validación                       |
| `prefix`      | `React.ReactNode`                           | -          | Icono o elemento prefijo                   |
| `suffix`      | `React.ReactNode`                           | -          | Icono o elemento sufijo                    |
| `allowClear`  | `boolean \| { clearIcon: React.ReactNode }` | `false`    | Muestra un icono para limpiar el contenido |
| `disabled`    | `boolean`                                   | `false`    | Desactiva el input                         |
| `placeholder` | `string`                                    | -          | Texto de marcador                          |

> [!NOTE] Este componente utiliza `rc-input`, proporcionando una gestión
> superior del foco y soporte nativo para prefijos y sufijos en el DOM.

## Ejemplos

### Básico

```tsx
<Input placeholder="Basic usage" />
```

### Prefijos y Sufijos

```tsx
<Input prefix={<UserOutlined />} placeholder="Username" />
<Input suffix=".com" placeholder="Domain name" />
```

### Con estados de error

```tsx
<Input status="error" placeholder="Error status" />
```

# Button

Botón versátil con soporte para diferentes tamaños, tipos y efectos.

## Importación

```tsx
import { Button } from 'fast-ui';
// o
import { Button } from 'fast-ui/Button';
```

## Props

| Prop       | Tipo                                                                 | Default     | Descripción                                          |
| ---------- | -------------------------------------------------------------------- | ----------- | ---------------------------------------------------- |
| `type`     | `'default' \| 'primary' \| 'dashed' \| 'link' \| 'text' \| 'danger'` | `'default'` | El estilo visual del botón                           |
| `size`     | `'large' \| 'middle' \| 'small'`                                     | `'middle'`  | El tamaño físico del botón                           |
| `danger`   | `boolean`                                                            | `false`     | Indica si el botón representa una acción destructiva |
| `disabled` | `boolean`                                                            | `false`     | Desactiva la interacción con el botón                |
| `loading`  | `boolean`                                                            | `false`     | Muestra un indicador de carga y bloquea el botón     |
| `block`    | `boolean`                                                            | `false`     | El botón ocupará todo el ancho del contenedor        |
| `htmlType` | `'button' \| 'submit' \| 'reset'`                                    | `'button'`  | El atributo `type` nativo de HTML                    |

## Ejemplos

### Tipos de botones

```tsx
<Button type="primary">Primary Button</Button>
<Button>Default Button</Button>
<Button type="dashed">Dashed Button</Button>
<Button type="text">Text Button</Button>
<Button type="link">Link Button</Button>
```

### Estados

```tsx
<Button loading type="primary">Loading...</Button>
<Button disabled>Disabled Button</Button>
<Button danger>Danger Button</Button>
```

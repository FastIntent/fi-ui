# Typography

Sistema de tipografía para títulos, textos y párrafos.

## Importación

```tsx
import { Title, Text, Paragraph } from 'Atomize UI';
// o
import { Title, Text, Paragraph } from 'Atomize UI/Typography';
```

## Props (Comunes)

| Prop        | Tipo                                                                      | Default | Descripción                    |
| ----------- | ------------------------------------------------------------------------- | ------- | ------------------------------ |
| `color`     | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info'` | -       | Define un color preestablecido |
| `strong`    | `boolean`                                                                 | `false` | Texto en negrita               |
| `italic`    | `boolean`                                                                 | `false` | Texto en cursiva               |
| `underline` | `boolean`                                                                 | `false` | Texto subrayado                |
| `delete`    | `boolean`                                                                 | `false` | Texto tachado                  |
| `disabled`  | `boolean`                                                                 | `false` | Estado deshabilitado           |

## Props (Título)

| Prop    | Tipo                    | Default | Descripción                    |
| ------- | ----------------------- | ------- | ------------------------------ |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | `1`     | Nivel del título (`h1` a `h5`) |

## Ejemplos

### Títulos

```tsx
<Title>Nivel 1</Title>
<Title level={2}>Nivel 2</Title>
<Title level={3}>Nivel 3</Title>
```

### Textos

```tsx
<Text strong>Negrita</Text>
<Text italic>Cursiva</Text>
<Text type="secondary">Secundario</Text>
<Text type="danger">Error</Text>
```

### Párrafos

```tsx
<Paragraph>Este es un párrafo...</Paragraph>
<Paragraph copyable>Párrafo que se puede copiar...</Paragraph>
```

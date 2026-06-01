# Form

Potente sistema de gestión de formularios y validación basado en
`rc-field-form`.

## Importación

```tsx
import { Form, useForm } from 'fast-ui';
// o
import { Form, useForm } from 'fast-ui/Form';
```

## Form Props

| Prop             | Tipo                                     | Default      | Descripción                              |
| ---------------- | ---------------------------------------- | ------------ | ---------------------------------------- |
| `layout`         | `'horizontal' \| 'vertical' \| 'inline'` | `'vertical'` | Disposición del formulario               |
| `form`           | `FormInstance`                           | -            | Instancia del formulario (vía `useForm`) |
| `onFinish`       | `(values: any) => void`                  | -            | Callback tras validación exitosa         |
| `onFinishFailed` | `(errorInfo: any) => void`               | -            | Callback tras fallo en validación        |
| `initialValues`  | `object`                                 | -            | Valores iniciales del formulario         |

## Form.Item Props

| Prop       | Tipo                             | Default | Descripción                                           |
| ---------- | -------------------------------- | ------- | ----------------------------------------------------- |
| `name`     | `string \| (string \| number)[]` | -       | Nombre del campo (clave en el objeto de valores)      |
| `label`    | `React.ReactNode`                | -       | Etiqueta del campo                                    |
| `rules`    | `Rule[]`                         | -       | Reglas de validación                                  |
| `required` | `boolean`                        | `false` | Indica si es obligatorio (visual y validación básica) |

## Ejemplos

### Formulario Básico

```tsx
const [form] = useForm();

const onFinish = (values) => {
  console.log('Success:', values);
};

return (
  <Form form={form} onFinish={onFinish} layout="vertical">
    <Form.Item
      label="Usuario"
      name="username"
      rules={[{ required: true, message: 'Por favor, ingresa tu usuario' }]}
    >
      <Input placeholder="Nombre de usuario" />
    </Form.Item>

    <Form.Item
      label="Contraseña"
      name="password"
      rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
    >
      <Input type="password" placeholder="Contraseña" />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Enviar
      </Button>
    </Form.Item>
  </Form>
);
```

### Integración con Input Status

`Form.Item` detecta automáticamente errores de validación e inyecta
`status="error"` en el componente hijo (como `Input`), disparando los estilos de
error correspondientes.

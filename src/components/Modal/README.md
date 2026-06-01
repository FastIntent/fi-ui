# Modal

Contenedor de diálogo que se superpone a todo el contenido de la página.

## Importación

```tsx
import { Modal } from 'fast-ui';
// o
import { Modal } from 'fast-ui/Modal';
```

## Props

| Prop             | Tipo               | Default | Descripción                                                 |
| ---------------- | ------------------ | ------- | ----------------------------------------------------------- |
| `open`           | `boolean`          | `false` | Control de visibilidad del modal                            |
| `title`          | `React.ReactNode`  | -       | Título en la cabecera                                       |
| `onCancel`       | `() => void`       | -       | Función llamada al cerrar el modal                          |
| `onOk`           | `() => void`       | -       | Función llamada al pulsar en el botón OK de la cabecera/pie |
| `footer`         | `React.ReactNode`  | -       | Pie de página personalizado                                 |
| `width`          | `number \| string` | `520`   | Ancho del modal                                             |
| `centered`       | `boolean`          | `false` | Posicionamiento centralizado                                |
| `maskClosable`   | `boolean`          | `true`  | Indica si cerrar el modal al pulsar en la máscara           |
| `destroyOnClose` | `boolean`          | `false` | Indica si desmontar el contenido del modal al cerrarlo      |
| `zIndex`         | `number`           | `1000`  | El nivel de profundidad (z-index) del modal                 |

> [!NOTE] Este componente está basado en `rc-dialog`, lo que garantiza un manejo
> robusto del foco y accesibilidad (WAI-ARIA).

## Ejemplos

### Básico

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);

const showModal = () => setIsModalOpen(true);
const handleOk = () => setIsModalOpen(false);
const handleCancel = () => setIsModalOpen(false);

return (
  <>
    <Button type="primary" onClick={showModal}>
      Abrir Modal
    </Button>
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Contenido del modal...</p>
    </Modal>
  </>
);
```

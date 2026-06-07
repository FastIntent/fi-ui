# Chromatic Visual Regression — Setup & Workflow

## Pre-requisitos

1. Cuenta en [chromatic.com](https://chromatic.com) (el plan gratuito cubre
   5,000 snapshots/mes).
2. El proyecto `@atomizeui/core` enlazado en el dashboard de Chromatic.
3. El **Project Token** disponible.

---

## Configuración inicial (una sola vez)

### 1. Obtener el Project Token

En el dashboard de Chromatic → tu proyecto → **Manage** → **Configure** → copia
el token.

### 2. Añadir el token como GitHub Secret

```
Repo GitHub → Settings → Secrets and variables → Actions
→ New repository secret
  Name:  CHROMATIC_PROJECT_TOKEN
  Value: <tu token>
```

### 3. Establecer el baseline visual

El baseline es el conjunto de snapshots "aprobados" contra el cual Chromatic
comparará cada PR futuro. Para establecerlo:

```bash
# Primera ejecución — sube todos los stories y los acepta como baseline
CHROMATIC_PROJECT_TOKEN=<token> pnpm run chromatic
```

O desde el dashboard de Chromatic, acepta todos los cambios del primer build.

---

## Flujo de trabajo en PRs

```
Developer abre PR
        │
        ▼
CI principal (ci.yml)          Chromatic (chromatic.yml)
  typecheck ✓                     Compara cada story
  test ✓                          con el baseline
  build ✓                                │
  size-check ✓                  ┌────────┴────────┐
  build-storybook ✓             │                 │
        │                  Sin cambios       Con cambios
        ▼                  visuales           visuales
   PR puede mergearse      PR ✓ pasa         PR ✗ bloqueado
   si CI pasa                                hasta revisión
                                             en chromatic.com
```

Chromatic añade automáticamente un **PR check** en GitHub llamado `UI Tests` y
`UI Review`. Ambos deben estar en verde para que el PR pueda mergearse.

---

## TurboSnap — Optimización de snapshots

La opción `"onlyChanged": true` en `chromatic.config.json` activa **TurboSnap**:
Chromatic analiza el diff del PR y solo captura snapshots de los stories que
dependen de archivos modificados.

**Resultado:** En lugar de procesar todos los ~100+ stories en cada PR,
Chromatic procesa solo los afectados — reduciendo tiempo y coste de snapshots
hasta un 80%.

**Requisito:** El workflow usa `fetch-depth: 0` para que git tenga el historial
completo, que TurboSnap necesita para calcular el diff.

---

## Revisar y aceptar cambios

Cuando un PR modifica visualmente un componente (intencional o accidentalmente):

1. Ve al link de Chromatic en los checks del PR.
2. Revisa cada snapshot con diff.
3. Si el cambio es **intencional** → **Accept** → el nuevo snapshot se convierte
   en baseline.
4. Si el cambio es **accidental** → **Deny** → el PR queda bloqueado hasta que
   se corrija.

---

## Modo local

Para correr Chromatic desde tu máquina antes de abrir un PR:

```bash
# Requiere tener CHROMATIC_PROJECT_TOKEN en el entorno o en .env.local
export CHROMATIC_PROJECT_TOKEN=<token>
pnpm run chromatic
```

El resultado muestra una URL con el build de Chromatic donde puedes revisar
visualmente todos los stories comparados.

---

## Archivos creados/modificados

| Archivo                              | Propósito                                                        |
| ------------------------------------ | ---------------------------------------------------------------- |
| `chromatic.config.json`              | Configuración del proyecto (TurboSnap, autoAccept en main, etc.) |
| `.github/workflows/chromatic.yml`    | Workflow de CI dedicado para regresión visual                    |
| `package.json` → `scripts.chromatic` | Script para ejecución local                                      |
| `.storybook/main.ts`                 | Ya tenía `@chromatic-com/storybook` registrado ✓                 |

---

## FAQ

**¿Por qué está en un workflow separado (`chromatic.yml`) y no en `ci.yml`?**

Chromatic gestiona su propio sistema de bloqueo de PRs a través de GitHub
Checks. No necesita que su workflow falle para bloquear el merge — lo hace a
través de su propia API. Mantenerlo separado permite que el CI principal (tests,
build, types) se ejecute en paralelo, reduciendo el tiempo total del pipeline.

**¿Qué pasa con `autoAcceptChanges: true` en `main`?**

Cada push directo a `main` (hotfixes, merges) actualiza automáticamente el
baseline sin requerir revisión humana. Esto evita que el historial de Chromatic
acumule "cambios pendientes" tras cada merge.

**¿`exitZeroOnChanges: true` no esconde los problemas?**

No. El workflow de Chromatic siempre termina con exit 0, pero el **PR check** de
GitHub que Chromatic añade sí falla cuando hay cambios sin revisar. La
distinción es importante: el workflow solo descarga y envía los snapshots; el
bloqueo real lo gestiona el check de Chromatic en la UI de GitHub.

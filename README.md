# Aplicación de Finanzas Personales - Guía Completa del Proyecto

## 📋 Tabla de Contenidos

1. [Resumen Rápido](#resumen-rápido)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Documentación Principal](#documentación-principal)
4. [Primeros Pasos](#primeros-pasos)
5. [Comandos Principales](#comandos-principales)
6. [Fases de Desarrollo](#fases-de-desarrollo)
7. [Herramientas y Tecnologías](#herramientas-y-tecnologías)
8. [Principios del Proyecto](#principios-del-proyecto)

---

## 🎯 Resumen Rápido

**Aplicación de Finanzas Personales** es una app web intuitiva para gestionar ingresos, gastos y visualizar patrones financieros.

**Estado**: Fase de Planificación ✅ | Inicio de Desarrollo: Listo

**Versión Objetivo**: 1.0 (MVP) - Usuario único, almacenamiento local

**Stack**: React + Tailwind CSS + Recharts + IndexedDB

---

## 📂 Estructura del Proyecto

```
mi-proyecto-nuevo/
├── prd-finanzas-personales.md          # Especificación completa del producto
├── .specify/                            # Framework Spec-Driven Development
│   ├── memory/
│   │   ├── constitution.md              # Principios del proyecto ✅
│   │   └── guidance.md                  # Guía de desarrollo
│   ├── scripts/bash/
│   │   ├── speckit.sh                   # CLI principal
│   │   ├── create-new-feature.sh        # Crear features
│   │   ├── setup-plan.sh                # Planes de implementación
│   │   ├── check-prerequisites.sh       # Validar prerequisitos
│   │   ├── update-agent-context.sh      # Contexto de agentes IA
│   │   ├── common.sh                    # Funciones compartidas
│   │   └── README.md                    # Documentación de scripts ✅
│   └── templates/
│       ├── spec-template.md
│       ├── plan-template.md
│       ├── tasks-template.md
│       └── agent-file-template.md
├── specs/                               # Especificaciones de features
│   ├── 001-core-structure/
│   ├── 002-transaction-crud/
│   └── ...
├── src/                                 # Código fuente (por crear)
├── tests/                               # Tests (por crear)
└── docs/                                # Documentación adicional
```

---

## 📚 Documentación Principal

### ✅ Documentos Completados

1. **prd-finanzas-personales.md**
   - Especificación completa del producto
   - Todas las features, requisitos y criterios de éxito
   - Planes de implementación sugerido (8 semanas)
   - Modelo de datos detallado

2. **.specify/memory/constitution.md**
   - Principios inviolables del proyecto
   - Stack tecnológico requerido
   - Requisitos de rendimiento
   - Fases de desarrollo con criterios de éxito
   - Quality gates obligatorios
   - Governance del proyecto

3. **.specify/scripts/bash/README.md**
   - Documentación de todos los scripts disponibles
   - Ejemplos de uso
   - Troubleshooting
   - Convenciones del proyecto

---

## 🚀 Primeros Pasos

### 1. Clonar y Configurar el Proyecto

```bash
cd mi-proyecto-nuevo
chmod +x .specify/scripts/bash/*.sh
```

### 2. Inicializar Estructura Specify

```bash
./.specify/scripts/bash/speckit.sh init --with-git
```

### 3. Crear Primera Feature (Core Estructura)

```bash
./.specify/scripts/bash/speckit.sh feature "Setup React project structure and development environment"
```

### 4. Crear Plan de Implementación

```bash
./.specify/scripts/bash/speckit.sh plan
```

### 5. Verificar Todo está Listo

```bash
./.specify/scripts/bash/speckit.sh check --json
```

---

## 💻 Comandos Principales

### Framework Specify

```bash
# Inicializar proyecto
speckit init --with-git

# Crear nueva feature
speckit feature "Descripción de feature"

# Crear plan de implementación
speckit plan

# Verificar prerequisitos
speckit check --json

# Actualizar contexto de agentes IA
speckit context                          # Todos los agentes
speckit context claude                   # Solo Claude
```

### Git Workflow

```bash
# Ver todas las features
git branch -a

# Cambiar a feature específica
git checkout 001-core-structure

# Ver cambios en feature actual
git diff main

# Hacer commit
git commit -m "[001] Setup React project structure"

# Push a feature branch
git push origin 001-core-structure
```

---

## 📊 Fases de Desarrollo

### Fase 1: Core Structure (Semanas 1-2)
- ✅ Estructura React + Tailwind
- ✅ Modelo de datos e IndexedDB
- ✅ CRUD de Transacciones
- ✅ Categorías predefinidas

### Fase 2: Dashboard & Visualización (Semanas 3-4)
- ✅ Dashboard principal
- ✅ Gráficos (pastel, línea)
- ✅ Balance actual
- ✅ Últimas transacciones

### Fase 3: Características Avanzadas (Semanas 5-6)
- ✅ Calendario visual
- ✅ Sistema de notificaciones
- ✅ Categorías personalizadas
- ✅ Adjuntar comprobantes

### Fase 4: Refinamiento (Semana 7)
- ✅ Gastos recurrentes
- ✅ Reportes avanzados
- ✅ Optimización
- ✅ Tests exhaustivos

### Fase 5: Pulido (Semana 8)
- ✅ Mejoras UX/UI
- ✅ Responsive design
- ✅ Documentación
- ✅ Deploy

---

## 🛠 Herramientas y Tecnologías

### Frontend
- **Framework**: React 18+
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts (responsive)
- **Iconos**: Lucide React
- **Fechas**: date-fns

### Almacenamiento
- **LocalStorage**: Configuraciones
- **IndexedDB**: Transacciones, categorías, comprobantes

### Desarrollo
- **Build**: Vite o Create React App
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git**: Flujo de features

### Requisitos de Navegador
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

---

## 🎯 Principios del Proyecto

### I. Data Integrity & Persistence (🚫 INVIOLABLE)
- Cero pérdida de datos
- Todas las transacciones persistidas en IndexedDB
- Validación antes de guardar
- Tests de persistencia obligatorios

### II. User Speed First
- Dashboard: < 2 segundos
- Formularios: < 30 segundos
- Respuesta UI: < 100ms
- Gráficos: < 500ms

### III. Simplicidad Sin Compromiso
- Interfaz limpia y sin distracciones
- Flujos principales: 3-4 clics máximo
- Complejidad solo cuando agrega valor
- MVP = features esenciales solo

### IV. Modularidad
- Componentes independientes
- Servicios desacoplados
- Fácil de testear
- Fácil de cambiar

### V. Quality Gates
Antes de hacer merge:
- ✅ Cero errores de consola
- ✅ Tests pasan
- ✅ Data persiste correctamente
- ✅ Responsive en 320px, 768px, 1024px

---

## 📖 Guía de Desarrollo

### Crear Nueva Feature

1. **Crear rama de feature**
   ```bash
   speckit feature "Nombre descriptivo de feature"
   ```

2. **Escribir especificación**
   - Editar `specs/###-feature/spec.md`
   - Definir requisitos y criterios de éxito

3. **Crear plan de implementación**
   ```bash
   speckit plan
   ```

4. **Implementar con TDD**
   - Escribir tests primero
   - Implementar para pasar tests
   - Refactorizar

5. **Verificar quality gates**
   - Tests pasan
   - Linting pasa
   - Performance OK
   - Responsive OK

6. **Hacer commit y push**
   ```bash
   git commit -m "[###] Feature description"
   git push origin ###-feature-name
   ```

7. **Crear Pull Request**
   - Referenciar especificación
   - Describir cambios
   - Request review

### Estructura de Feature Branch

```
specs/001-feature-name/
├── spec.md              # Especificación detallada
├── plan.md              # Plan de implementación
├── tasks.md             # Lista de tareas
├── data-model.md        # Modelo de datos (si aplica)
├── research.md          # Research o investigación
└── contracts/           # Contratos de interfaz (si aplica)
    ├── api.md
    └── database.md
```

---

## 🔄 Workflow Git

### Configuración Inicial

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@example.com"
```

### Crear Feature Desde Main

```bash
git checkout main
git pull origin main
speckit feature "Descripción de feature"
# Esto crea automáticamente la rama con número
```

### Durante Desarrollo

```bash
# Ver estatus
git status

# Add cambios
git add .

# Commit con referencia a feature
git commit -m "[001] Implement user authentication"

# Push a remote
git push origin 001-user-auth
```

### Después de Merge

```bash
# Volver a main
git checkout main

# Eliminar rama local
git branch -d 001-user-auth

# Actualizar local
git pull origin main
```

---

## 📞 Soporte y Documentación Adicional

### Documentos de Referencia
- [PRD Completo](prd-finanzas-personales.md)
- [Constitution del Proyecto](.specify/memory/constitution.md)
- [Scripts Bash](.specify/scripts/bash/README.md)

### Troubleshooting
- ❓ Scripts sin permisos: `chmod +x .specify/scripts/bash/*.sh`
- ❓ No está en rama de feature: Crea feature con `speckit feature "..."`
- ❓ Cambios perdidos: Git tiene historial, usa `git reflog`

### Para Agentes IA
- Ejecutar: `speckit context` para actualizar contexto
- Archivos creados: `CLAUDE.md` (Claude), `.github/agents/copilot-instructions.md` (Copilot)
- Información incluida: Stack tech, estructura, cambios recientes

---

## ✅ Checklist de Setup Completo

- [ ] Clonar repositorio
- [ ] `chmod +x .specify/scripts/bash/*.sh`
- [ ] `speckit init --with-git`
- [ ] `git add . && git commit -m "chore: initialize specify structure"`
- [ ] Leer `prd-finanzas-personales.md`
- [ ] Leer `.specify/memory/constitution.md`
- [ ] Crear primera feature: `speckit feature "Setup React project"`
- [ ] Crear plan: `speckit plan`
- [ ] Verificar: `speckit check --json`
- [ ] ¡Listo para desarrollar!

---

**Versión**: 1.0  
**Fecha**: Noviembre 19, 2025  
**Estado**: Proyecto Inicializado ✅

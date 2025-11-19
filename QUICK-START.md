# ⚡ GUÍA RÁPIDA - Aplicación de Finanzas Personales

## 🎯 Start Here

### 1️⃣ Verificar Setup
```bash
cd /home/tecnoparque/mi-proyecto-nuevo
ls -la .specify/scripts/bash/
```

### 2️⃣ Ver Todos los Comandos
```bash
./.specify/scripts/bash/speckit.sh help
```

### 3️⃣ Inicializar Git (opcional, si no está)
```bash
git init
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
```

---

## 📖 Documentación Clave

| Documento | Propósito | Leer |
|-----------|----------|------|
| **README.md** | Guía completa del proyecto | ✅ PRIMERO |
| **prd-finanzas-personales.md** | Especificación detallada | ✅ SEGUNDO |
| **.specify/memory/constitution.md** | Principios del proyecto | ✅ TERCERO |
| **.specify/scripts/bash/README.md** | Documentación de scripts | ✅ COMO REFERENCIA |
| **PROJECT-VALIDATION.md** | Validación del proyecto | ✅ DE VERIFICACIÓN |

---

## 🚀 Crear Primera Feature

### Paso 1: Crear Feature
```bash
./.specify/scripts/bash/speckit.sh feature "Setup React project structure and development environment"
```

**Resultado**: Se crea rama `001-setup-react-project-structure`

### Paso 2: Editar Especificación
```bash
# Editar: specs/001-setup-react-project-structure/spec.md
nano specs/001-setup-react-project-structure/spec.md
```

### Paso 3: Crear Plan de Implementación
```bash
./.specify/scripts/bash/speckit.sh plan
```

**Resultado**: Se crea `specs/001-setup-react-project-structure/plan.md`

### Paso 4: Verificar Todo
```bash
./.specify/scripts/bash/speckit.sh check --json
```

### Paso 5: Hacer Commit
```bash
git add .
git commit -m "[001] Setup React project structure"
git push origin 001-setup-react-project-structure
```

---

## 💻 Comandos Más Usados

### Gestión de Features
```bash
# Crear nueva feature
speckit feature "Descripción de la feature"

# Ver estado actual
speckit check --json

# Crear plan de implementación
speckit plan
```

### Git Workflow
```bash
# Ver todas las branches
git branch -a

# Cambiar a una feature
git checkout 001-feature-name

# Ver cambios
git diff main

# Hacer commit
git commit -m "[001] Descripción del cambio"

# Push
git push origin 001-feature-name
```

### Agentes IA
```bash
# Actualizar contexto para todos los agentes
speckit context

# Actualizar solo para Claude
speckit context claude

# Actualizar solo para Copilot
speckit context copilot
```

---

## 📋 Fases de Desarrollo (8 semanas)

### Semana 1-2: Core Structure
- React setup
- IndexedDB configuration
- Transaction CRUD
- Predefined categories

### Semana 3-4: Dashboard & Visualización
- Dashboard principal
- Gráficos (pie, line, bar)
- Balance destacado
- Recent transactions

### Semana 5-6: Características Avanzadas
- Calendario visual
- Notificaciones
- Categorías personalizadas
- Adjuntar comprobantes

### Semana 7: Refinamiento
- Gastos recurrentes
- Reportes avanzados
- Optimización performance
- Tests exhaustivos

### Semana 8: Pulido
- Mejoras UX/UI
- Responsive design
- Documentación
- Deploy

---

## 🛠 Stack Tecnológico

**Frontend**: React 18+ + Tailwind CSS + Recharts  
**Almacenamiento**: IndexedDB + LocalStorage  
**Fechas**: date-fns  
**Iconos**: Lucide React  
**Versión Control**: Git  

---

## ✅ Quality Gates Antes de Merge

- [ ] No hay errores de consola
- [ ] Tests pasan
- [ ] Data persiste en IndexedDB
- [ ] Responsive en 320px, 768px, 1024px
- [ ] Gráficos sin lag
- [ ] Formularios validan campos

---

## 📂 Estructura de Feature Branch

```
specs/001-my-feature/
├── spec.md              # Especificación
├── plan.md              # Plan de implementación
├── tasks.md             # Tareas (opcional)
├── data-model.md        # Modelo de datos (si aplica)
└── contracts/           # Contratos (si aplica)
```

---

## 🎯 Principios Clave

1. **Data Integrity** 🚫 - Cero pérdida de datos
2. **User Speed** ⚡ - Dashboard < 2 segundos
3. **Simplicity** 📦 - Interfaz limpia
4. **Modularity** 🧩 - Componentes independientes
5. **Testing** ✅ - Tests antes de código

---

## 🔍 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Scripts sin permisos | `chmod +x .specify/scripts/bash/*.sh` |
| No está en rama de feature | `speckit feature "..."` |
| No encuentro un script | `ls .specify/scripts/bash/` |
| Necesito limpiar | `git reset --hard origin/main` |
| Olvidé el nombre de rama | `git branch -a` |

---

## 📞 Contacto Rápido

**Especificación**: prd-finanzas-personales.md  
**Principios**: .specify/memory/constitution.md  
**Herramientas**: .specify/scripts/bash/  
**Guía Completa**: README.md  

---

## 🚀 Ir a Desarrollar

```bash
# 1. Crea feature
speckit feature "Tu descripción"

# 2. Desarrolla
# (editar archivos, escribir tests, implementar)

# 3. Commit
git commit -m "[###] Tu cambio"

# 4. Push
git push origin ###-tu-feature

# 5. PR
# Crear Pull Request

# ¡Listo!
```

---

**Más info**: Ver README.md  
**Ayuda**: Ver .specify/scripts/bash/README.md  
**Especificación**: Ver prd-finanzas-personales.md  

**¡Que disfrutes desarrollando!** 🎉

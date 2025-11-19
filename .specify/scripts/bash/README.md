# Specify Framework - Bash Scripts

Conjunto de scripts para gestionar el flujo de trabajo de Spec-Driven Development.

## 📋 Scripts Disponibles

### 1. **speckit.sh** - CLI Principal
Interfaz unificada para todos los comandos del framework.

```bash
./speckit help                              # Ver ayuda
./speckit init --with-git                   # Inicializar proyecto
./speckit feature "Descripción feature"     # Crear nueva feature
./speckit plan                              # Crear plan de implementación
./speckit check --json                      # Verificar prerequisitos
./speckit context claude                    # Actualizar contexto de agentes
```

### 2. **speckit-init.sh** - Inicialización del Proyecto
Crea la estructura completa del proyecto Specify con directorios y templates.

**Características:**
- Crea estructura de directorios (.specify, specs)
- Genera templates para spec, plan, tasks
- Inicializa Git repository (opcional)
- Crea archivo de constitución del proyecto

**Uso:**
```bash
./speckit-init.sh                  # Inicialización estándar
./speckit-init.sh --with-git       # Con soporte Git
./speckit-init.sh --force          # Reinicializar (sobrescribir)
```

### 3. **create-new-feature.sh** - Crear Nueva Feature
Crea una rama de feature con número secuencial y estructura de directorio.

**Características:**
- Generación automática de nombre de rama (###-feature-name)
- Extracción inteligente de palabras clave de la descripción
- Validación contra branches existentes (local y remoto)
- Creación de directorio de feature con template spec.md
- Soporte para Git y non-Git repositories

**Uso:**
```bash
./create-new-feature.sh "Add user authentication system"
./create-new-feature.sh --short-name "user-auth" "Implement OAuth2"
./create-new-feature.sh --number 5 "Custom feature number"
./create-new-feature.sh --json "Feature description"  # Salida JSON
```

**Salida:**
```
BRANCH_NAME: 001-user-auth-system
SPEC_FILE: /path/to/specs/001-user-auth-system/spec.md
FEATURE_NUM: 001
```

### 4. **setup-plan.sh** - Crear Plan de Implementación
Genera el archivo plan.md en la feature actual con template predefinido.

**Características:**
- Copia template de plan desde .specify/templates
- Valida rama de feature (solo en Git repos)
- Crea directorio de feature si no existe
- Soporte para salida JSON

**Uso:**
```bash
./setup-plan.sh                   # Crear plan
./setup-plan.sh --json            # Salida JSON
```

### 5. **check-prerequisites.sh** - Verificar Prerequisitos
Valida que la feature tenga todos los archivos necesarios.

**Características:**
- Valida existencia de branch de feature
- Verifica archivos requeridos (spec.md, plan.md, etc)
- Valida permisos de lectura/escritura
- Soporte para diferentes modos de validación
- Salida en JSON o texto

**Uso:**
```bash
./check-prerequisites.sh                      # Validación estándar
./check-prerequisites.sh --json               # Formato JSON
./check-prerequisites.sh --require-tasks      # Requiere tasks.md
./check-prerequisites.sh --paths-only         # Solo rutas
./check-prerequisites.sh --include-tasks      # Incluye tasks.md
```

**Salida:**
```json
{
  "FEATURE_DIR": "/path/to/specs/001-feature",
  "AVAILABLE_DOCS": ["research.md", "data-model.md", "tasks.md"]
}
```

### 6. **update-agent-context.sh** - Actualizar Contexto de Agentes
Actualiza archivos de contexto para agentes IA (Claude, Copilot, etc).

**Características:**
- Parsea plan.md para extraer metadatos del proyecto
- Crea o actualiza archivos de contexto de agentes
- Soporta múltiples tipos de agentes IA
- Mantiene historial de cambios recientes
- Preserva configuraciones manuales

**Agentes Soportados:**
- Claude Code
- GitHub Copilot
- Gemini CLI
- Cursor IDE
- Qwen Code
- Windsurf
- Kilo Code
- Auggie CLI
- Roo Code
- Amazon Q Developer CLI
- CodeBuddy CLI
- SHAI
- opencode

**Uso:**
```bash
./update-agent-context.sh                    # Actualizar todos
./update-agent-context.sh claude             # Solo Claude
./update-agent-context.sh copilot            # Solo Copilot
./update-agent-context.sh gemini             # Solo Gemini
```

### 7. **common.sh** - Funciones Comunes
Archivo de funciones compartidas usadas por otros scripts.

**Funciones Principales:**
```bash
get_repo_root()              # Obtiene raíz del repositorio
get_current_branch()         # Obtiene rama actual
get_feature_paths()          # Obtiene rutas de la feature
has_git()                    # Verifica si hay repositorio Git
find_feature_dir_by_prefix() # Busca feature por prefijo numérico
check_file()                 # Verifica archivo (con visual)
check_dir()                  # Verifica directorio (con visual)
```

## 🚀 Quick Start

### 1. Inicializar Proyecto
```bash
cd /path/to/project
./.specify/scripts/bash/speckit.sh init --with-git
```

### 2. Crear Primera Feature
```bash
./.specify/scripts/bash/speckit.sh feature "Implement user authentication"
```

### 3. Crear Plan de Implementación
```bash
./.specify/scripts/bash/speckit.sh plan
```

### 4. Verificar Prerequisitos
```bash
./.specify/scripts/bash/speckit.sh check --json
```

### 5. Actualizar Contexto de Agentes
```bash
./.specify/scripts/bash/speckit.sh context
```

## 📚 Templates

Los scripts usan templates ubicados en `.specify/templates/`:

- **spec-template.md** - Template para especificaciones de features
- **plan-template.md** - Template para planes de implementación
- **tasks-template.md** - Template para listas de tareas
- **agent-file-template.md** - Template para archivos de contexto de agentes

## 🔧 Variables de Entorno

```bash
SPECIFY_FEATURE=feature-name      # Establece feature actual (no-Git repos)
SPECIFY_NO_COLOR=1                # Deshabilita colores en salida
```

## 📂 Estructura de Directorios

```
project-root/
├── .specify/
│   ├── scripts/bash/              # Este directorio
│   │   ├── speckit.sh
│   │   ├── speckit-init.sh
│   │   ├── create-new-feature.sh
│   │   ├── setup-plan.sh
│   │   ├── check-prerequisites.sh
│   │   ├── update-agent-context.sh
│   │   ├── common.sh
│   │   └── README.md
│   ├── templates/
│   │   ├── spec-template.md
│   │   ├── plan-template.md
│   │   ├── tasks-template.md
│   │   └── agent-file-template.md
│   └── memory/
│       └── constitution.md
└── specs/
    ├── 001-feature-name/
    │   ├── spec.md
    │   ├── plan.md
    │   ├── tasks.md
    │   └── ...
    └── 002-another-feature/
        └── ...
```

## 🛠 Mantenimiento y Troubleshooting

### Script no tiene permisos de ejecución
```bash
chmod +x .specify/scripts/bash/*.sh
```

### Error: "No en rama de feature"
Asegúrate de estar en una rama que siga el patrón `###-name`:
```bash
git checkout -b 001-my-feature
```

### Error: "No Git repository detected"
Para repos sin Git, establece variable de entorno:
```bash
export SPECIFY_FEATURE=001-my-feature
```

### Actualizar templates
Los templates se encuentran en `.specify/templates/`. Edítalos directamente para cambiar los templates predeterminados.

## 📝 Convenciones

### Nombres de Rama
- Patrón: `###-descriptive-name`
- Ejemplo: `001-user-authentication`, `042-api-refactor`
- Números: Secuencia automática de 3 dígitos

### Nombres de Feature
- Usar kebab-case (palabras separadas por guiones)
- Máximo 244 caracteres (límite de GitHub)
- Filtradas automáticamente palabras vacías
- Máximo 3-4 palabras significativas

### Commits
- Referencia la feature: `[001] Add authentication module`
- Descripción clara y concisa
- Una lógica por commit

## 📖 Para Más Información

Ver archivos individuales de scripts para documentación detallada:
- Función específica: Busca comentarios en el script
- Variables globales: Al inicio del script
- Ejemplos: En sección EXAMPLES

## 📄 Licencia

Estos scripts son parte del framework Specify.

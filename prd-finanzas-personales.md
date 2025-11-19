# PRD - Aplicación de Finanzas Personales

## 1. Resumen Ejecutivo

### 1.1 Visión del Producto
Aplicación web de gestión de finanzas personales que permite a los usuarios registrar, categorizar y visualizar sus ingresos y gastos de manera intuitiva, proporcionando dashboards visuales para analizar patrones de consumo y tomar decisiones financieras informadas.

### 1.2 Objetivos del Producto
- Facilitar el registro rápido y detallado de transacciones financieras
- Proporcionar visualizaciones claras sobre patrones de gasto
- Ayudar a los usuarios a identificar áreas de mejora en sus finanzas
- Mantener un histórico completo y organizado de todas las transacciones
- Ofrecer análisis temporal (semanal, quincenal, mensual)

### 1.3 Alcance
- **Versión 1.0**: Aplicación web de usuario único sin autenticación
- **Almacenamiento**: Local (navegador)
- **Usuarios objetivo**: Personas que desean control básico-intermedio de sus finanzas personales

---

## 2. Características Principales

### 2.1 Gestión de Ingresos

#### 2.1.1 Registro de Ingresos
**Campos obligatorios:**
- Nombre/Título del ingreso (texto libre)
- Monto (número decimal, positivo)
- Fecha de recepción (selector de fecha)
- Categoría (selector)

**Campos opcionales:**
- Notas adicionales (campo de texto)
- Comprobante (imagen adjunta)

**Categorías predefinidas de ingresos:**
1. Salario/Sueldo
2. Freelance/Trabajo Independiente
3. Regalo/Donación
4. Venta
5. Reembolso
6. Bono/Prima
7. Inversiones/Intereses
8. Otro

**Funcionalidades:**
- Crear nuevo ingreso
- Editar ingreso existente
- Eliminar ingreso (con confirmación)
- Ver detalle completo del ingreso

---

### 2.2 Gestión de Gastos

#### 2.2.1 Registro de Gastos
**Campos obligatorios:**
- Nombre/Título del gasto (texto libre)
- Monto (número decimal, positivo)
- Fecha del gasto (selector de fecha)
- Categoría principal (selector)
- Subcategoría (selector dependiente de categoría)

**Campos opcionales:**
- Notas adicionales (campo de texto)
- Comprobante (imagen adjunta)
- Marcar como gasto recurrente (checkbox)
  - Si es recurrente: frecuencia (semanal, quincenal, mensual)

**Categorías y Subcategorías predefinidas:**

**🏠 OBLIGACIONES**
1. **Vivienda**
   - Alquiler/Renta
   - Servicios públicos
   - Reparaciones
   - Mantenimiento

2. **Transporte**
   - Combustible
   - Transporte público
   - Mantenimiento vehículo
   - Estacionamiento
   - Peajes

3. **Servicios Básicos**
   - Electricidad
   - Agua
   - Internet
   - Teléfono
   - Gas

**🍔 NECESIDADES**
4. **Alimentación**
   - Supermercado
   - Mercado
   - Panadería
   - Carnicería
   - Frutería

5. **Salud**
   - Consultas médicas
   - Medicamentos
   - Seguro médico
   - Gimnasio
   - Terapias

6. **Educación**
   - Matrícula
   - Libros
   - Materiales escolares
   - Cursos online
   - Talleres

**🎮 RECREACIÓN Y GUSTOS**
7. **Entretenimiento**
   - Streaming (Netflix, Spotify, etc)
   - Cine
   - Videojuegos
   - Hobbies
   - Eventos

8. **Restaurantes y Comida fuera**
   - Restaurantes
   - Cafeterías
   - Delivery
   - Comida rápida
   - Bar/Antro

9. **Compras personales**
   - Ropa
   - Tecnología
   - Accesorios
   - Calzado
   - Belleza/Cuidado personal

10. **Viajes y Ocio**
    - Hospedaje
    - Transporte turístico
    - Tours
    - Souvenirs
    - Actividades recreativas

**⚠️ IMPROVISTOS**
11. **Emergencias**
    - Gastos médicos urgentes
    - Reparaciones urgentes
    - Pérdidas
    - Multas

12. **Imprevistos varios**
    - Gastos no planificados
    - Otros imprevistos

**💳 OTROS**
13. **Deudas/Préstamos**
    - Pago de tarjetas de crédito
    - Préstamos personales
    - Créditos

14. **Regalos**
    - Cumpleaños
    - Navidad
    - Aniversarios
    - Otros regalos

15. **Mascotas**
    - Comida para mascotas
    - Veterinario
    - Accesorios
    - Medicamentos para mascotas

16. **Suscripciones**
    - Servicios digitales
    - Membresías
    - Revistas/Periódicos

17. **Otro**
    - Categoría genérica

**Funcionalidades:**
- Crear nuevo gasto
- Editar gasto existente
- Eliminar gasto (con confirmación)
- Ver detalle completo del gasto
- Filtrar por categoría
- Filtrar por rango de fechas

---

### 2.3 Sistema de Categorías Personalizadas

#### 2.3.1 Gestión de Categorías
**Funcionalidades para el usuario:**
- Crear nuevas categorías personalizadas
- Editar nombre de categorías (predefinidas y personalizadas)
- Personalizar color de cada categoría (selector de color)
- Agregar/editar subcategorías dentro de cada categoría
- Eliminar categorías personalizadas (no las predefinidas)
- Reorganizar orden de categorías

**Propiedades de categoría:**
- Nombre (texto)
- Color (código hexadecimal)
- Tipo (Ingreso/Gasto)
- Icono sugerido (opcional)
- Subcategorías (lista)

---

### 2.4 Sistema de Notificaciones

#### 2.4.1 Notificaciones Automáticas
- Notificación al agregar nueva transacción (ingreso/gasto)
- Notificación al eliminar transacción
- Notificación al editar transacción

#### 2.4.2 Notificaciones Personalizadas
**El usuario puede configurar:**
- Alertas cuando el gasto en una categoría específica alcance un monto determinado
- Ejemplo: "Notificarme cuando gaste $500 en Entretenimiento"

**Configuración de alerta:**
- Categoría a monitorear (selector)
- Monto límite (número)
- Período (semanal, quincenal, mensual)
- Activar/Desactivar alerta

---

### 2.5 Balance y Resumen Financiero

#### 2.5.1 Balance Actual
**Cálculo automático:**
- Saldo actual = Total de ingresos - Total de gastos
- Actualización en tiempo real

**Visualización:**
- Tarjeta destacada en dashboard principal
- Código de color:
  - Verde: saldo positivo
  - Rojo: saldo negativo
  - Amarillo: saldo cercano a cero

#### 2.5.2 Resumen del Mes
**Métricas principales:**
- Total de ingresos del mes actual
- Total de gastos del mes actual
- Balance del mes
- Comparación con mes anterior (porcentaje)
- Top 3 categorías de mayor gasto
- Número total de transacciones

---

### 2.6 Dashboard y Visualizaciones

#### 2.6.1 Gráficos Principales

**1. Gráfico de Pastel - Distribución por Categorías**
- Muestra distribución porcentual de gastos por categoría
- Colores personalizados según configuración de usuario
- Al hacer clic en una sección, muestra detalle de subcategorías
- Filtrable por período (semanal, quincenal, mensual, personalizado)

**2. Gráfico de Barras - Comparación Temporal**
- Comparar gastos entre diferentes períodos
- Eje X: Semanas/Quincenas/Meses
- Eje Y: Monto total
- Barras agrupadas por categorías principales
- Filtrable por categoría específica

**3. Gráfico de Línea - Tendencia de Gastos**
- Visualización de tendencia de gastos en el tiempo
- Línea de ingresos vs línea de gastos
- Permite identificar patrones y ciclos
- Rango de fechas personalizable

**4. Gráfico de Barras Horizontales - Top Categorías**
- Top 10 categorías con mayor gasto
- Ordenadas de mayor a menor
- Con valor numérico y porcentaje

#### 2.6.2 Filtros de Dashboard
- Por rango de fechas personalizado
- Por período predefinido (última semana, última quincena, último mes, último trimestre, último año)
- Por tipo de transacción (ingresos, gastos, ambos)
- Por categoría específica
- Por subcategoría específica

#### 2.6.3 Análisis por Tipo de Gasto
**Clasificación visual:**
- Obligaciones (color distintivo)
- Necesidades (color distintivo)
- Recreación y Gustos (color distintivo)
- Improvistos (color distintivo)

Gráfico adicional que agrupe todas las categorías según esta clasificación.

---

### 2.7 Calendario Visual

#### 2.7.1 Vista de Calendario
**Características:**
- Vista mensual con días del mes
- Cada día muestra:
  - Indicador visual de ingresos (color verde)
  - Indicador visual de gastos (color rojo)
  - Suma total del día
- Al hacer clic en un día:
  - Lista detallada de todas las transacciones de ese día
  - Opción de agregar nueva transacción con fecha pre-seleccionada

**Funcionalidades:**
- Navegación entre meses (anterior/siguiente)
- Ir a mes actual (botón "Hoy")
- Vista rápida del balance diario
- Marcadores especiales para días con gastos recurrentes

---

### 2.8 Adjuntar Comprobantes

#### 2.8.1 Gestión de Imágenes
**Características:**
- Subida opcional de imagen por transacción
- Formatos soportados: JPG, PNG, PDF
- Tamaño máximo: 5MB por archivo
- Previsualización antes de guardar
- Almacenamiento local (base64 o IndexedDB)

**Funcionalidades:**
- Agregar comprobante al crear transacción
- Agregar comprobante después (edición)
- Ver comprobante en detalle de transacción (modal con zoom)
- Eliminar comprobante
- Descargar comprobante

---

### 2.9 Gastos Recurrentes

#### 2.9.1 Configuración de Recurrencia
**Campos:**
- Marcar como recurrente (checkbox)
- Frecuencia: Semanal / Quincenal / Mensual
- Día de la semana (si es semanal)
- Día del mes (si es mensual)
- Fecha de inicio
- Fecha de fin (opcional)

**Funcionalidades:**
- Vista especial de "Gastos Recurrentes" 
- Listado de todos los gastos marcados como recurrentes
- Recordatorio/sugerencia para registrar gasto cuando corresponda
- Opción de "agregar automáticamente" el gasto recurrente en la fecha indicada

---

## 3. Arquitectura de Información

### 3.1 Estructura de Navegación

**Menú Principal:**
1. 🏠 Dashboard (Home)
2. ➕ Nueva Transacción
3. 📊 Reportes
4. 📅 Calendario
5. 🔔 Notificaciones
6. ⚙️ Configuración

### 3.2 Páginas y Vistas

#### 3.2.1 Dashboard (Página Principal)
**Secciones:**
- Resumen del mes (tarjetas con métricas)
- Balance actual destacado
- Gráfico de pastel (distribución por categorías)
- Gráfico de tendencia (últimos 30 días)
- Lista de últimas 10 transacciones
- Acceso rápido a "Nueva Transacción"

#### 3.2.2 Nueva Transacción
**Tabs:**
- Tab 1: Agregar Ingreso
- Tab 2: Agregar Gasto

Formulario detallado según el tipo seleccionado.

#### 3.2.3 Reportes
**Secciones:**
- Filtros avanzados (parte superior)
- Gráfico de barras comparativo
- Gráfico de línea de tendencia
- Análisis por tipo de gasto (Obligaciones, Necesidades, Recreación, Improvistos)
- Tabla detallada de todas las transacciones filtradas
- Resumen numérico del período seleccionado

#### 3.2.4 Calendario
- Vista de calendario mensual
- Panel lateral con detalle del día seleccionado
- Botón de agregar transacción rápida

#### 3.2.5 Notificaciones
- Centro de notificaciones (historial)
- Configuración de alertas personalizadas
- Gestionar alertas activas

#### 3.2.6 Configuración
**Subsecciones:**
- Gestión de Categorías
  - Categorías de Ingresos
  - Categorías de Gastos (con subcategorías)
- Gastos Recurrentes
- Preferencias de visualización
- Gestión de datos (exportar/importar/limpiar)

---

## 4. Modelo de Datos

### 4.1 Estructura de Datos

#### Transacción (Base)
```javascript
{
  id: "uuid",
  tipo: "ingreso" | "gasto",
  titulo: "string",
  monto: number,
  fecha: "ISO 8601 date",
  notas: "string | null",
  comprobante: "base64 | null",
  fechaCreacion: "ISO 8601 timestamp",
  fechaModificacion: "ISO 8601 timestamp"
}
```

#### Ingreso
```javascript
{
  ...Transacción,
  tipo: "ingreso",
  categoria: {
    id: "uuid",
    nombre: "string",
    color: "hex"
  }
}
```

#### Gasto
```javascript
{
  ...Transacción,
  tipo: "gasto",
  categoria: {
    id: "uuid",
    nombre: "string",
    color: "hex"
  },
  subcategoria: {
    id: "uuid",
    nombre: "string"
  },
  esRecurrente: boolean,
  recurrencia: {
    frecuencia: "semanal" | "quincenal" | "mensual",
    diaDelMes?: number,
    diaDeLaSemana?: string,
    fechaInicio: "ISO 8601 date",
    fechaFin?: "ISO 8601 date"
  } | null
}
```

#### Categoría
```javascript
{
  id: "uuid",
  nombre: "string",
  color: "hex",
  tipo: "ingreso" | "gasto",
  esPredefinida: boolean,
  orden: number,
  subcategorias?: [
    {
      id: "uuid",
      nombre: "string",
      orden: number
    }
  ]
}
```

#### Alerta
```javascript
{
  id: "uuid",
  categoriaId: "uuid",
  montoLimite: number,
  periodo: "semanal" | "quincenal" | "mensual",
  activa: boolean,
  fechaCreacion: "ISO 8601 timestamp"
}
```

### 4.2 Almacenamiento Local
- **LocalStorage**: Configuraciones generales, preferencias de usuario
- **IndexedDB**: Transacciones, categorías, comprobantes (imágenes)

---

## 5. Requisitos Técnicos

### 5.1 Stack Tecnológico Sugerido
**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Framework: React o Vue.js (opcional)
- Librería de gráficos: Chart.js o Recharts
- UI/Estilos: Tailwind CSS o Bootstrap

**Almacenamiento:**
- LocalStorage (configuraciones)
- IndexedDB (datos principales)

**Otros:**
- Date-fns o Day.js (manejo de fechas)
- Biblioteca de iconos: Lucide React o Font Awesome

### 5.2 Requisitos de Rendimiento
- Carga inicial < 3 segundos
- Respuesta de interfaz < 100ms
- Capacidad para manejar 10,000+ transacciones
- Imágenes optimizadas automáticamente al subir

### 5.3 Compatibilidad
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Diseño responsive (mobile-first)
- Soporte para tablets y desktop

---

## 6. Experiencia de Usuario

### 6.1 Principios de Diseño
- **Simplicidad**: Interfaz limpia y sin distracciones
- **Accesibilidad**: Contraste adecuado, tamaños de fuente legibles
- **Feedback visual**: Confirmaciones, animaciones sutiles
- **Velocidad**: Formularios rápidos, navegación fluida

### 6.2 Flujos Principales

#### Flujo 1: Agregar Gasto Rápido
1. Usuario hace clic en "Nueva Transacción" o botón flotante "+"
2. Selecciona tab "Gasto"
3. Completa campos obligatorios (4 campos)
4. (Opcional) Adjunta comprobante
5. Presiona "Guardar"
6. Recibe notificación de confirmación
7. Regresa al dashboard actualizado

#### Flujo 2: Ver Análisis Mensual
1. Usuario entra a "Reportes"
2. Selecciona filtro "Último mes"
3. Observa gráficos actualizados
4. Hace clic en categoría de interés
5. Ve desglose detallado
6. Identifica áreas de oportunidad

#### Flujo 3: Configurar Alerta
1. Usuario entra a "Notificaciones"
2. Clic en "Nueva Alerta"
3. Selecciona categoría
4. Define monto límite
5. Elige período
6. Guarda alerta
7. Sistema monitorea automáticamente

---

## 7. Consideraciones Futuras (Post-MVP)

### 7.1 Funcionalidades Fase 2
- Múltiples cuentas/billeteras
- Sistema de presupuestos y metas de ahorro
- Exportación de reportes en PDF/Excel
- Autenticación y sincronización en nube
- Multi-usuario (familia, pareja)
- Reconocimiento automático de texto en comprobantes (OCR)
- Integración con bancos (APIs)
- Modo oscuro
- Comparación con promedios nacionales/regionales
- Asistente financiero con IA

### 7.2 Mejoras de UX
- Onboarding interactivo para nuevos usuarios
- Tours guiados
- Plantillas de categorías por perfil (estudiante, profesional, familia)
- Widgets para escritorio/móvil
- Accesos directos personalizables

---

## 8. Criterios de Éxito

### 8.1 Métricas Clave
- Usuario puede registrar una transacción en < 30 segundos
- Dashboard carga en < 2 segundos
- Usuario identifica su categoría de mayor gasto en < 5 segundos
- 100% de transacciones se guardan correctamente
- Cero pérdida de datos en navegadores soportados

### 8.2 Validación de Funcionalidades
- ✅ Todas las transacciones se pueden crear, editar y eliminar
- ✅ Gráficos reflejan datos en tiempo real
- ✅ Calendario muestra todas las transacciones correctamente
- ✅ Alertas se disparan cuando se cumplen condiciones
- ✅ Imágenes se guardan y recuperan correctamente
- ✅ Datos persisten al cerrar y reabrir navegador

---

## 9. Plan de Implementación Sugerido

### Fase 1 - Core (Semanas 1-2)
- ✅ Estructura base del proyecto
- ✅ Modelo de datos e IndexedDB
- ✅ CRUD de transacciones (ingresos y gastos)
- ✅ Sistema de categorías predefinidas

### Fase 2 - Visualización (Semanas 3-4)
- ✅ Dashboard principal
- ✅ Gráfico de pastel
- ✅ Gráfico de línea
- ✅ Balance actual

### Fase 3 - Avanzado (Semanas 5-6)
- ✅ Calendario visual
- ✅ Sistema de notificaciones
- ✅ Gestión de categorías personalizadas
- ✅ Adjuntar comprobantes

### Fase 4 - Refinamiento (Semana 7)
- ✅ Gastos recurrentes
- ✅ Reportes avanzados
- ✅ Optimización de rendimiento
- ✅ Pruebas exhaustivas

### Fase 5 - Pulido (Semana 8)
- ✅ Mejoras de UX/UI
- ✅ Responsive design
- ✅ Documentación
- ✅ Deploy

---

## 10. Glosario

- **Transacción**: Cualquier movimiento de dinero (ingreso o gasto)
- **Balance**: Diferencia entre ingresos totales y gastos totales
- **Categoría**: Clasificación principal de una transacción
- **Subcategoría**: Clasificación secundaria dentro de una categoría
- **Gasto Recurrente**: Gasto que se repite con frecuencia regular
- **Comprobante**: Imagen o documento que respalda una transacción
- **Dashboard**: Página principal con resumen de información clave
- **Alerta**: Notificación configurada por el usuario

---

## Conclusión

Este PRD define una aplicación completa de finanzas personales con enfoque en simplicidad de uso, visualización efectiva de datos y flexibilidad para adaptarse a las necesidades del usuario. El producto permite un control detallado de las finanzas sin complejidad innecesaria, proporcionando las herramientas esenciales para toma de decisiones financieras informadas.

**Versión del documento**: 1.0  
**Fecha**: Noviembre 2025  
**Estado**: Listo para implementación
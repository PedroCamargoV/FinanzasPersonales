# 📚 GUÍA RÁPIDA DE REFERENCIA

## 🌐 CATEGORÍAS ANTES Y DESPUÉS

### INGRESOS

| ID | Antes (Inglés) | Después (Español Latino) |
|----|---|---|
| salary | Salary | **Salario** |
| freelance | Freelance | **Trabajo Independiente** |
| investment | Investment | **Inversión** |
| gifts | Gifts | **Regalos** |
| refund | Refund | **Reembolso** |
| interest | Interest | **Intereses** |
| bonus | Bonus | **Bonificación** |
| other-income | Other Income | **Otros Ingresos** |

### GASTOS - VIVIENDA

| ID | Antes | Después |
|----|---|---|
| housing | Housing | **Vivienda** |
| rent | Rent | **Alquiler** |
| utilities | Utilities | **Servicios** |
| maintenance | Maintenance | **Mantenimiento** |

### GASTOS - TRANSPORTE

| ID | Antes | Después |
|----|---|---|
| transportation | Transportation | **Transporte** |
| gas | Gas | **Gasolina** |
| car-maintenance | Car Maintenance | **Mantenimiento de Auto** |
| public-transport | Public Transport | **Transporte Público** |
| parking | Parking | **Estacionamiento** |

### GASTOS - ALIMENTACIÓN

| ID | Antes | Después |
|----|---|---|
| food | Food | **Alimentación** |
| groceries | Groceries | **Compras de Supermercado** |
| restaurants | Restaurants | **Restaurantes** |
| delivery | Delivery | **Entregas de Comida** |

### GASTOS - PERSONAL

| ID | Antes | Después |
|----|---|---|
| personal | Personal | **Personal** |
| clothing | Clothing | **Ropa** |
| hygiene | Hygiene | **Higiene** |
| health | Health | **Salud** |

### GASTOS - ENTRETENIMIENTO

| ID | Antes | Después |
|----|---|---|
| entertainment | Entertainment | **Entretenimiento** |
| movies | Movies | **Películas** |
| games | Games | **Videojuegos** |
| sports | Sports | **Deportes** |

### GASTOS - SUSCRIPCIONES Y OTROS

| ID | Antes | Después |
|----|---|---|
| subscriptions | Subscriptions | **Suscripciones** |
| other-expense | Other | **Otros** |

---

## 💰 FORMATO MONETARIO LATINO

### ENTRADA DE USUARIO

**Lo que el usuario escribe en el formulario:**

```
Entrada              → Sistema almacena como:
1500                 → 1500.00
1500,50              → 1500.50
1.500                → 1500.00
1.500,50             → 1500.50
25.000               → 25000.00
25.000,99            → 25000.99
100,00               → 100.00
100                  → 100.00
```

### VISUALIZACIÓN

**Lo que se muestra en pantallas y reportes:**

```
Número interno       → Se muestra como:
1500.00              → 1.500,00
1500.50              → 1.500,50
25000.00             → 25.000,00
25000.99             → 25.000,99
100.00               → 100,00
```

### VALIDACIÓN

```
✅ VÁLIDO:
- "1.500,50" (con miles)
- "1500,50" (sin miles)
- "1500" (solo enteros)
- "500,99" (solo decimales)
- "0,01" (mínimo)
- "999999999,99" (máximo)

❌ INVÁLIDO:
- "1,500.50" (formato inglés)
- "abc" (texto)
- "" (vacío)
- "1.500,5" (solo 1 decimal)
```

---

## 🔧 API DE CURRENCY

### Funciones disponibles

#### `parseLatinoAmount(value)`
Convierte entrada latino a número
```typescript
parseLatinoAmount("1.500,50") // → 1500.50
parseLatinoAmount("1500,50")  // → 1500.50
parseLatinoAmount(1500.50)    // → 1500.50
```

#### `formatLatinoAmount(value, showCents)`
Convierte número a formato latino
```typescript
formatLatinoAmount(1500.50)        // → "1.500,50"
formatLatinoAmount(1500.50, false) // → "1.500"
formatLatinoAmount(1500)           // → "1.500,00"
```

#### `displayCurrency(value, currency, showCents)`
Muestra con símbolo de moneda
```typescript
displayCurrency(1500.50, "$")    // → "$ 1.500,50"
displayCurrency(1500.50, "USD")  // → "USD 1.500,50"
displayCurrency(1500.50)         // → "1.500,50"
```

#### `isValidLatinoFormat(value)`
Valida formato latino
```typescript
isValidLatinoFormat("1.500,50") // → true
isValidLatinoFormat("abc")      // → false
```

#### `getDecimalPlaces(value)`
Obtiene número de decimales
```typescript
getDecimalPlaces(1500.50)      // → 2
getDecimalPlaces("1.500,50")   // → 2
getDecimalPlaces("1500")       // → 0
```

---

## 📝 FLUJO DE TRANSACCIÓN

### 1. USUARIO INGRESA DATOS

```
Formulario TransactionForm:
├─ Tipo: [Gasto] ✓
├─ Título: "Compra de comida"
├─ Categoría: [Compras de Supermercado] ✓
├─ Monto: "1.500,50" ← FORMATO LATINO
└─ Fecha: "2024-11-20"
```

### 2. VALIDACIÓN

```
ValidationService.validateTransaction():
├─ Título: "Compra de comida" ✓
├─ Categoría: "groceries" ✓
├─ Monto: "1.500,50" 
│  ├─ Valida formato latino: ✓
│  ├─ Parsea a: 1500.50
│  └─ Verifica rango: ✓
├─ Tipo: "gasto" ✓
└─ Fecha: "2024-11-20" ✓
```

### 3. NORMALIZACIÓN

```
TransactionService.createTransaction():
├─ Recibe: amount = "1.500,50"
├─ Llama: parseLatinoAmount("1.500,50")
├─ Obtiene: 1500.50
└─ Almacena como: 1500.50 (número)
```

### 4. ALMACENAMIENTO

```
IndexedDB transactions store:
{
  id: "txn-abc123",
  title: "Compra de comida",
  amount: 1500.50,          ← número
  category: "groceries",
  type: "gasto",
  date: "2024-11-20",
  ...
}
```

### 5. VISUALIZACIÓN

```
TransactionList (componente):
├─ Lee: amount = 1500.50
├─ Llama: formatLatinoAmount(1500.50)
├─ Obtiene: "1.500,50"
└─ Muestra: "1.500,50" ← FORMATO LATINO
```

---

## 🔐 INTEGRIDAD DE DATOS

### Base de Datos

```
Almacenamiento:
- Monto: SIEMPRE número (1500.50)
- No se guarda string
- Garantiza consistencia

Validación:
- Se valida en formulario
- Se valida en servicio
- Se valida antes de guardar
```

### Conversión

```
Formato Entrada Usuario:
"1.500,50"
    ↓
parseLatinoAmount()
    ↓
1500.50 (número)
    ↓
Almacenamiento
```

---

## 🎯 CASOS DE USO COMUNES

### Caso 1: Salario mensual

```
Usuario escribe: 3.500,00
Sistema almacena: 3500.00
Se muestra como: 3.500,00
```

### Caso 2: Compra pequeña

```
Usuario escribe: 50
Sistema almacena: 50.00
Se muestra como: 50,00
```

### Caso 3: Monto con centavos

```
Usuario escribe: 199,99
Sistema almacena: 199.99
Se muestra como: 199,99
```

### Caso 4: Cantidad grande

```
Usuario escribe: 250.000,00
Sistema almacena: 250000.00
Se muestra como: 250.000,00
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

Para verificar que todo funciona:

- [ ] Todas las categorías en español
- [ ] Campo monto acepta: 1.500,50
- [ ] Se valida automáticamente
- [ ] Se almacena correctamente
- [ ] Se muestra formateado
- [ ] Edición funciona
- [ ] Reportes muestran formato latino
- [ ] Sin errores en consola

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

| Error | Causa | Solución |
|-------|-------|----------|
| "Monto inválido" | Formato inglés | Cambiar a: 1.500,50 |
| Campo vacío | No hay entrada | Ingresar cantidad |
| "Categoría no encontrada" | ID incorrecto | Seleccionar de dropdown |
| Monto "0" | Entrada no parseada | Usar formato: 1.500,50 |

---

## 📞 SOPORTE Y REFERENCIAS

- **Documentación técnica:** `CAMBIOS-LOCALIZACION.md`
- **Ejemplos:** `EJEMPLOS-FORMATO-LATINO.md`
- **Código currency:** `src/utils/currency.ts`
- **Validación:** `src/services/validation/ValidationService.ts`

---

**Última actualización:** Noviembre 20, 2025

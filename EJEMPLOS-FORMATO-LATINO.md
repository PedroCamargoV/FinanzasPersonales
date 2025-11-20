/**
 * Ejemplos de uso - Formato Monetario Latinoamericano
 * 
 * Este archivo muestra ejemplos de cómo usar las funciones de currency
 * en la aplicación de Finanzas Personales
 */

// ============================================================
// EJEMPLO 1: Convertir entrada del usuario a número
// ============================================================

// En TransactionForm.tsx, cuando el usuario escribe en el campo Monto:
const userInput1 = "1.500,50"
// → Se convierte internamente a: 1500.50

const userInput2 = "25.000"
// → Se convierte internamente a: 25000

const userInput3 = "500,99"
// → Se convierte internamente a: 500.99

// ============================================================
// EJEMPLO 2: Mostrar montos en pantalla
// ============================================================

// Cuando se muestra una transacción guardada:
const transactionAmount = 1500.50
// → Se muestra como: "1.500,50"

const transactionAmount2 = 25000
// → Se muestra como: "25.000,00"

// ============================================================
// EJEMPLO 3: Validación automática
// ============================================================

// El ValidationService ahora valida:
// ✓ "1.500,50" - válido
// ✓ "1500,50"  - válido
// ✓ "1500"     - válido
// ✗ "abc"      - inválido
// ✗ "1,500.50" - inválido (formato inglés)

// ============================================================
// EJEMPLO 4: Transacciones con nuevas categorías
// ============================================================

const ejemploTransaccion = {
  title: "Compra semanal",
  amount: "150,00",           // Usuario escribe así
  date: "2024-11-20",
  category: "groceries",      // ID sigue igual
  type: "gasto"
}

// El servicio convertirá:
// amount: "150,00" → 150.00 (internamente)

// Y mostrará la categoría como:
// "Compras de Supermercado" (en lugar de "Groceries")

// ============================================================
// EJEMPLO 5: Casos de uso reales
// ============================================================

// CASO 1: Salario mensual
const caso1 = {
  title: "Salario",
  amount: "3.500,00",
  category: "salary"           // Ahora "Salario"
}

// CASO 2: Alquiler
const caso2 = {
  title: "Pago de alquiler",
  amount: "1.200,00",
  category: "rent"            // Ahora "Alquiler"
}

// CASO 3: Compra de gasolina
const caso3 = {
  title: "Gasolina para el auto",
  amount: "85,50",
  category: "gas"             // Ahora "Gasolina"
}

// CASO 4: Gasto en restaurante
const caso4 = {
  title: "Almuerzo",
  amount: "45,99",
  category: "restaurants"     // Ahora "Restaurantes"
}

// ============================================================
// EJEMPLO 6: Características de la entrada de datos
// ============================================================

// Estos formatos de entrada funcionan:
// ✓ "1500"           → 1500.00
// ✓ "1500,50"        → 1500.50
// ✓ "1.500"          → 1500.00
// ✓ "1.500,50"       → 1500.50
// ✓ " 1.500,50 "     → 1500.50 (se elimina espacios)

// Estos NO funcionan (no son formato latino):
// ✗ "1,500.50"       → formato inglés
// ✗ "abc"            → texto
// ✗ ""               → vacío

// ============================================================
// EJEMPLO 7: Manejo de edición
// ============================================================

// Al editar una transacción guardada de $1500.50:
// 1. Se carga: 1500.50
// 2. Se muestra en input: "1.500,50"
// 3. Usuario puede editar a: "2.000,00"
// 4. Se convierte a: 2000.00
// 5. Se almacena como: 2000.00

// ============================================================
// RESUMEN
// ============================================================

/*
CAMBIOS PRINCIPALES:
- Las categorías están 100% en español latinoamericano
- El campo de monto acepta formato latino: "1.500,50"
- Internamente se convierte a número: 1500.50
- La validación es automática y amigable
- Todos los ejemplos anteriores siguen funcionando

FÓRMULA DE CONVERSIÓN:
Entrada: "X.XXX,XX"
→ Quitar puntos: "XXXX,XX"
→ Cambiar coma por punto: "XXXX.XX"
→ Almacenar como número: XXXX.XX

PARA MOSTRAR:
Número: XXXX.XX
→ Separar miles con punto: "X.XXX.XX"
→ Cambiar punto decimal por coma: "X.XXX,XX"
*/

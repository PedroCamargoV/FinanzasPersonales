# 🧪 GUÍA DE PRUEBAS

## Cómo probar los cambios implementados

---

## ✅ PRUEBA 1: Verificar que las categorías están en español

### Pasos:

1. **Abre la aplicación**
   ```bash
   npm run dev
   ```

2. **Ve al formulario de nueva transacción**
   - Click en "Nueva Transacción"

3. **Verifica el selector de categorías**
   - ✅ Para "Gasto" deberías ver:
     - Vivienda
     - Transporte
     - Alimentación
     - Personal
     - Entretenimiento
     - Suscripciones
     - Otros

   - ✅ Para "Ingreso" deberías ver:
     - Salario
     - Trabajo Independiente
     - Inversión
     - Regalos
     - Reembolso
     - Intereses
     - Bonificación
     - Otros Ingresos

### Resultado esperado:
✅ Todas las categorías en español (NO en inglés)

---

## ✅ PRUEBA 2: Probar entrada de monto en formato latino

### Pasos:

1. **En el formulario de transacción**

2. **Campo "Monto" - Intenta escribir DIFERENTES FORMATOS:**

#### Test 2a: Con miles y decimales
```
Escribe: 1.500,50
Presiona Tab/Enter para ir a otro campo
Resultado esperado: Se acepta sin errores
```

#### Test 2b: Solo miles, sin decimales
```
Escribe: 2.000
Presiona Tab
Resultado esperado: Se acepta (convertir a 2000.00)
```

#### Test 2c: Sin miles, con decimales
```
Escribe: 500,99
Presiona Tab
Resultado esperado: Se acepta (convertir a 500.99)
```

#### Test 2d: Solo número entero
```
Escribe: 100
Presiona Tab
Resultado esperado: Se acepta (convertir a 100.00)
```

#### Test 2d: Formato incorrecto (SIN HACER ESTO)
```
Escribe: 1,500.50 (formato inglés)
Resultado: Debería mostrar error o comportamiento inconsistente
```

### Resultado esperado:
✅ Todos los formatos latinos funcionan sin errores

---

## ✅ PRUEBA 3: Guardar una transacción completa

### Pasos:

1. **Llena el formulario completamente:**

```
Tipo: [Gasto]
Título: "Compra de comida"
Categoría: [Compras de Supermercado]
Monto: 1.500,50
Fecha: [Hoy]
Descripción: "Compra semanal en el supermercado"
```

2. **Click en "Crear"**

3. **Verifica que la transacción aparece en la lista**

### Resultado esperado:
✅ La transacción se guarda y aparece en la lista
✅ El monto se muestra como: `1.500,50` (formato latino)
✅ La categoría muestra: `Compras de Supermercado` (español)

---

## ✅ PRUEBA 4: Editar una transacción

### Pasos:

1. **Crea una transacción** (de la prueba anterior)

2. **Click en el ícono de editar** (lápiz)

3. **Cambia el monto:**
```
Actual: 1.500,50
Nuevo: 2.000,00
```

4. **Click en "Actualizar"**

5. **Verifica que se actualizó**

### Resultado esperado:
✅ La transacción se actualiza
✅ El nuevo monto aparece como: `2.000,00`
✅ Sin errores en la consola

---

## ✅ PRUEBA 5: Validación de entrada

### Pasos:

1. **Intenta crear transacción sin llenar monto**

```
Tipo: Gasto
Título: "Test"
Categoría: "Alimentación"
Monto: [DEJAR VACÍO]
```

2. **Click en "Crear"**

### Resultado esperado:
✅ Se muestra mensaje de error: "Monto inválido"
✅ La transacción NO se guarda
✅ Se mantiene en el formulario

---

## ✅ PRUEBA 6: Verificación de almacenamiento interno

### Pasos:

1. **Abre DevTools (F12)**

2. **Ve a "Application" → "IndexedDB"**

3. **Expande "finanzas-personales" → "transactions"**

4. **Busca la transacción que creaste**

5. **Verifica el campo "amount"**

### Resultado esperado:
✅ El monto se almacena como NÚMERO: `1500.5`
✅ No como string: `"1.500,50"`
✅ Esto confirma que internamente está correcto

---

## ✅ PRUEBA 7: Persistencia de datos

### Pasos:

1. **Crea una transacción:**
```
Monto: 3.500,00
Categoría: Salario
Descripción: "Mi salario"
```

2. **Recarga la página** (F5 o Ctrl+R)

3. **Verifica que la transacción sigue existiendo**

### Resultado esperado:
✅ La transacción persiste después de recargar
✅ El monto se muestra correctamente: `3.500,00`
✅ Categoría sigue siendo: `Salario`

---

## ✅ PRUEBA 8: Categorías de ingresos

### Pasos:

1. **Click en "Nueva Transacción"**

2. **Cambia tipo a "Ingreso"**

3. **Abre selector de categorías**

### Resultado esperado:
✅ Ves todas las categorías de ingreso en español:
- Salario
- Trabajo Independiente
- Inversión
- Regalos
- Reembolso
- Intereses
- Bonificación
- Otros Ingresos

---

## ✅ PRUEBA 9: Múltiples transacciones

### Pasos:

1. **Crea 3 transacciones diferentes:**

```
Transacción 1:
- Tipo: Gasto
- Monto: 50,99
- Categoría: Películas

Transacción 2:
- Tipo: Gasto
- Monto: 1.200,00
- Categoría: Alquiler

Transacción 3:
- Tipo: Ingreso
- Monto: 5.000,00
- Categoría: Salario
```

2. **Verifica que todas aparecen correctamente**

3. **Verifica formatos:**
```
- 50,99 se muestra como: 50,99
- 1.200,00 se muestra como: 1.200,00
- 5.000,00 se muestra como: 5.000,00
```

### Resultado esperado:
✅ Todas las transacciones se guardan
✅ Todos los montos en formato latino
✅ Todas las categorías en español

---

## ✅ PRUEBA 10: Analíticos y Dashboard

### Pasos:

1. **Ve a la sección de Analytics/Dashboard**

2. **Verifica que se muestren:**
   - Total de ingresos: `5.000,00`
   - Total de gastos: `1.250,99`
   - Balance: `3.749,01`

### Resultado esperado:
✅ Los números se muestran en formato latino
✅ Los cálculos son correctos
✅ Sin errores

---

## 🐛 PRUEBAS DE ERROR (Casos que NO deberían funcionar)

### Test de error 1: Formato inglés

```
Escribe: 1,500.50
Resultado esperado: Error o conversión incorrecta
```

### Test de error 2: Texto

```
Escribe: "abc"
Resultado esperado: Error de validación
```

### Test de error 3: Vacío

```
Escribe: (nada)
Resultado esperado: Error: "Monto inválido"
```

### Test de error 4: Símbolos

```
Escribe: $1.500,50
Resultado esperado: Podría aceptar o rechazar
```

---

## 📊 RESUMEN DE PRUEBAS

| # | Prueba | Estado | Notas |
|---|--------|--------|-------|
| 1 | Categorías en español | [ ] | |
| 2 | Entrada formato latino | [ ] | |
| 3 | Guardar transacción | [ ] | |
| 4 | Editar transacción | [ ] | |
| 5 | Validación | [ ] | |
| 6 | Almacenamiento interno | [ ] | |
| 7 | Persistencia | [ ] | |
| 8 | Ingresos en español | [ ] | |
| 9 | Múltiples transacciones | [ ] | |
| 10 | Analíticos/Dashboard | [ ] | |

---

## 🎯 CRITERIOS DE ÉXITO

✅ **TODAS las categorías están en español**
✅ **Campo monto acepta formato latino: 1.500,50**
✅ **Se valida automáticamente**
✅ **Se guarda y persiste correctamente**
✅ **Se muestra en formato latino en toda la UI**
✅ **Internamente almacenado como número**
✅ **Sin errores en consola**
✅ **Compilación sin warnings**

---

## 🔍 CHECKLIST FINAL

Antes de dar por completado, verifica:

- [ ] `npm run build` compila sin errores
- [ ] Página carga sin warnings
- [ ] Todas las pruebas 1-10 pasaron
- [ ] DevTools muestra datos correctos en IndexedDB
- [ ] No hay "any" types en TypeScript
- [ ] Validación funciona para casos válidos e inválidos

---

**Si encuentras problemas, revisa:**
1. Consola del navegador (F12)
2. DevTools Network para errores
3. IndexedDB para verificar datos

**Documentación relacionada:**
- `CAMBIOS-LOCALIZACION.md` - Detalles técnicos
- `GUIA-RAPIDA.md` - Referencia de categorías
- `EJEMPLOS-FORMATO-LATINO.md` - Casos de uso

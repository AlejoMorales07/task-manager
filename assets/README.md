# Image Background Removal Tool

Este directorio contiene herramientas para remover fondos blancos de imágenes y convertirlos en transparentes, específicamente diseñado para procesar firmas.

## 📁 Estructura

```
assets/
├── images/
│   ├── image1.png                # Imagen original con fondo blanco
│   ├── image1-transparent.png    # Imagen resultante con fondo transparente
│   └── image1-info.json         # Metadatos de la imagen
└── README.md                    # Esta documentación
```

## 🚀 Uso Rápido

### Procesar image1 (caso por defecto)
```bash
node scripts/remove-white-background.js
```

### Procesar imagen personalizada
```bash
node scripts/remove-white-background.js <entrada> <salida> [umbral]
```

**Ejemplos:**
```bash
# Procesar firma.png con umbral por defecto (10)
node scripts/remove-white-background.js firma.png firma-transparente.png

# Procesar con umbral personalizado (20 = más tolerante)
node scripts/remove-white-background.js firma.png firma-transparente.png 20
```

## ⚙️ Parámetros

- **umbral**: Tolerancia para detección de color blanco (0-255)
  - `0`: Solo blanco puro (255,255,255)
  - `10`: Valor por defecto, remueve blancos casi puros  
  - `20`: Más tolerante, remueve blancos ligeramente grisáceos
  - `50`: Muy tolerante, puede remover grises claros

## 🎯 Características

- ✅ Remueve fondos blancos automáticamente
- ✅ Preserva la firma/contenido negro
- ✅ Genera PNG con transparencia alfa
- ✅ Ajuste de tolerancia de color configurable
- ✅ Información detallada del procesamiento
- ✅ Soporte para línea de comandos

## 📊 Resultado

La imagen resultante:
- **Formato**: PNG con canal alfa
- **Fondo**: Transparente (donde antes había blanco)
- **Contenido**: Preservado en color original (negro para firmas)
- **Calidad**: Sin pérdida de definición

## 🔧 Dependencias

```bash
npm install sharp
```

## 📝 Notas Técnicas

- Utiliza la librería Sharp para procesamiento de imágenes
- Algoritmo basado en umbral de color RGB
- Convierte automáticamente a formato RGBA
- Optimizado para firmas con fondo blanco
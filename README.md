# Repositorio GPC Urgencia HSJ

Sitio estatico para alojar y buscar resumenes clinicos abreviados en formato HTML.

## Archivos principales

- `index.html`: pagina de inicio del repositorio.
- `documents.json`: catalogo editable de documentos.
- `app.js`: buscador, filtros y renderizado de tarjetas.
- `styles.css`: estilos visuales del sitio.
- `mantenedor_documentos.xlsx`: mantenedor inicial con tematica, version y fecha.

## Mantencion

1. Agregar el nuevo HTML a esta carpeta.
2. Registrar el documento en `documents.json`.
3. Actualizar `mantenedor_documentos.xlsx` con ID, titulo, tematica, archivo, version y fecha.
4. Publicar la carpeta en un servidor estatico, intranet o GitHub Pages.

Para probar localmente desde esta carpeta:

```powershell
python -m http.server 8000
```

Luego abrir `http://localhost:8000`.

# Dashboard Publicartel — base para revisar

Esta versión usa la foto original recuperada de la conversación. La composición es provisional hasta recibir la imagen final. No está publicada. Las seis URLs y el proveedor de clima están pendientes; no se muestran datos inventados.

## Windows, paso a paso con GitHub Desktop

1. Iniciar sesión en GitHub Desktop. Elegir File → New repository, nombre `publicartel-dashboard` y una carpeta local.
2. Copiar el contenido de esta carpeta dentro del repositorio: `index.html`, `style.css`, `app.js`, `config.js`, `.nojekyll`, `assets` y este documento. `index.html` debe estar directamente en la raíz.
3. En GitHub Desktop, escribir `Primera versión del dashboard` y elegir Commit to main.
4. Antes de publicar, revisar que no haya datos internos, enlaces con tokens o archivos privados. GitHub Pages expone el contenido de la web; un repositorio privado no agrega autenticación a sus páginas.
5. Elegir Publish repository, revisar la cuenta y la visibilidad. Usar público si se utiliza GitHub Free. Publicar bajo supervisión del usuario.
6. En la página del repositorio: Settings → Pages → Build and deployment → Deploy from a branch → `main` y `/(root)` → Save.
7. Esperar a que GitHub muestre el enlace, normalmente `https://USUARIO.github.io/publicartel-dashboard/`. Abrirlo y comprobar las seis secciones.
8. Para cada ajuste: guardar los archivos, Commit y Push origin desde GitHub Desktop.

## Enlaces e inactividad

Editar `config.js`: cada sección tiene `url`, `embed` y `rotate`. Admitimos HTTPS. Dejar `embed:false` para abrir una web externa en otra pestaña conservando el menú. Volver desde esa pestaña requiere cerrarla o cambiar de pestaña; el dashboard no puede controlar una web externa.

Solo después de comprobar el enlace en el navegador de la pantalla: `embed:true` lo abre dentro del panel, con botón Volver. `rotate:true`, junto con embed, lo incluye en la rotación tras 90 segundos. Cada vista dura 25 segundos. En rotación una capa transparente captura el toque para volver al menú; la página mostrada no recibe ese toque. El contenido embebido no puede escapar mediante navegación superior gracias al sandbox. Algunos sitios necesitan permisos incompatibles con este modo.

X-Frame-Options, CSP frame-ancestors, inicios de sesión y cookies de terceros pueden impedir mostrar una URL. El evento load no confirma que el iframe haya cargado correctamente. No se intenta esquivar esas restricciones. Si una web no admite iframe, excluirla de la rotación; usar su versión autorizada para pantallas o contenido propio. No es viable rotar páginas externas por navegación directa y garantizar retorno al tocar con una web estática sola.

## Hora y clima

Hora y fecha en America/Montevideo, obtenidas del reloj del equipo. Configurar fecha automática en Android.

El proveedor de clima se elegirá con el usuario según ubicación y licencia de uso corporativo. `weatherEndpoint` debe ser un endpoint HTTPS público con CORS que devuelva `{ "temperature": 20, "code": 0 }`; code sigue WMO. No poner claves privadas en el JavaScript ni en un repositorio. Actualiza cada 10 minutos y oculta la temperatura anterior si falla. Si el proveedor necesita una clave secreta, no se puede proteger en GitHub Pages: hace falta un endpoint público autorizado o un servicio intermedio. No se requiere base de datos.

## METZ 65HD1

Ficha consultada: https://metzdisplay.eu/en/h-series/1-10-metz-65hd1-65-inch-interactive-display-4k-android-6972040271907.html

Indica Android 11, 3840×2160, orientación horizontal y Chrome. Compatibilidad esperada por tecnologías web estándar; falta prueba física. La resolución del navegador puede ser menor que la del panel. La foto recuperada mide 1200×1600: una web adaptable a 4K no convierte la foto en una original 4K.

Prueba en la pantalla: conectar a internet, abrir el enlace HTTPS en Chrome actualizado, poner horizontal y tocar Pantalla completa. Verificar tamaño y respuesta de los seis botones, hora, clima, retorno al menú, rotación con cada URL aprobada y comportamiento sin conexión. Pantalla completa necesita un gesto y depende del navegador; no activa inicio automático ni modo quiosco del sistema. Configurar suspensión e inicio desde el equipo si se requiere funcionamiento continuo.

## Verificación pendiente

Se requiere imagen final para fidelidad visual; URLs reales para probar iframe y sesiones; proveedor de clima; cuenta/repositorio y aprobación de publicación; prueba real en METZ. Esta entrega no incluye un despliegue verificado ni un clima conectado.

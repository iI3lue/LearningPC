const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(process.cwd(), 'learning_pc.db'));

db.prepare("UPDATE niveles SET ruta_archivo=?, titulo=?, descripcion=? WHERE id_subcategoria=4 AND nivel_ordinal=1")
  .run('contenido/trucos/personalizacion-1.html', 'Cambiar fondo de pantalla', 'Personaliza el fondo de tu escritorio desde Configuración de Windows 11');

db.prepare("UPDATE niveles SET ruta_archivo=?, titulo=?, descripcion=? WHERE id_subcategoria=4 AND nivel_ordinal=2")
  .run('contenido/trucos/personalizacion-2.html', 'Colores del sistema', 'Configura el modo oscuro y el color de énfasis de Windows 11');

db.prepare("UPDATE niveles SET ruta_archivo=?, titulo=?, descripcion=? WHERE id_subcategoria=4 AND nivel_ordinal=3")
  .run('contenido/trucos/personalizacion-3.html', 'Temas y pantalla de bloqueo', 'Aplica temas completos y personaliza la pantalla de bloqueo');

const rows = db.prepare('SELECT id_subcategoria, nivel_ordinal, titulo, ruta_archivo FROM niveles WHERE id_subcategoria=4').all();
console.log(JSON.stringify(rows, null, 2));
db.close();

# Study Replay

App para guardar notas de **exámenes**, **trabajos** y **repaso de tests**. Diseño responsive (móvil y web).

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com)
- [Tailwind CSS](https://tailwindcss.com)

## Requisitos

- Node.js 20+
- Base de datos MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) gratis)

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Copiar variables de entorno:

```bash
copy .env.example .env.local
```

3. Editar `.env.local` y poner tu `MONGODB_URI`.

4. Arrancar en desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
├── app/
│   ├── api/notes/     # API REST (CRUD)
│   ├── nueva/         # Crear nota
│   └── notas/[id]/    # Ver y editar
├── components/
├── lib/               # Conexión MongoDB y helpers
├── models/            # Esquema Mongoose
└── types/
```

## Tipos de nota

| Tipo     | Uso                          |
|----------|------------------------------|
| `examen` | Apuntes para exámenes        |
| `trabajo`| Entregas y tareas            |
| `repaso` | Tests y repaso               |

## Scripts

| Comando       | Descripción        |
|---------------|--------------------|
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Build producción |
| `npm start`   | Servidor producción |

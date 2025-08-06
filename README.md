# React Router + Remix Backend Project

This project is built with React Router v7 using the Remix template and TypeScript. React Router v7 incorporates all the great features of Remix while providing a modern, full-stack React framework.

## 📚 Documentation

- 📖 [React Router docs](https://reactrouter.com/dev)
- 🎯 [Migration from Remix](https://reactrouter.com/dev/guides/v7-migration)

## 🚀 Development

Run the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build & Deploy

Build for production:

```sh
npm run build
```

Start the production server:

```sh
npm start
```

## 📁 Project Structure

```
├── app/
│   ├── routes/          # File-based routing
│   ├── entry.client.tsx # Client-side entry
│   ├── entry.server.tsx # Server-side entry
│   ├── root.tsx         # Root component
│   └── tailwind.css     # Global styles
├── public/              # Static assets
└── build/               # Production build output
```

## 🎨 Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. You can customize the configuration in `tailwind.config.ts` or switch to any other CSS framework. See the [Vite CSS docs](https://vitejs.dev/guide/features.html#css) for more options.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler

## 🛠️ VS Code Integration

This project includes VS Code configuration with:
- Development tasks in `.vscode/tasks.json`
- Recommended extensions for TypeScript and Tailwind CSS
- Custom Copilot instructions in `.github/copilot-instructions.md`

To start development, use **Ctrl+Shift+P** → "Tasks: Run Task" → "dev"

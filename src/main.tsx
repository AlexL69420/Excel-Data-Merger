import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import { FileProvider } from "./contexts/FileContext.tsx";

// Добавляем динамическое определение basename
const basename = import.meta.env.PROD ? "/Excel-Data-Merger" : "/";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <NotFoundPage />,
    },
  ],
  {
    basename: basename, // Добавляем basename в конфигурацию роутера
  },
);

createRoot(document.getElementById("root")!).render(
  <FileProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </FileProvider>,
);

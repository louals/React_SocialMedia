import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/authContext";
import { QueryProvider } from "./lib/react-query/QueryProvider";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </HashRouter>
);


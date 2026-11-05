import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { store } from "./store/store.js";
import "./index.css"
import App from "./App.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
)

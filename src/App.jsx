import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/home/Home";
import ProductDetail from "./pages/productDetails/ProductDetails";
import "@fortawesome/fontawesome-free/css/all.css";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { QueryClient, QueryClientProvider } from "react-query"; // Use 'react-query' instead of '@tanstack/react-query'
import EnterOTP from "./pages/auth/EnterOTP";
import NewPassword from "./pages/auth/NewPassword";
import Compare from "./pages/Compare/Compare";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/CheckOut/Checkout";
import Contact from "./pages/Contact/Contact";
import Dashboard from "./pages/Dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toastify
import FAQ from "./pages/FAQ/FAQ";
import TermsCondition from "./pages/Terms&Conditions.js/Terms&Condition";
import PrivacyPolicy from "./pages/PrivacyPolicy.js/PrivacyPolicy";
import About from "./pages/About/About";
import Career from "./pages/Career/Career";
import Blog from "./pages/Blog/Blog";

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  let location = useLocation();
  return (
    <>
      {
        // !location.pathname.includes("auth") &&
        !location.pathname.includes("dashboard") && <Header />
      }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<ProductDetail />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/enter-otp" element={<EnterOTP />} />
        <Route path="/auth/new-password" element={<NewPassword />} />
        <Route path="/compare-products/:productIds" element={<Compare />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/term-&-condition" element={<TermsCondition />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/career" element={<Career />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
      {
        // !location.pathname.includes("auth") &&
        !location.pathname.includes("dashboard") && <Footer />
      }

      {/* Add the ToastContainer here */}
      <ToastContainer autoClose={1000} />
    </>
  );
}

// MainApp component to wrap App with QueryClientProvider and Router
export default function MainApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  );
}

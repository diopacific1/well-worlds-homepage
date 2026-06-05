import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const CryptoDashboard = lazy(() => import("./pages/CryptoDashboard"));
const PlantJournal = lazy(() => import("./pages/PlantJournal"));
const Stories = lazy(() => import("./pages/Stories"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex w-full h-[60vh] items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          } />
          <Route path="crypto" element={
            <Suspense fallback={<PageLoader />}>
              <CryptoDashboard />
            </Suspense>
          } />
          <Route path="plants" element={
            <Suspense fallback={<PageLoader />}>
              <PlantJournal />
            </Suspense>
          } />
          <Route path="stories" element={
            <Suspense fallback={<PageLoader />}>
              <Stories />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

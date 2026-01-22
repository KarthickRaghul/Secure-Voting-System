import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SecureCloudProvider } from "@/securecloud/SecureCloudProvider";
import DatasetPage from "@/securecloud/pages/DatasetPage";
import KeysPage from "@/securecloud/pages/KeysPage";
import EncryptPage from "@/securecloud/pages/EncryptPage";
import SendPage from "@/securecloud/pages/SendPage";
import ComputePage from "@/securecloud/pages/ComputePage";
import ResultPage from "@/securecloud/pages/ResultPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SecureCloudProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/datasets" element={<DatasetPage />} />
            <Route path="/keys" element={<KeysPage />} />
            <Route path="/encrypt" element={<EncryptPage />} />
            <Route path="/send" element={<SendPage />} />
            <Route path="/compute" element={<ComputePage />} />
            <Route path="/result" element={<ResultPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SecureCloudProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

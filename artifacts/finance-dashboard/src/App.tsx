import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Transactions } from "@/pages/Transactions";
import { Insights } from "@/pages/Insights";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/insights" component={Insights} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  // Normalize Vite's BASE_URL for Wouter.
  // Vite may set BASE_URL to './' for relative builds which becomes '.' after trimming
  // — Wouter expects an empty string or a path beginning with '/'. Passing '.' breaks routing.
  const rawBase = import.meta.env.BASE_URL || "/";
  const cleaned = rawBase.replace(/\/$/, "");
  const base = cleaned === "." || cleaned === "./" ? "" : cleaned;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={base}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

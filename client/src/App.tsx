import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SelectTrack from "@/pages/select-track";
import RegistrationForm from "@/pages/registration-form";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/select-track" component={SelectTrack} />
      <Route path="/register" component={RegistrationForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
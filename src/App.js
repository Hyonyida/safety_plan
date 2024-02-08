import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { FileList } from "./components/fileList";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FileList />
    </QueryClientProvider>
  );
}

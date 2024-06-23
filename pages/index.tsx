import React from "react";
import { ThemeProvider } from "next-themes";
import PromptOverflowApp from "../components/PromptOverflowApp";

const Home: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <PromptOverflowApp />
    </ThemeProvider>
  );
};

export default Home;

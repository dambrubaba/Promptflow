import { useEffect, useState } from "react";
import PromptOverflowApp from "../components/PromptOverflowApp";
import LoginPage from "../components/LoginPage";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return isLoggedIn ? <PromptOverflowApp /> : <LoginPage />;
}

import { useState } from "react";

export function useAuth() {
  // temporary (later from backend / storage)
  const [isLoggedIn] = useState(false);
  const [hasOnboarded] = useState(false);

  return {
    isLoggedIn,
    hasOnboarded,
  };
}

import { useState, useEffect, useRef } from "react";

export default function useComponentVisible(initialIsVisible: any) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event: any) => {
    console.log("outside Visible", initialIsVisible);
    // @ts-expect-error
    if (ref.current && !ref.current.contains(event.target)) {
      console.log("invisible", initialIsVisible);
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}

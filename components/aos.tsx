"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AOSInitializer() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: false,
      duration: 600,
      easing: "ease-out-sine",
    });
  }, []);

  return null;
}

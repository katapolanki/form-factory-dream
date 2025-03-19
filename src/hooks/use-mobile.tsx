import { useEffect, useState, useCallback } from "react";
import { debounce } from "@/lib/utils";

type Breakpoints = {
  mobile: number;
  tablet?: number;
};

type Orientation = "portrait" | "landscape";

export function useResponsive(
  breakpoints: Breakpoints = { mobile: 768, tablet: 1024 }
) {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: "portrait" as Orientation,
    breakpoint: "desktop" as keyof Breakpoints,
  });

  const getOrientation = useCallback((): Orientation => {
    return window.matchMedia("(orientation: portrait)").matches
      ? "portrait"
      : "landscape";
  }, []);

  const calculateBreakpoint = useCallback(
    (width: number) => {
      if (width < breakpoints.mobile) return "mobile";
      if (breakpoints.tablet && width < breakpoints.tablet) return "tablet";
      return "desktop";
    },
    [breakpoints]
  );

  const updateState = useCallback(() => {
    const width = window.innerWidth;
    const newBreakpoint = calculateBreakpoint(width);
    const orientation = getOrientation();

    setState({
      isMobile: newBreakpoint === "mobile",
      isTablet: newBreakpoint === "tablet",
      isDesktop: newBreakpoint === "desktop",
      orientation,
      breakpoint: newBreakpoint,
    });
  }, [calculateBreakpoint, getOrientation]);

  useEffect(() => {
    const debouncedUpdate = debounce(updateState, 100);
    updateState();

    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("orientationchange", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("orientationchange", debouncedUpdate);
    };
  }, [updateState]);

  return {
    ...state,
    isPortrait: state.orientation === "portrait",
    isLandscape: state.orientation === "landscape",
  };
}

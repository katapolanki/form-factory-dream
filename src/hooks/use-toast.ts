import { useEffect, useReducer, useCallback } from "react";
import { nanoid } from "nanoid";
import type { Toast, ToastAction, ToastType } from "@/types";

type ToastState = {
  toasts: Toast[];
  queue: Toast[];
};

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "REMOVE_TOAST"; id: string }
  | { type: "PAUSE_TOAST"; id: string }
  | { type: "RESUME_TOAST"; id: string }
  | { type: "CLEAR_TOASTS" };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      if (state.toasts.length >= 5) {
        return {
          ...state,
          queue: [...state.queue, action.toast],
        };
      }
      return {
        ...state,
        toasts: [action.toast, ...state.toasts],
      };

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.id ? { ...t, visible: false } : t
        ),
      };

    case "REMOVE_TOAST":
      const newToasts = state.toasts.filter(t => t.id !== action.id);
      const nextToast = state.queue.shift();
      return {
        toasts: nextToast ? [...newToasts, nextToast] : newToasts,
        queue: state.queue,
      };

    case "PAUSE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.id ? { ...t, paused: true } : t
        ),
      };

    case "RESUME_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.id ? { ...t, paused: false } : t
        ),
      };

    case "CLEAR_TOASTS":
      return { toasts: [], queue: [] };

    default:
      return state;
  }
};

const useToastProvider = () => {
  const [state, dispatch] = useReducer(toastReducer, {
    toasts: [],
    queue: [],
  });

  const createToast = useCallback(
    (
      message: string,
      options: {
        type?: ToastType;
        duration?: number;
        action?: ToastAction;
        icon?: React.ReactNode;
      } = {}
    ) => {
      const id = nanoid();
      const toast: Toast = {
        id,
        message,
        type: options.type || "info",
        duration: options.duration || 5000,
        action: options.action,
        icon: options.icon,
        visible: true,
        paused: false,
      };

      dispatch({ type: "ADD_TOAST", toast });

      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", id });
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", id }), 300);
  }, []);

  const pauseToast = useCallback((id: string) => {
    dispatch({ type: "PAUSE_TOAST", id });
  }, []);

  const resumeToast = useCallback((id: string) => {
    dispatch({ type: "RESUME_TOAST", id });
  }, []);

  const toast = useCallback(
    (message: string, options?: any) => {
      const id = createToast(message, options);
      return {
        id,
        dismiss: () => dismissToast(id),
        pause: () => pauseToast(id),
        resume: () => resumeToast(id),
      };
    },
    [createToast, dismissToast, pauseToast, resumeToast]
  );

  return {
    toasts: state.toasts,
    toast,
    dismissToast,
    pauseToast,
    resumeToast,
    clearToasts: () => dispatch({ type: "CLEAR_TOASTS" }),
  };
};

export { useToastProvider as useToast };

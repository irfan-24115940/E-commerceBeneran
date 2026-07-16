import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-slide-right min-w-[280px]"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: toast.type === "success" ? "var(--success)" : 
                            toast.type === "error" ? "var(--error)" : "var(--accent)",
                color: "#fff"
              }}
            >
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
            </div>
            <p className="text-sm font-bold flex-1">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-50 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

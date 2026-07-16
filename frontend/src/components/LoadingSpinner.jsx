function LoadingSpinner() {
  return (
    <div id="loading-spinner" className="flex flex-col items-center justify-center py-24 gap-4">
      {/* Animated rings */}
      <div className="relative w-14 h-14">
        <div
          className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "var(--accent) transparent transparent transparent" }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-b-transparent animate-spin"
          style={{ borderColor: "transparent transparent var(--accent-dark) transparent", animationDirection: "reverse", animationDuration: "0.6s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full" style={{ background: "var(--accent)" }} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          Memuat produk...
        </p>
        <div className="flex gap-1 justify-center mt-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--accent)",
                animation: `pulse-soft 1.2s ease ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
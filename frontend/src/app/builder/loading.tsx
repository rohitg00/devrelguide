export default function BuilderLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-8 w-full max-w-4xl px-4">
        <div className="crosshair-corners border border-white/10 bg-card p-8 h-64 animate-pulse">
          <div className="h-6 w-48 bg-white/10 mb-6" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResourcesLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-8 w-full max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="crosshair-corners border border-white/10 bg-card p-6 h-36 animate-pulse">
              <div className="h-4 w-32 bg-white/10 mb-4" />
              <div className="h-3 w-full bg-white/5 mb-2" />
              <div className="h-3 w-3/4 bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

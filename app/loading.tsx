export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] font-sans text-[#0f1b2d]">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-10">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-3 w-24 rounded-full bg-[#eadfcf]" />
            <div className="mx-auto h-10 w-56 rounded-full bg-[#eadfcf]" />
            <div className="mx-auto h-4 w-72 rounded-full bg-[#eadfcf]" />
            <div className="mx-auto h-10 w-48 rounded-full bg-[#eadfcf]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-40 rounded-2xl border border-[#efe6da] bg-white"
              />
            ))}
          </div>

          <div className="h-28 rounded-3xl border border-[#efe6da] bg-white" />

          <div className="space-y-4">
            <div className="h-6 w-56 rounded-full bg-[#eadfcf]" />
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-56 rounded-3xl border border-[#efe6da] bg-white"
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-6 w-40 rounded-full bg-[#eadfcf]" />
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-56 rounded-3xl border border-[#efe6da] bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

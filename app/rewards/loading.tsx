export default function RewardsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-900 to-purple-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/80 text-sm font-medium">Loading rewards...</p>
      </div>
    </div>
  )
}

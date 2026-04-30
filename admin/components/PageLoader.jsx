function PageLoader() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500 ease-out">
      <div className="relative flex items-center justify-center w-12 h-12 mb-4">
        {/* Soft background ring */}
        <div className="absolute inset-0 border-4 border-green-500/10 rounded-full"></div>
        {/* Animated spinning ring */}
        <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xs font-bold text-gray-400 tracking-widest uppercase animate-pulse">
        Loading...
      </p>
    </div>
  )
}
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main dark gradient background with green accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-emerald-900"></div>
      
      {/* Secondary gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-slate-900/40"></div>
      
      {/* Animated green blobs with proper opacity for dark theme */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-float"
        style={{ 
          background: 'radial-gradient(circle, #10B981, #059669)',
          animationDelay: '0s'
        }}
        data-testid="bg-blob-1"
      ></div>
      <div 
        className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-float" 
        style={{ 
          background: 'radial-gradient(circle, #34D399, #10B981)',
          animationDelay: '2s'
        }}
        data-testid="bg-blob-2"
      ></div>
      <div 
        className="absolute bottom-1/4 left-1/2 w-96 h-96 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-float" 
        style={{ 
          background: 'radial-gradient(circle, #6EE7B7, #34D399)',
          animationDelay: '4s'
        }}
        data-testid="bg-blob-3"
      ></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>
    </div>
  );
}

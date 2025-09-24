
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`} data-testid="logo-easemyexpo">
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        <img 
          src="/attached_assets/green-metallic-logo.png"
          alt="EaseMyExpo Logo" 
          className="w-full h-full object-contain"
          data-testid="img-logo"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Try fallback images
            if (target.src.includes('green-metallic-logo.png')) {
              target.src = '/attached_assets/Green%20Metallic_1755438011923.png';
            } else if (target.src.includes('Green%20Metallic_1755438011923.png')) {
              target.src = '/attached_assets/Green%20Metallic_1755437555355.png';
            } else {
              // Show a CSS-based logo as final fallback
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-${size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'lg'}">
                    e
                  </div>
                `;
              }
            }
          }}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-gray-800 ${textSizeClasses[size]} tracking-tight`} data-testid="text-brand-name">
            EaseMyExpo
          </span>
          <span className="text-xs text-emerald-600 font-medium tracking-wide" data-testid="text-ai-tagline">
            AI-Powered Intelligence
          </span>
        </div>
      )}
    </div>
  );
}

// Simple icon version for smaller spaces
export function LogoIcon({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center ${className}`}>
      <img 
        src="/attached_assets/green-metallic-logo.png"
        alt="EaseMyExpo" 
        className="w-full h-full object-contain"
        data-testid="img-logo-icon"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          // Try fallback images
          if (target.src.includes('green-metallic-logo.png')) {
            target.src = '/attached_assets/Green%20Metallic_1755438011923.png';
          } else if (target.src.includes('Green%20Metallic_1755438011923.png')) {
            target.src = '/attached_assets/Green%20Metallic_1755437555355.png';
          } else {
            // Show a CSS-based logo as final fallback
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-${size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'lg'}">
                  e
                </div>
              `;
            }
          }
        }}
      />
    </div>
  );
}

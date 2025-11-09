const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        {/* Outer spinning circle */}
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse" />
        </div>
        
        {/* Cute sparkles */}
        <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-accent animate-ping" />
        <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-primary animate-ping delay-150" />
      </div>
    </div>
  );
};

export default LoadingSpinner;

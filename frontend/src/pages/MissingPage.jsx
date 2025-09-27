const MissingPage = ({ title }) => {

  const generateStars = (count) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 2 + 1;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 5;
      const animationDuration = Math.random() * 3 + 1;

      stars.push(
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-0 animate-twinkle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`,
          }}
        ></div>
      );
    }
    return stars;
  };

  return (
    <div className="bg-background relative overflow-hidden">

      <div className="absolute inset-0 z-0">
        {generateStars(150)}
      </div>

      <div className="relative z-10 h-screen-hero flex items-center justify-center px-4 ">
        <div className="max-w-4xl mx-auto text-center animate-slide-up text-white">
          {
            title ? (
              <div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent text-5xl md:text-5xl font-bold mb-2 leading-tight">
                  {title}
                </span>
                <p className="text-lg text-muted-foreground">Thank you for your patient and understanding</p>
              </div>
            ) : (
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Something's
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-accent animate-pulse"> {/* Adjusted gradient colors for better contrast */}
                  Cooking
                </span>
              </h1>
            )
          }
        </div>
      </div>

      {/* Custom Tailwind CSS Animations */}
      <style jsx>{`
        
           @keyframes slide-up {
             from {
               opacity: 0;
               transform: translateY(20px);
             }
             to {
               opacity: 1;
               transform: translateY(0);
             }
           }

           @keyframes pulse {
             0%, 100% {
               opacity: 1;
             }
             50% {
               opacity: 0.5;
             }
           }

           @keyframes twinkle {
             0%, 100% {
               opacity: 0;
             }
             50% {
               opacity: 1;
             }
           }
         @keyframes breathe {
             0%, 100% {
               opacity: 0;
               transform: translateY(20px);
             }
             50% {
               opacity: 1;
               transform: translateY(0);
             }
           }

           .animate-slide-up {
             animation: slide-up 1s ease-out forwards;
           }

           .animate-pulse {
             animation: pulse 3s infinite ease-in-out;
           }

           .animate-twinkle {
             animation: twinkle var(--animation-duration, 2s) infinite alternate ease-in-out;
           }
             .animate-breathe {
             animation: breathe infinite alternate ease-in-out;
           }
         `}</style>
    </div >
  );
}

export default MissingPage;

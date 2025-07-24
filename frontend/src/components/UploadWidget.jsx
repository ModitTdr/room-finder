import { useEffect, useRef, useState } from "react";

export default function UploadWidget({ onUpload, onUploadError, children, multiple = false }) {
   const widgetRef = useRef(null);
   const [uploadedCount, setUploadedCount] = useState(0);
   useEffect(() => {
      // If cloudinary already loaded, no need to add script again
      if (window.cloudinary) {
         createWidget();
         return;
      }

      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);

      function createWidget() {
         widgetRef.current = window.cloudinary.createUploadWidget(
            {
               cloudName: import.meta.env.VITE_API_CLOUDINARY_CLOUDNAME,
               uploadPreset: import.meta.env.VITE_API_CLOUDINARY_UPLOADPRESET,
               sources: ["local", "camera", "url"],
               multiple,
               maxFileSize: 2000000,
               clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
               showAdvancedOptions: false,
               cropping: true,
            },
            (error, result) => {
               if (error) {
                  console.error("Upload error:", error);
                  onUploadError?.(error);
                  return;
               }


               if (result.event === "success") {
                  if (uploadedCount < 5) {
                     setUploadedCount(prev => prev + 1);
                     onUpload?.(result.info.secure_url);
                  } else {
                     widgetRef.current?.close();
                     alert("Maximum 5 images allowed.");
                  }
               }
            }
         );
      }

      // Cleanup function to remove script if component unmounts
      return () => {
         const existingScript = document.querySelector('script[src="https://widget.cloudinary.com/v2.0/global/all.js"]');
         if (existingScript && existingScript.parentNode) {
            existingScript.parentNode.removeChild(existingScript);
         }
      };
   }, [onUpload, onUploadError, multiple]);

   return (
      <div
         className="bg-transparent hover:bg-transparent text-neutral-300 w-full h-full flex items-center justify-center cursor-pointer"
         onClick={() => {
            if (uploadedCount >= 5) {
               alert("You can only upload up to 5 images.");
               return;
            }
            if (widgetRef.current) {
               widgetRef.current.open();
            } else {
               console.warn("Upload widget not initialized yet");
            }
         }}
      >
         {children}
      </div>
   );
}
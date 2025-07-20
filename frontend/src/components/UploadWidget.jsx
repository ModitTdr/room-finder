import { useEffect, useRef } from "react";
export default function UploadWidget({ onUpload, children }) {
   const widgetRef = useRef(null);

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
               multiple: false,
               maxFileSize: 2000000,
               clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
            },
            (error, result) => {
               if (!error && result.event === "success") {
                  onUpload(result.info.secure_url);
               }
            }
         );
      }
   }, []);


   return (
      <div
         className="bg-transparent hover:bg-transparent text-neutral-300 w-full h-full flex items-center justify-center cursor-pointer"
         onClick={() => widgetRef.current?.open()}
      >
         {children}
      </div>
   );
}
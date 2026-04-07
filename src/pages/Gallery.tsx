import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/aff82b67-7639-4645-833e-b9d51e5441e6.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/9015272e-26b9-46f8-ad31-b931f292a3d1.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/36fd1bc9-9df7-43ec-8686-90df6c5d31dc.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/93220445-fe4a-42c6-9cac-08abeb372b38.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/3e5bcc9c-59e6-44eb-9016-076f7cbfadfd.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/739400e4-e418-4e8a-9c42-cddfa08d7544.jpg"
  },
  {
    url : "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/855f571e-bf2a-49af-8489-ecd2a9620a83.jpeg"
  },
  {
    url : "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/c69529a8-311a-419f-adeb-df9cd3af9438.jpg"
  },
   {
    url : "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/1ad28687-e12b-4c93-92ea-471e5a0a5eea.jpg"
  },
  {
    url : "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/a7aad6d0-99e3-4bba-bd7d-079d8ca44759.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/b266f044-4c1c-4f3b-823f-f9cea6aaabf0.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/deee7881-f390-43b3-9c48-2289be3d1067.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/269bea2b-93f7-433f-9e30-2f13f923c179.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/6e40a619-8b3a-47a5-a418-3a089321fdbe.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/56a3bbfc-333d-447b-930c-772395f60a4f.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/1b98bad8-6919-4bda-bd84-d618ac5b59b5.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/05f365dd-b90a-4695-bf65-23c1d90c535a.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/2a1ba494-c713-4c53-b762-a49c12092de9.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/fb0bcef2-81a3-449f-9c3f-fc65c2ca2a4c.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/8e64ce0b-a89b-496a-bddf-4a358a89a962.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/1a1e03a0-2967-46b5-89ae-10dcd796aa1e.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/f101dc7a-f22c-4a8b-b455-75bc633e676b.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/0c9a2501-4f02-455e-b622-4e78b22064a5.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/da27a9a3-4a74-4654-846e-bc73d8942e11.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/57a8bd18-ca38-40ca-a16d-057981b54064.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/02dd4002-b2f6-4351-8162-272e904f32f7.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/e374ed58-81a8-45ac-ad7e-453f09ace2ab.jpg"
  },
  {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/76199a7d-ee77-4da8-8c15-0e8fbca6edc9.jpg"
  },
   {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/bcae1156-b60a-49d8-ade8-480babbc0c30.jpg"
  },
   {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/c49da551-52b4-43a0-857c-634310904541.jpg"
  },
   {
    url: "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/59b362e2-a3c9-4fe8-a389-8d76018d85d5.webp"
  },
  {
    url:"https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/ab6540cd-1441-4b6e-ac1f-0fae25f0185c/94a3be94-860f-4fee-80e1-47708d0fbbd9.jpg"
  }
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  return (
    <div className="min-h-screen bg-slate-50 py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Our Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            A glimpse into the lives we touch and the impact we create through our various initiatives and programs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {images.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer"
              onClick={() => setSelectedIndex(idx)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={image.url} 
                  alt={`Gallery Image ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 lg:p-10"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors z-[210]"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Arrows */}
            <button 
              className="absolute left-4 lg:left-10 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all z-[210]"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-8 h-8 lg:w-10 lg:h-10" />
            </button>

            <button 
              className="absolute right-4 lg:right-10 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all z-[210]"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8 lg:w-10 lg:h-10" />
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedIndex].url}
                alt={`Gallery Preview ${selectedIndex + 1}`}
                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
                referrerPolicy="no-referrer"
              />
              
              {/* Image Counter */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

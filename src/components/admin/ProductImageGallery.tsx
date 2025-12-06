import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
        <Package className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail Preview */}
      <div className="flex items-center gap-1">
        <div
          className="relative w-12 h-12 rounded-lg bg-muted overflow-hidden cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          {imageError[0] ? (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          ) : (
            <img
              src={images[0]}
              alt={productName}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
              onError={() => handleImageError(0)}
            />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <ZoomIn className="h-4 w-4 text-white" />
          </div>
        </div>
        {images.length > 1 && (
          <div className="flex flex-col gap-0.5">
            {images.slice(1, 3).map((img, idx) => (
              <div
                key={idx + 1}
                className="w-5 h-5 rounded bg-muted overflow-hidden cursor-pointer"
                onClick={() => {
                  setSelectedIndex(idx + 1);
                  setIsOpen(true);
                }}
              >
                {imageError[idx + 1] ? (
                  <div className="w-full h-full bg-muted" />
                ) : (
                  <img
                    src={img}
                    alt={`${productName} ${idx + 2}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(idx + 1)}
                  />
                )}
              </div>
            ))}
            {images.length > 3 && (
              <div
                className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                +{images.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur-xl">
          <DialogTitle className="sr-only">Product Images - {productName}</DialogTitle>
          <div className="relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-background/80"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Main Image */}
            <div className="relative aspect-square md:aspect-video bg-muted">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center p-8"
                >
                  {imageError[selectedIndex] ? (
                    <Package className="h-20 w-20 text-muted-foreground" />
                  ) : (
                    <img
                      src={images[selectedIndex]}
                      alt={`${productName} - Image ${selectedIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      onError={() => handleImageError(selectedIndex)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="p-4 border-t">
                <div className="flex gap-2 justify-center overflow-x-auto">
                  {images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedIndex === idx
                          ? 'border-primary'
                          : 'border-transparent hover:border-muted-foreground/50'
                      }`}
                      onClick={() => setSelectedIndex(idx)}
                    >
                      {imageError[idx] ? (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : (
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(idx)}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {selectedIndex + 1} / {images.length}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

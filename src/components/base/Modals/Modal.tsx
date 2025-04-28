import { useEffect, ReactNode, MouseEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  className = "rounded-xl",
}: ModalProps) => {
  // Handle ESC key press to close the modal
  useEffect(() => {
    // TypeScript doesn't like adding KeyboardEvent listeners to document directly
    // so we need to cast it as any or use a more specific approach
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // This is the key part - handle backdrop click
  const handleBackdropClick = () => {
    onClose();
  };

  // Stop propagation on modal click to prevent it from closing
  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Glassmorphism backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className={`z-10 bg-white/5 rounded-lg border-[#132236] border shadow-xl w-[80%] max-w-2xl p-6  m-4 ${className}`}
        onClick={handleModalClick}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

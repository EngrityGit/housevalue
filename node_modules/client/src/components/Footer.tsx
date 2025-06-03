import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const privacyContent = `
We respect your privacy and are committed to protecting your personal data. 
We collect only essential information to provide our services, including your address and contact details for report delivery.
Your data will not be shared with third parties without your consent. We use industry-standard security measures to keep your information safe.
You can request data deletion anytime by contacting us.
`;

const termsContent = `
By using RealEstatePro, you agree to provide accurate information and consent to receive reports and promotional emails.
We reserve the right to update the service and terms at any time.
Use of this service is subject to compliance with all applicable laws and regulations.
`;

export function Footer() {
  const [modalContent, setModalContent] = useState<"privacy" | "terms" | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalContent(null);
      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
    }

    if (modalContent) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalContent]);

  // Set initial focus on close button when modal opens
  useEffect(() => {
    if (modalContent && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [modalContent]);

  // Close modal if clicking outside content
  function handleClickOutside(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      setModalContent(null);
    }
  }

  return (
    <>
      <footer className="bg-white shadow-inner py-6 px-8 text-center text-sm text-gray-600 select-none flex justify-center space-x-6">
        <button
          className="hover:underline text-primaryBlue font-medium"
          onClick={() => setModalContent("privacy")}
        >
          Privacy Policy
        </button>
        <button
          className="hover:underline text-primaryBlue font-medium"
          onClick={() => setModalContent("terms")}
        >
          Terms of Service
        </button>
        <span className="text-gray-400">&copy; {new Date().getFullYear()} House Value</span>
      </footer>

      <AnimatePresence>
        {modalContent && (
          <motion.div
            id="modal-overlay"
            onClick={handleClickOutside}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-lg max-w-lg mx-4 p-6 relative shadow-lg max-h-[80vh] overflow-y-auto focus:outline-none"
              tabIndex={-1}
            >
              <button
                aria-label="Close modal"
                ref={closeBtnRef}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={() => setModalContent(null)}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {modalContent === "privacy" ? "Privacy Policy" : "Terms of Service"}
              </h2>
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {modalContent === "privacy" ? privacyContent : termsContent}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

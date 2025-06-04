import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X } from "lucide-react";

export function Header() {
  const [showHelp, setShowHelp] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowHelp(false);
      }
    };
    if (showHelp) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHelp]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b"
    >
      <motion.img
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  whileHover={{ scale: 1.05 }}
  src="/logo2.png"
  alt="Logo"
  className="h-10 w-auto"
/>

      <button
        onClick={() => setShowHelp(true)}
        className="relative p-2 rounded-full hover:bg-brightOrange/10 transition-colors"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <HelpCircle className="text-brightOrange w-6 h-6" />
        </motion.div>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              ref={modalRef}
              initial={{ y: -50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -40, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-carbonGray text-white rounded-xl shadow-lg p-6 max-w-xl w-full relative"
            >
              <button
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-brightOrange mb-4">How It Works</h2>

              <ol className="list-decimal list-inside space-y-3 text-sm leading-relaxed">
                <li>Enter your Langley or surrounding region address.</li>
                <li>Answer a few quick questions about your property (type, unit, bedrooms, bathrooms, basement status, timeline, etc).</li>
                <li>Provide your contact info so we can get back to you.</li>
                <li>You will receive an email from a professional realtor with an accurate estimation.</li>
                <li>If needed, they can also assist you in selling your home.</li>
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWizardStore } from "@/store/wizardStore";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const reset = useWizardStore((state) => state.reset)

  // Get email from the wizard store (assuming the email was saved in the last step)
  const email = useWizardStore((state) => state.data.email);

  // Pre-generate confetti colors and positions once per render
  const confetti = React.useMemo(() => 
    [...Array(10)].map(() => ({
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
      left: `${Math.random() * 100}%`,
    })), []
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-6 text-primaryText font-inter">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md text-center"
      >
        {/* Checkmark SVG + Confetti animation */}
        <div className="mx-auto mb-8 w-32 h-32 relative">
          {/* Checkmark */}
          <svg
            className="w-32 h-32 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>

          {/* Confetti (simple circles falling) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            {confetti.map(({ color, left }, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 1 }}
                animate={{ y: 60, opacity: 0 }}
                transition={{
                  delay: 0.7 + i * 0.1,
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: color,
                  position: "absolute",
                  left,
                  top: 0,
                }}
              />
            ))}
          </motion.div>
        </div>

        <h2 className="text-3xl font-semibold mb-4 text-primaryBlue">
           Submission Received Successfully
        </h2>

        <p className="text-gray-700 mb-8">
          A professional realtor will reach out to you via{" "}
          <span className="font-medium">{email ?? "your email"}</span> shortly.
            If you have any questions, you can consult with them directly.
          <br />
        <br />
        Thank you!
      </p>

        <button
          onClick={() => {reset();  navigate("/")}}
          aria-label="Back to Home"
          className="bg-deepGreen text-lemonYellow py-3 px-8 rounded-lg font-semibold shadow-md hover:bg-lemonYellow hover:text-deepGreen transition-colors duration-300"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useWizardStore } from "@/store/wizardStore"
import { toast } from "react-hot-toast"
import emailjs from "@emailjs/browser"


const steps = [
  {
    id: "propertyType",
    question: "What type of home is it?",
    options: ["Apartment", "Condo", "Detached House", "Townhouse", "Duplex", "Others"],
  },
  {
    id: "unitNumber",
    question: "What's the unit number? (if applicable)",
    inputOnly: true,
  },
  {
    id: "bedrooms",
    question: "How many bedrooms does your house have?",
    options: ["1", "2", "3", "4", "5+"],
  },
  {
    id: "bathrooms",
    question: "How many bathrooms does your house have?",
    options: ["1","1.5","2","2.5", "3","3.5", "4","4.5", "5+"],
  },
  {
    id: "basement",
    question: "Does your house have a basement?",
    options: ["Yes", "No"],
  },
  {
    id: "basementStatus",
    question: "What is the status of the basement?",
    options: ["Finished", "Unfinished", "Partially Finished", "Don't Know", "Not Applicable"],
  },
  {
    id: "sellingTimeline",
    question: "Are you thinking to sell your house?",
    options: [
      "Yes, as soon as possible",
      "Yes, in 1-3 months",
      "Yes, in 3-6 months",
      "Yes, in 6-12 months",
      "No, just curious",
    ],
  },
  {
    id: "basicInfo",
    question: "Your contact info",
  },
]


const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function WizardPage() {
  const step = useWizardStore((state) => state.step)
  const setStep = useWizardStore((state) => state.setStep)
  const nextStep = useWizardStore((state) => state.nextStep)
  const prevStep = useWizardStore((state) => state.prevStep)
  const data = useWizardStore((state) => state.data)
  const setData = useWizardStore((state) => state.setData)
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

  const [loading, setLoading] = useState(false)

  // Redirect to home if no address present
  useEffect(() => {
    if (!data.address) navigate("/")
  }, [data.address, navigate])

  // Update data for a given key
  const handleOptionSelect = (key: string, value: any) => {
    setData(key, value)
  }

  // Validate current step field to enable Next button
  const isStepValid = () => {
    const currentStep = steps[step - 1]
    if (!currentStep) return false

    const val = data[currentStep.id]

    if (currentStep.inputOnly) {
      // If current step is unitNumber, validate only if propertyType is Apartment or Condo
      if (currentStep.id === "unitNumber") {
        if (
          data.propertyType === "Apartment" ||
          data.propertyType === "Condo"
        ) {
          return val && val.trim() !== ""
        }
        // If not Apartment or Condo, unitNumber is optional
        return true
      }
      return val && val.trim() !== ""
    } else if (currentStep.options) {
      return val && currentStep.options.includes(val)
    }

    return true
  }

  // Submit form on last step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      address,
      firstName,
      lastName,
      email,
      phone,
      consent,
      bedrooms,
      bathrooms,
      basement,
      basementStatus,
      sellingTimeline,
      propertyType,
      unitNumber,
    } = data

    if (
      !address ||
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      consent !== true
    ) {
      toast.error("Please fill all fields and give consent.")
      return
    }

    // If propertyType requires unitNumber, validate that too
    if (
      (propertyType === "Apartment" || propertyType === "Condo") &&
      (!unitNumber || unitNumber.trim() === "")
    ) {
      toast.error("Please enter the unit number for your property.")
      setStep(2) // Jump to unitNumber step
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          firstName,
          lastName,
          email,
          phone,
          consent,
          bedrooms,
          bathrooms,
          basement,
          basementStatus,
          sellingTimeline,
          propertyType,
          unitNumber,
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Failed to send report request")
      }

          const templateParams = {
      address,
      firstName,
      lastName,
      email,
      phone,
      bedrooms,
      bathrooms,
      basement,
      basementStatus,
      sellingTimeline,
      propertyType,
      unitNumber: unitNumber || "N/A",
    }

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);


      toast.success("Report request sent! We'll email you soon.")
      navigate("/confirmation")
    } catch (error: any) {
      console.error("Backend API error:", error)
      toast.error(error?.message || "Failed to send report request. Please try again.")
    } finally {
      setLoading(false)
    }
  }



  const variants = {
    initial: { opacity: 0, x: 80, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -80, scale: 0.95 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white text-gray-900 flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-10 border border-gray-200">
        <div className="text-sm text-gray-500 mb-6 text-right">
          Step {step} of {steps.length}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step < steps.length && (
            <motion.div
              key={steps[step - 1].id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
            >
              <h2
                className="text-3xl font-bold mb-6 px-2 text-white  bg-primaryBlue rounded-lg"
               
              >
                {steps[step - 1].question}
              </h2>

              {steps[step - 1].inputOnly ? (
                <Input
                  type="text"
                  aria-label={steps[step - 1].question}
                  value={data[steps[step - 1].id] || ""}
                  onChange={(e) =>
                    handleOptionSelect(steps[step - 1].id, e.target.value)
                  }
                  placeholder="Enter your unit number here"
                  className="text-lg p-4 border border-primaryBlue/60 rounded-lg"
                />
              ) : (
               <RadioGroup
  aria-label={steps[step - 1].question}
  value={data[steps[step - 1].id] || ""}
  onValueChange={(value) =>
    handleOptionSelect(steps[step - 1].id, value)
  }
>
  {steps[step - 1].options && steps[step - 1].options.length > 6 ? (
    <div className="flex w-full gap-6">
      {/* Left column */}
      <div className="flex flex-col w-1/2 space-y-4">
        {steps[step - 1].options.slice(0, Math.ceil(steps[step - 1].options.length / 2)).map((option) => (
          <motion.label
            key={option}
            htmlFor={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-4 cursor-pointer rounded-lg p-4 border border-gray-300 hover:border-primaryBlue transition"
          >
            <RadioGroupItem
              value={option}
              id={option}
              className="h-5 w-5 border border-gray-400 checked:border-primaryBlue checked:bg-brightOrange"
            />
            <span className="text-lg font-medium">{option}</span>
          </motion.label>
        ))}
      </div>

      {/* Right column */}
      <div className="flex flex-col w-1/2 space-y-4">
        {steps[step - 1].options.slice(Math.ceil(steps[step - 1].options.length / 2)).map((option) => (
          <motion.label
            key={option}
            htmlFor={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-4 cursor-pointer rounded-lg p-4 border border-gray-300 hover:border-primaryBlue transition"
          >
            <RadioGroupItem
              value={option}
              id={option}
              className="h-5 w-5 border border-gray-400 checked:border-primaryBlue checked:bg-brightOrange"
            />
            <span className="text-lg font-medium">{option}</span>
          </motion.label>
        ))}
      </div>
    </div>
  ) : (
    // Default: single column, full width for 6 or fewer options
    <div className="flex flex-col w-full space-y-4">
      {steps[step - 1].options?.map((option) => (
        <motion.label
          key={option}
          htmlFor={option}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-4 cursor-pointer rounded-lg p-4 border border-gray-300 hover:border-primaryBlue transition"
        >
          <RadioGroupItem
            value={option}
            id={option}
            className="h-5 w-5 border border-gray-400 checked:border-primaryBlue checked:bg-brightOrange"
          />
          <span className="text-lg font-medium">{option}</span>
        </motion.label>
      ))}
    </div>
  )}
</RadioGroup>


              )}

              <div className="mt-10 flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1 || loading}
                  className="border-black text-black hover:border-white hover:bg-brightOrange hover:text-white transition"
                  aria-disabled={step === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    isStepValid()
                      ? nextStep()
                      : toast.error("Please complete the field.")
                  }
                  disabled={!isStepValid() || loading}
                  className="bg-blue-400 text-white hover:bg-primaryBlue hover:text-white shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-disabled={!isStepValid() || loading}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === steps.length && (
            <motion.form
              key="basicInfo"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
              aria-label="Basic information form"
            >
              <h2 className="text-3xl font-bold mb-6 px-2 text-white  bg-primaryBlue rounded-lg">
                Basic Informations
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-semibold">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={data.firstName || ""}
                    onChange={(e) => setData("firstName", e.target.value)}
                    required
                    placeholder="First Name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-sm font-semibold">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={data.lastName || ""}
                    onChange={(e) => setData("lastName", e.target.value)}
                    required
                    placeholder="Last Name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email || ""}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone || ""}
                    onChange={(e) => setData("phone", e.target.value)}
                    required
                    placeholder="123-456-7890"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="consent"
                  checked={!!data.consent}
                  onCheckedChange={(checked) => setData("consent", checked === true)}
                  required
                />
                <Label htmlFor="consent" className="text-sm">
                  I agree to receive emails about my report and updates.
                </Label>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={loading}
                  className=" border-black text-black hover:border-white hover:bg-brightOrange hover:text-white  transition"
                >
                  Previous
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-400 text-white hover:bg-primaryBlue hover:text-white  shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useWizardStore } from "@/store/wizardStore"
import { toast } from "react-hot-toast"

const steps = [
  {
    id: "bedrooms",
    question: "How many bedrooms does your house have?",
    options: ["1", "2", "3", "4", "5+"],
  },
  {
    id: "bathrooms",
    question: "How many bathrooms does your house have?",
    options: ["1", "2", "3", "4", "5+"],
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

export default function WizardPage() {
  const step = useWizardStore((state) => state.step)
  const setStep = useWizardStore((state) => state.setStep)
  const nextStep = useWizardStore((state) => state.nextStep)
  const prevStep = useWizardStore((state) => state.prevStep)
  const data = useWizardStore((state) => state.data)
  const setData = useWizardStore((state) => state.setData)
  const navigate = useNavigate()

  useEffect(() => {
    if (!data.address) navigate("/")
  }, [data.address, navigate])

  const handleOptionSelect = (key: string, value: any) => {
    setData(key, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { firstName, lastName, email, phone, consent } = data
    if (!firstName || !lastName || !email || !phone || !consent) {
      toast.error("Please fill all fields and give consent.")
      return
    }
    toast.success("Report request sent! We'll email you soon.")
    navigate("/confirmation")
  
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
          Step {step} of 4
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step <= 3 && (
            <motion.div
              key={steps[step - 1].id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-primaryBlue">
                {steps[step - 1].question}
              </h2>

              <RadioGroup
                value={data[steps[step - 1].id] || ""}
                onValueChange={(value) => handleOptionSelect(steps[step - 1].id, value)}
                className="space-y-4"
              >
                {steps[step - 1].options.map((option) => (
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
                      className="h-5 w-5 border border-gray-400 checked:border-primaryBlue checked:bg-primaryBlue"
                    />
                    <span className="text-lg font-medium">{option}</span>
                  </motion.label>
                ))}
              </RadioGroup>

              <div className="mt-10 flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="border-black text-black hover:bg-black hover:text-white transition"
                >
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    data[steps[step - 1].id]
                      ? nextStep()
                      : toast.error("Please select an option.")
                  }
                  className="bg-blue-400 text-white hover:bg-blue-600 shadow-lg transition"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.form
              key="basicInfo"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-primaryBlue mb-6">
                Basic Information
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
                  />
                </div>
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
                />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="consent"
                  checked={data.consent || false}
                  onCheckedChange={(checked) => setData("consent", !!checked)}
                  required
                />
                <Label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer">
                  I consent to receive promotional real estate emails.
                </Label>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="border-black text-black hover:bg-black hover:text-white transition"
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition"
                >
                  Get My Report
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

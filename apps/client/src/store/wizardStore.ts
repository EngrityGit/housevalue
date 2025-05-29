import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WizardState {
  step: number
  data: {
    [key: string]: any
  }
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setData: (key: string, value: any) => void
  reset: () => void
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      step: 1,
      data: {},
      setStep: (step) => set({ step }),
      nextStep: () => set((state) => ({ step: state.step + 1 })),
      prevStep: () => set((state) => ({ step: state.step - 1 })),
      setData: (key, value) =>
        set((state) => ({ data: { ...state.data, [key]: value } })),
      reset: () => set({ step: 1, data: {} }),
    }),
    {
      name: 'wizard-storage', // LocalStorage key
    }
  )
)

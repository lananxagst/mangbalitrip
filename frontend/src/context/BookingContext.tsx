import { createContext, useContext, useState, ReactNode } from "react";
import type { Package } from "../data/packages";

export interface BookingForm {
  date: string;
  passengers: number;
  pickupLocation: string;
  name: string;
  email: string;
  whatsapp: string;
  specialRequests: string;
}

interface BookingContextType {
  isOpen: boolean;
  selectedPackage: Package | null;
  selectedDriverPackage: { title: string; price: number; duration: string } | null;
  form: BookingForm;
  step: 1 | 2 | 3;
  openBooking: (pkg: Package) => void;
  openDriverBooking: (pkg: { title: string; price: number; duration: string }) => void;
  closeBooking: () => void;
  setStep: (s: 1 | 2 | 3) => void;
  updateForm: (fields: Partial<BookingForm>) => void;
}

const defaultForm: BookingForm = {
  date: "",
  passengers: 1,
  pickupLocation: "",
  name: "",
  email: "",
  whatsapp: "",
  specialRequests: "",
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedDriverPackage, setSelectedDriverPackage] = useState<{
    title: string;
    price: number;
    duration: string;
  } | null>(null);
  const [form, setForm] = useState<BookingForm>(defaultForm);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const openBooking = (pkg: Package) => {
    setSelectedPackage(pkg);
    setSelectedDriverPackage(null);
    setForm(defaultForm);
    setStep(1);
    setIsOpen(true);
  };

  const openDriverBooking = (pkg: { title: string; price: number; duration: string }) => {
    setSelectedDriverPackage(pkg);
    setSelectedPackage(null);
    setForm(defaultForm);
    setStep(1);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
    setSelectedPackage(null);
    setSelectedDriverPackage(null);
    setForm(defaultForm);
    setStep(1);
  };

  const updateForm = (fields: Partial<BookingForm>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        selectedPackage,
        selectedDriverPackage,
        form,
        step,
        openBooking,
        openDriverBooking,
        closeBooking,
        setStep,
        updateForm,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

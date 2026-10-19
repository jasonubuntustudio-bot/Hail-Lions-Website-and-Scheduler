"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Car,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

const SERVICE_TYPES = [
  { id: "hail_damage", label: "Hail Damage" },
  { id: "door_ding", label: "Door Ding / Dent" },
  { id: "crease", label: "Crease / Larger Dent" },
  { id: "classic_car", label: "Classic Car PDR" },
  { id: "other_pdr", label: "Other Paintless Repair" },
];

const TIME_WINDOWS = [
  "Morning (8 AM – 12 PM)",
  "Afternoon (12 PM – 4 PM)",
  "Late Afternoon (4 PM – 7 PM)",
];

export default function BookPage() {
  const [step, setStep] = useState<Step>(1);
  const [photos, setPhotos] = useState<File[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [vehicle, setVehicle] = useState({
    year: "",
    make: "",
    model: "",
    color: "",
    vin: "",
  });
  const [isInsurance, setIsInsurance] = useState(false);
  const [claim, setClaim] = useState({
    claimNumber: "",
    adjusterName: "",
    adjusterPhone: "",
  });
  const [location, setLocation] = useState({
    address: "",
    city: "",
    zip: "",
  });
  const [contact, setContact] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedWindow, setSelectedWindow] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const canProceed = () => {
    if (step === 1) return photos.length > 0 || serviceType !== "";
    if (step === 2) return !!(vehicle.year && vehicle.make && vehicle.model);
    if (step === 3) return !!(location.address && location.city);
    if (step === 4)
      return !!(
        contact.fullName &&
        contact.phone &&
        selectedDate &&
        selectedWindow
      );
    if (step === 5) return agreed;
    return false;
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="text-cyan-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Request Received
          </h1>
          <p className="text-gray-300 mb-6">
            Jason or a technician will review your photos and contact you
            shortly at{" "}
            <span className="text-cyan-400">{contact.phone}</span> to confirm
            the quote and schedule.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Most responses happen within 30–60 minutes during business hours.
          </p>
          <Link
            href="/"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-white">Book Service</h1>
        <span className="text-sm text-gray-400">Step {step} of 5</span>
      </div>
      <div className="h-1 bg-gray-900 rounded mb-8">
        <div
          className="h-full bg-cyan-500 rounded transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Camera className="text-cyan-400" /> Damage Photos
            </h2>
            <p className="text-gray-400 text-sm">
              Upload clear photos of the dents. Fastest way to get an accurate
              quote.
            </p>
          </div>
          <label className="block border-2 border-dashed border-gray-700 hover:border-cyan-500 rounded-2xl p-8 text-center cursor-pointer transition">
            <Upload className="mx-auto text-gray-500 mb-3" size={32} />
            <span className="text-gray-300 font-medium">
              Tap to upload photos
            </span>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10 MB each</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
          {photos.length > 0 && (
            <p className="text-cyan-400 text-sm">
              {photos.length} photo{photos.length > 1 ? "s" : ""} selected
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type of repair
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_TYPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceType(s.id)}
                  className={`text-left px-4 py-3 rounded-xl border transition ${
                    serviceType === s.id
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-gray-700 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Car className="text-cyan-400" /> Vehicle Details
            </h2>
            <p className="text-gray-400 text-sm">
              Required for accurate quoting and warranty records.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Year *</label>
              <input
                type="number"
                placeholder="2022"
                value={vehicle.year}
                onChange={(e) =>
                  setVehicle({ ...vehicle, year: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Make *</label>
              <input
                type="text"
                placeholder="Toyota"
                value={vehicle.make}
                onChange={(e) =>
                  setVehicle({ ...vehicle, make: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Model *</label>
              <input
                type="text"
                placeholder="Camry"
                value={vehicle.model}
                onChange={(e) =>
                  setVehicle({ ...vehicle, model: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Color</label>
              <input
                type="text"
                placeholder="Silver"
                value={vehicle.color}
                onChange={(e) =>
                  setVehicle({ ...vehicle, color: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              VIN (optional)
            </label>
            <input
              type="text"
              placeholder="For warranty & insurance"
              value={vehicle.vin}
              onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
            />
          </div>
          <div className="border border-gray-800 rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isInsurance}
                onChange={(e) => setIsInsurance(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-500"
              />
              <span className="text-white font-medium">
                This is an insurance claim
              </span>
            </label>
            {isInsurance && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Claim number"
                  value={claim.claimNumber}
                  onChange={(e) =>
                    setClaim({ ...claim, claimNumber: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Adjuster name"
                  value={claim.adjusterName}
                  onChange={(e) =>
                    setClaim({ ...claim, adjusterName: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                />
                <input
                  type="tel"
                  placeholder="Adjuster phone"
                  value={claim.adjusterPhone}
                  onChange={(e) =>
                    setClaim({ ...claim, adjusterPhone: e.target.value })
                  }
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <MapPin className="text-cyan-400" /> Service Location
            </h2>
            <p className="text-gray-400 text-sm">
              We come to you. Enter the address where the vehicle will be.
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              placeholder="123 Main St"
              value={location.address}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">City *</label>
              <input
                type="text"
                placeholder="Katy"
                value={location.city}
                onChange={(e) =>
                  setLocation({ ...location, city: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">ZIP</label>
              <input
                type="text"
                placeholder="77449"
                value={location.zip}
                onChange={(e) =>
                  setLocation({ ...location, zip: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Service areas: Houston, Baytown, Katy, Cypress, The Woodlands,
            Spring, Pearland, Sugar Land, Conroe, and surrounding cities.
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Contact & Preferred Time
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={contact.fullName}
                onChange={(e) =>
                  setContact({ ...contact, fullName: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone *</label>
              <input
                type="tel"
                placeholder="(281) 000-0000"
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Preferred Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:border-cyan-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Time Window *
            </label>
            <div className="space-y-2">
              {TIME_WINDOWS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSelectedWindow(w)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                    selectedWindow === w
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-gray-700 text-gray-300"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="text-cyan-400" /> Guarantee & Policy
            </h2>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm text-gray-300 space-y-3">
            <p>
              <strong className="text-white">100% Satisfaction Guarantee:</strong>{" "}
              If you are not completely satisfied with the repair, you do not
              owe anything.
            </p>
            <p>
              <strong className="text-white">Lifetime Warranty:</strong> All
              paintless dent repairs carry a lifetime warranty for as long as
              you own the vehicle.
            </p>
            <p>
              <strong className="text-white">Mobile Service:</strong> A
              technician will come to the address you provided. Please ensure
              the vehicle is accessible and in a safe location.
            </p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded accent-cyan-500"
            />
            <span className="text-gray-300 text-sm">
              I have read and agree to the satisfaction guarantee, lifetime
              warranty terms, and mobile service policies of Hail Lions LLC.
            </span>
          </label>
        </div>
      )}

      <div className="flex justify-between mt-10 pt-6 border-t border-gray-800">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2"
          >
            <ChevronLeft size={18} /> Back
          </button>
        ) : (
          <div />
        )}
        {step < 5 ? (
          <button
            type="button"
            disabled={!canProceed()}
            onClick={() => setStep((s) => (s + 1) as Step)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold px-6 py-2.5 rounded-lg transition"
          >
            Continue <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            disabled={!canProceed()}
            onClick={() => setSubmitted(true)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold px-6 py-2.5 rounded-lg transition"
          >
            Submit Request
          </button>
        )}
      </div>
    </div>
  );
}

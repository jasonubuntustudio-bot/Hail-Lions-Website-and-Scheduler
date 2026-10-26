"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Car,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  ImagePlus,
  Lock,
} from "lucide-react";
import { SERVICE_TYPES } from "@/lib/booking";
import { PHONE, PHONE_TEL } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

export default function BookPage() {
  const [step, setStep] = useState<Step>(1);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
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
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const urls = photos.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [photos]);

  /** Shrink phone photos so the whole request fits under Vercel body limits */
  async function compressImage(file: File): Promise<File> {
    if (!file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name)) {
      return file;
    }
    // Already small
    if (file.size < 900_000 && file.type === "image/jpeg") return file;

    try {
      const bitmap = await createImageBitmap(file);
      const maxEdge = 1600;
      const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.72)
      );
      if (!blob) return file;
      const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      return new File([blob], name, { type: "image/jpeg" });
    } catch {
      return file;
    }
  }

  const addPhotos = async (list: FileList | null) => {
    if (!list?.length) return;
    const incoming = Array.from(list).slice(0, 8);
    const compressed: File[] = [];
    for (const f of incoming) {
      compressed.push(await compressImage(f));
    }
    setPhotos((p) => [...p, ...compressed].slice(0, 8));
  };

  const removePhoto = (index: number) => {
    setPhotos((p) => p.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    if (step === 1) return photos.length > 0 || serviceType !== "";
    if (step === 2) return !!(vehicle.year && vehicle.make && vehicle.model);
    if (step === 3) return !!(location.address && location.city);
    if (step === 4) return !!(contact.fullName && contact.phone && agreed);
    return false;
  };

  const handleSubmit = async () => {
    if (!canProceed() || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const form = new FormData();
      form.set("fullName", contact.fullName);
      form.set("phone", contact.phone);
      form.set("email", contact.email);
      form.set("serviceType", serviceType);
      form.set("vehicleYear", vehicle.year);
      form.set("vehicleMake", vehicle.make);
      form.set("vehicleModel", vehicle.model);
      form.set("vehicleColor", vehicle.color);
      form.set("vehicleVin", vehicle.vin);
      form.set("address", location.address);
      form.set("city", location.city);
      form.set("zip", location.zip);
      form.set("isInsurance", String(isInsurance));
      form.set("claimNumber", claim.claimNumber);
      form.set("adjusterName", claim.adjusterName);
      form.set("adjusterPhone", claim.adjusterPhone);
      form.set("notes", notes);
      photos.forEach((f) => form.append("photos", f));

      const res = await fetch("/api/book", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setSubmitError(data.error || "Could not send request. Please call us.");
        return;
      }
      if (data.photoWarning) {
        setSubmitError(data.photoWarning);
      }
      setConfirmationCode(data.confirmationCode || "");
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please call us or try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20">
            <Check className="text-cyan-400" size={40} />
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Photos Received</h1>
          {confirmationCode && (
            <p className="mb-4 text-lg">
              Code{" "}
              <span className="font-mono font-bold text-cyan-400">
                {confirmationCode}
              </span>
            </p>
          )}
          <p className="mb-4 text-gray-300">
            Our team will review your photos and send a quote. You&apos;ll get
            an alert when it&apos;s ready — then you can accept and pick a time.
          </p>
          {submitError && (
            <p className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {submitError}
            </p>
          )}
          <p className="mb-6 text-sm text-gray-500">
            Save your code. Check status anytime below.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {confirmationCode && (
              <Link
                href={`/quote/${confirmationCode}`}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
              >
                Track my quote
              </Link>
            )}
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-xl border border-cyan-500/50 px-6 py-3 font-semibold text-cyan-400"
            >
              Call {PHONE}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none";

  return (
    <div className="mx-auto max-w-2xl px-3 pb-28 pt-4 sm:px-4 sm:pb-10 sm:pt-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white sm:text-xl">
          Get a Quote
        </h1>
        <span className="text-sm text-gray-400">Step {step} of 4</span>
      </div>
      <p className="mb-4 text-sm text-gray-400">
        1) Send photos & info → 2) We quote → 3) You accept → 4) Pick a time
      </p>
      <div className="mb-6 h-1.5 rounded bg-gray-900 sm:mb-8">
        <div
          className="h-full rounded bg-cyan-500 transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold text-white">
              <Camera className="text-cyan-400" size={22} />
              Photos of the damage
            </h2>
            <p className="mb-2 text-sm text-gray-400">
              Clear photos get the fastest, most accurate quote. Up to 8 images.
            </p>
            <p className="mb-4 flex items-start gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-200/90">
              <Lock size={14} className="mt-0.5 shrink-0" />
              Photos go only to Hail Lions techs for quoting — not shown on the
              public website.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-cyan-500/5 px-3 py-6 transition hover:border-cyan-400">
                <Camera className="text-cyan-400" size={28} />
                <span className="text-sm font-medium text-white">Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    void addPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-cyan-500/5 px-3 py-6 transition hover:border-cyan-400">
                <ImagePlus className="text-cyan-400" size={28} />
                <span className="text-sm font-medium text-white">Gallery</span>
                <span className="text-[10px] text-gray-500">JPG/PNG best</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    void addPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Photos are compressed on your device before upload so they save
              reliably.
            </p>

            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {previews.map((src, i) => (
                  <div
                    key={src}
                    className="relative aspect-square overflow-hidden rounded-xl border border-gray-700"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Damage photo ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/80 p-1 text-white"
                      aria-label="Remove photo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              {photos.length}/8 photos selected
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-medium text-white">What needs repair?</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {SERVICE_TYPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceType(s.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    serviceType === s.id
                      ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                      : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500"
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
        <div className="space-y-4">
          <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold text-white">
            <Car className="text-cyan-400" size={22} />
            Vehicle
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="Year *"
              value={vehicle.year}
              onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
              inputMode="numeric"
            />
            <input
              className={inputClass}
              placeholder="Make *"
              value={vehicle.make}
              onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
            />
          </div>
          <input
            className={inputClass}
            placeholder="Model *"
            value={vehicle.model}
            onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="Color"
              value={vehicle.color}
              onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="VIN (optional)"
              value={vehicle.vin}
              onChange={(e) => setVehicle({ ...vehicle, vin: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-3">
            <input
              type="checkbox"
              checked={isInsurance}
              onChange={(e) => setIsInsurance(e.target.checked)}
              className="h-5 w-5 accent-cyan-500"
            />
            <span className="text-sm text-gray-300">This is an insurance claim</span>
          </label>
          {isInsurance && (
            <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-950 p-4">
              <input
                className={inputClass}
                placeholder="Claim number"
                value={claim.claimNumber}
                onChange={(e) =>
                  setClaim({ ...claim, claimNumber: e.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Adjuster name"
                value={claim.adjusterName}
                onChange={(e) =>
                  setClaim({ ...claim, adjusterName: e.target.value })
                }
              />
              <input
                className={inputClass}
                placeholder="Adjuster phone"
                value={claim.adjusterPhone}
                onChange={(e) =>
                  setClaim({ ...claim, adjusterPhone: e.target.value })
                }
                type="tel"
              />
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold text-white">
            <MapPin className="text-cyan-400" size={22} />
            Service location
          </h2>
          <p className="text-sm text-gray-400">
            We come to you — home, work, or dealership.
          </p>
          <input
            className={inputClass}
            placeholder="Street address *"
            value={location.address}
            onChange={(e) =>
              setLocation({ ...location, address: e.target.value })
            }
            autoComplete="street-address"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              placeholder="City *"
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
              autoComplete="address-level2"
            />
            <input
              className={inputClass}
              placeholder="ZIP"
              value={location.zip}
              onChange={(e) => setLocation({ ...location, zip: e.target.value })}
              inputMode="numeric"
              autoComplete="postal-code"
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="mb-1 flex items-center gap-2 text-xl font-semibold text-white">
            <Shield className="text-cyan-400" size={22} />
            Contact & send
          </h2>
          <input
            className={inputClass}
            placeholder="Full name *"
            value={contact.fullName}
            onChange={(e) =>
              setContact({ ...contact, fullName: e.target.value })
            }
            autoComplete="name"
          />
          <input
            className={inputClass}
            placeholder="Phone *"
            type="tel"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            autoComplete="tel"
          />
          <input
            className={inputClass}
            placeholder="Email (optional — for quote alerts)"
            type="email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            autoComplete="email"
          />
          <textarea
            className={`${inputClass} min-h-[88px] resize-y`}
            placeholder="Notes (gate code, etc.)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4 text-sm text-gray-300">
            <p>
              <span className="text-gray-500">Photos:</span> {photos.length}
            </p>
            <p>
              <span className="text-gray-500">Service:</span>{" "}
              {SERVICE_TYPES.find((s) => s.id === serviceType)?.label || "—"}
            </p>
            <p>
              <span className="text-gray-500">Vehicle:</span> {vehicle.year}{" "}
              {vehicle.make} {vehicle.model}
            </p>
            <p>
              <span className="text-gray-500">Where:</span> {location.address},{" "}
              {location.city}
            </p>
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5 accent-cyan-500"
            />
            <span className="text-sm text-gray-300">
              I understand photos are for quoting only. Hail Lions will send a
              quote before any work is scheduled. 100% satisfaction guarantee.
            </span>
          </label>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-800 bg-black/95 safe-bottom backdrop-blur sm:static sm:mt-10 sm:border-0 sm:bg-transparent sm:pt-6 sm:backdrop-blur-none">
        {submitError && (
          <p className="px-4 pt-2 text-center text-sm text-red-400 sm:px-0">
            {submitError}
          </p>
        )}
        <div className="mx-auto flex max-w-2xl gap-3 px-3 py-3 sm:px-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="inline-flex min-h-[48px] items-center justify-center gap-1 rounded-xl border border-gray-700 px-4 font-medium text-gray-300"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep((s) => (s + 1) as Step)}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 font-bold text-black transition enabled:hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              disabled={!canProceed() || submitting}
              onClick={handleSubmit}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 font-bold text-black transition enabled:hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              {submitting ? "Sending…" : "Send for Quote"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { FileUpload } from "@/components/forms/file-upload";
import { ArrowForwardIcon, CheckCircleIcon } from "@/components/icons";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type SmartFormDict = Dictionary["smartForm"];
type DynamicRow = { id: number; other: boolean };

const DRAFT_KEY = "taleaLeadDraft";
const ERROR_COLOR = "#d95553";
const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 30 * 1024 * 1024;

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-gray-400 focus:border-brand focus:ring-4 focus:ring-brand/10";
const fieldLabelClass = "grid gap-1.5 text-sm font-semibold text-gray-600";
const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toLocaleDigits(value: number, locale: Locale) {
  return locale === "fa" ? String(value).replace(/[0-9]/g, (d) => faDigits[Number(d)]) : String(value);
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function formToObject(form: HTMLFormElement): Record<string, string | string[]> {
  const data: Record<string, string | string[]> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value !== "string" || !value) return;
    if (data[key] !== undefined) {
      data[key] = ([] as string[]).concat(data[key], value);
    } else {
      data[key] = value;
    }
  });
  return data;
}

function ChoiceCard({
  type,
  name,
  value,
  checked,
  onChange,
  icon,
  label,
  description,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  icon: string;
  label: string;
  description: string;
}) {
  const id = useId();
  return (
    <div>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`flex h-full cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition-colors ${
          checked
            ? "border-brand bg-brand-soft shadow-[0_0_0_1px_var(--color-brand)]"
            : "border-black/10 bg-white hover:border-brand-border"
        }`}
      >
        <span
          className={`grid h-9 w-9 place-items-center rounded-lg text-xs font-extrabold ${
            checked ? "bg-brand text-white" : "bg-gray-150 text-gray-600"
          }`}
        >
          {icon}
        </span>
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-[13px] leading-relaxed text-gray-500">{description}</span>
      </label>
    </div>
  );
}

function ChipOption({
  type,
  name,
  value,
  checked,
  onChange,
  label,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  const id = useId();
  return (
    <div>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`inline-flex min-h-9 cursor-pointer items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
          checked ? "border-ink bg-ink text-white" : "border-black/10 bg-white text-gray-600 hover:border-black/20"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function DynamicListSection({
  rows,
  setRows,
  heading,
  description,
  addLabel,
  typeLabel,
  types,
  otherLabel,
  otherPlaceholder,
  valueLabel,
  valuePlaceholder,
  valueRequired,
  valueType,
  namePrefix,
  removeLabel,
}: {
  rows: DynamicRow[];
  setRows: (rows: DynamicRow[]) => void;
  heading: string;
  description: string;
  addLabel: string;
  typeLabel: string;
  types: string[];
  otherLabel: string;
  otherPlaceholder: string;
  valueLabel: string;
  valuePlaceholder: string;
  valueRequired: boolean;
  valueType: "text" | "email" | "tel";
  namePrefix: string;
  removeLabel: string;
}) {
  const nextId = useRef(rows.length);

  function addRow() {
    nextId.current += 1;
    setRows([...rows, { id: nextId.current, other: false }]);
  }

  function removeRow(id: number) {
    if (rows.length <= 1) return;
    setRows(rows.filter((row) => row.id !== id));
  }

  function setRowOther(id: number, other: boolean) {
    setRows(rows.map((row) => (row.id === id ? { ...row, other } : row)));
  }

  return (
    <div className="border-t border-black/5 pt-7 first-of-type:border-0 first-of-type:pt-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-ink">{heading}</h3>
          <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-gray-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {addLabel}
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-wrap items-start gap-3">
            <div className="w-full shrink-0 sm:w-40">
              <label className={fieldLabelClass}>
                {typeLabel}
                <select
                  name={`${namePrefix}Type[]`}
                  defaultValue={types[0]}
                  onChange={(event) => setRowOther(row.id, event.target.value === "other")}
                  className={inputClass}
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                  <option value="other">{otherLabel}</option>
                </select>
              </label>
              {row.other && (
                <input
                  name={`${namePrefix}TypeOther[]`}
                  required
                  placeholder={otherPlaceholder}
                  className={`${inputClass} mt-2`}
                />
              )}
            </div>

            <div className="min-w-[200px] flex-1">
              <label className={fieldLabelClass}>
                {valueLabel}
                <input
                  type={valueType}
                  dir={valueType !== "text" ? "ltr" : undefined}
                  name={`${namePrefix}[]`}
                  required={valueRequired}
                  placeholder={valuePlaceholder}
                  className={inputClass}
                />
              </label>
            </div>

            <button
              type="button"
              aria-label={removeLabel}
              disabled={rows.length <= 1}
              onClick={() => removeRow(row.id)}
              className="mt-6 grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-black/10 text-gray-400 transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SmartLeadForm({ dict, locale }: { dict: SmartFormDict; locale: Locale }) {
  const { step0, step1, step2, step3, step4, step5, step6, nav } = dict;
  const industryOptions = step1.industry.options;
  const serviceOptions = step2.options;

  const formRef = useRef<HTMLFormElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const draftRef = useRef<Record<string, string | string[]> | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [step, setStep] = useState(0);
  const [highestReached, setHighestReached] = useState(0);
  const [draftReady, setDraftReady] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const [emailRows, setEmailRows] = useState<DynamicRow[]>([{ id: 0, other: false }]);
  const [phoneRows, setPhoneRows] = useState<DynamicRow[]>([{ id: 0, other: false }]);
  const [addressRows, setAddressRows] = useState<DynamicRow[]>([{ id: 0, other: false }]);

  const [businessTypeOther, setBusinessTypeOther] = useState(false);
  const [industry, setIndustry] = useState("");
  const [industryError, setIndustryError] = useState(false);

  const [services, setServices] = useState<Set<string>>(new Set());
  const [servicesError, setServicesError] = useState(false);

  const [fashionCategories, setFashionCategories] = useState<Set<string>>(new Set());
  const [beautyType, setBeautyType] = useState("");
  const [warehousePurpose, setWarehousePurpose] = useState<Set<string>>(new Set());

  const [files, setFiles] = useState<File[]>([]);
  const [summaryCards, setSummaryCards] = useState<{ title: string; rows: [string, string][] }[]>([]);

  const allServicesChecked = services.size > 0 && services.size === serviceOptions.length;

  function scheduleSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (!formRef.current) return;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formToObject(formRef.current)));
    }, 800);
  }

  function saveDraftNow() {
    if (!formRef.current) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formToObject(formRef.current)));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  function handleFormChange(event: React.SyntheticEvent<HTMLFormElement>) {
    const target = event.target as HTMLElement;
    target.style.removeProperty("border-color");
    scheduleSave();
  }

  // Restoring a saved draft from localStorage can only happen client-side (this page is
  // prerendered without a DOM during the static export build), so it has to run once on
  // mount rather than during render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Record<string, string | string[]>;
      draftRef.current = draft;

      const emailTypes = toArray(draft["emailType[]"]);
      const emailValues = toArray(draft["email[]"]);
      const emailCount = Math.max(emailValues.length, emailTypes.length, 1);
      setEmailRows(
        Array.from({ length: emailCount }, (_, i) => ({ id: i, other: emailTypes[i] === "other" })),
      );

      const phoneTypes = toArray(draft["phoneType[]"]);
      const phoneValues = toArray(draft["phone[]"]);
      const phoneCount = Math.max(phoneValues.length, phoneTypes.length, 1);
      setPhoneRows(
        Array.from({ length: phoneCount }, (_, i) => ({ id: i, other: phoneTypes[i] === "other" })),
      );

      const addressTypes = toArray(draft["addressType[]"]);
      const addressValues = toArray(draft["address[]"]);
      const addressCount = Math.max(addressValues.length, addressTypes.length, 1);
      setAddressRows(
        Array.from({ length: addressCount }, (_, i) => ({ id: i, other: addressTypes[i] === "other" })),
      );

      setBusinessTypeOther(draft.businessType === "other");
      setIndustry((draft.industry as string) ?? "");
      setServices(new Set(toArray(draft.services)));
      setFashionCategories(new Set(toArray(draft.fashionCategory)));
      setBeautyType((draft.beautyType as string) ?? "");
      setWarehousePurpose(new Set(toArray(draft.warehousePurpose)));

      setDraftReady(true);
    } catch {
      // ignore malformed draft
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!draftReady || !draftRef.current || !formRef.current) return;
    const form = formRef.current;
    Object.entries(draftRef.current).forEach(([key, value]) => {
      const elements = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[name="${key}"]`,
      );
      const values = toArray(value);
      elements.forEach((el, i) => {
        if (el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox" || el.type === "file")) {
          return;
        }
        if (values[i] !== undefined) el.value = values[i];
      });
    });
  }, [draftReady]);

  function validateStep(): boolean {
    const section = sectionRefs.current[step];
    if (!section) return true;
    let valid = true;

    section
      .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[required]")
      .forEach((el) => {
        if (el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox")) return;
        if (!el.value.trim()) {
          el.style.borderColor = ERROR_COLOR;
          valid = false;
        } else {
          el.style.removeProperty("border-color");
        }
      });

    if (step === 1 && !industry) {
      setIndustryError(true);
      valid = false;
    } else if (step === 1) {
      setIndustryError(false);
    }

    if (step === 2 && services.size === 0) {
      setServicesError(true);
      valid = false;
    } else if (step === 2) {
      setServicesError(false);
    }

    if (step === 3 && services.has("shipping")) {
      const dest = section.querySelector<HTMLInputElement>('[name="deliveryDestination"]');
      if (dest && !dest.value.trim()) {
        dest.style.borderColor = ERROR_COLOR;
        valid = false;
      }
    }

    if (!valid) {
      section.querySelector<HTMLElement>('[style*="border-color"]')?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    return valid;
  }

  function goNext() {
    if (!validateStep()) return;
    if (step === 5) {
      localStorage.removeItem(DRAFT_KEY);
      setStep(6);
      setHighestReached(6);
    } else {
      const next = step + 1;
      if (next === 5) setSummaryCards(buildSummaryCards());
      setStep(next);
      setHighestReached((prev) => Math.max(prev, next));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToStep(index: number) {
    if (index <= highestReached && index !== step) {
      if (index === 5) setSummaryCards(buildSummaryCards());
      setStep(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function validateAttachments(picked: File[]): string {
    const errors: string[] = [];
    if (picked.length > MAX_FILES) errors.push(step3.attachments.errorTooMany);
    const oversized = picked.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversized.length === 1) errors.push(step3.attachments.errorOversizedOne);
    else if (oversized.length > 1) errors.push(step3.attachments.errorOversizedMany.replace("{count}", String(oversized.length)));
    const total = picked.reduce((sum, file) => sum + file.size, 0);
    if (total > MAX_TOTAL_SIZE) errors.push(step3.attachments.errorTotalTooLarge);
    return errors.join(" ");
  }

  function buildSummaryCards() {
    const form = formRef.current;
    const fd = form ? new FormData(form) : new FormData();
    const empty = step5.empty;
    const get = (name: string) => (fd.get(name) as string)?.trim() || empty;
    const getAll = (name: string) => {
      const vals = fd.getAll(name).map(String).filter(Boolean);
      return vals.length ? vals.join(", ") : empty;
    };

    const industryLabel = (() => {
      if (!industry) return empty;
      const opt = industryOptions.find((o) => o.key === industry);
      if (industry === "other") {
        const other = get("otherIndustry");
        return other === empty ? (opt?.label ?? empty) : `${step5.otherPrefix}${other}`;
      }
      return opt?.label ?? empty;
    })();

    const businessTypeLabel = businessTypeOther ? `${step5.otherPrefix}${get("businessTypeOther")}` : get("businessType");

    const servicesLabel = services.size === 0
      ? empty
      : allServicesChecked
        ? step5.fullService
        : serviceOptions.filter((o) => services.has(o.key)).map((o) => o.label).join(", ") || empty;

    const name = [get("firstName"), get("lastName")].filter((v) => v !== empty).join(" ") || empty;

    return [
      {
        title: step5.cards.contact.title,
        rows: [
          [step5.cards.contact.name, name],
          [step5.cards.contact.company, get("company")],
          [step5.cards.contact.email, getAll("email[]")],
          [step5.cards.contact.phone, getAll("phone[]")],
          [step5.cards.contact.address, getAll("address[]")],
        ],
      },
      {
        title: step5.cards.business.title,
        rows: [
          [step5.cards.business.brand, get("brandName")],
          [step5.cards.business.businessType, businessTypeLabel],
          [step5.cards.business.industry, industryLabel],
          [step5.cards.business.mainMarket, get("mainMarket")],
          [step5.cards.business.website, get("website")],
        ],
      },
      {
        title: step5.cards.need.title,
        rows: [
          [step5.cards.need.services, servicesLabel],
          [step5.cards.need.product, get("sourceProduct")],
          [step5.cards.need.supplier, get("supplierName")],
          [step5.cards.need.destination, get("deliveryDestination")],
          [step5.cards.need.warehouse, warehousePurpose.size ? Array.from(warehousePurpose).join(", ") : empty],
          [step5.cards.need.fashionCategory, fashionCategories.size ? Array.from(fashionCategories).join(", ") : empty],
          [step5.cards.need.files, files.length ? files.map((f) => f.name).join(", ") : empty],
        ],
      },
      {
        title: step5.cards.commercial.title,
        rows: [
          [step5.cards.commercial.orderSize, get("orderSize")],
          [step5.cards.commercial.frequency, get("frequency")],
          [step5.cards.commercial.timeline, get("timeline")],
          [step5.cards.commercial.priority, get("priority")],
          [step5.cards.commercial.notes, get("notes")],
        ],
      },
    ] as { title: string; rows: [string, string][] }[];
  }

  const stepPercent = Math.round((Math.min(step + 1, 6) / 6) * 100);

  return (
    <div>
      {step < 6 && (
        <div className="sticky top-19 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-4xl px-6 py-4">
            <div className="mb-3.5 h-1 overflow-hidden rounded-full bg-gray-150">
              <div className="h-full bg-brand transition-[width]" style={{ width: `${stepPercent}%` }} />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {dict.steps.map((label, i) => {
                const isActive = i === step;
                const isDone = i < highestReached && i !== step;
                return (
                  <button
                    key={label}
                    type="button"
                    disabled={i > highestReached}
                    onClick={() => goToStep(i)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
                      isActive ? "text-ink" : isDone ? "cursor-pointer text-gray-500 hover:text-brand" : "text-gray-300"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full border text-sm font-bold ${
                        isActive
                          ? "border-brand bg-brand text-white"
                          : isDone
                            ? "border-brand/40 bg-brand-soft text-brand"
                            : "border-black/15 bg-white text-gray-400"
                      }`}
                    >
                      {toLocaleDigits(i + 1, locale)}
                    </span>
                    <span className="hidden truncate sm:block">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 pt-8 pb-16">
        {step < 6 && (
          <Link
            href={`/${locale}/contact`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-brand"
          >
            <ArrowForwardIcon className="rotate-180" />
            {dict.back}
          </Link>
        )}

        <form ref={formRef} onChange={handleFormChange} className="grid gap-10">
          {/* Step 0 — General information */}
          <section
            ref={(el) => {
              sectionRefs.current[0] = el;
            }}
            className={step === 0 ? "grid gap-8" : "hidden"}
          >
            <div>
              <p className="text-xs font-bold tracking-widest text-brand uppercase">{step0.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{step0.heading}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{step0.intro}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldLabelClass}>
                {step0.firstName} <span className="text-brand">*</span>
                <input name="firstName" required className={inputClass} />
              </label>
              <label className={fieldLabelClass}>
                {step0.lastName} <span className="text-brand">*</span>
                <input name="lastName" required className={inputClass} />
              </label>
              <label className={fieldLabelClass}>
                {step0.jobTitle}
                <input name="jobTitle" placeholder={step0.jobTitlePlaceholder} className={inputClass} />
              </label>
              <label className={fieldLabelClass}>
                {step0.company}
                <input name="company" placeholder={step0.companyPlaceholder} className={inputClass} />
              </label>
            </div>

            <DynamicListSection
              rows={emailRows}
              setRows={setEmailRows}
              heading={step0.emails.heading}
              description={step0.emails.description}
              addLabel={step0.emails.add}
              typeLabel={dict.typeLabel}
              types={step0.emails.types}
              otherLabel={step0.emails.other}
              otherPlaceholder={step0.emails.otherPlaceholder}
              valueLabel={step0.emails.valueLabel}
              valuePlaceholder={step0.emails.valuePlaceholder}
              valueRequired
              valueType="email"
              namePrefix="email"
              removeLabel={dict.removeLabel}
            />

            <DynamicListSection
              rows={phoneRows}
              setRows={setPhoneRows}
              heading={step0.phones.heading}
              description={step0.phones.description}
              addLabel={step0.phones.add}
              typeLabel={dict.typeLabel}
              types={step0.phones.types}
              otherLabel={step0.phones.other}
              otherPlaceholder={step0.phones.otherPlaceholder}
              valueLabel={step0.phones.valueLabel}
              valuePlaceholder={step0.phones.valuePlaceholder}
              valueRequired={false}
              valueType="tel"
              namePrefix="phone"
              removeLabel={dict.removeLabel}
            />

            <DynamicListSection
              rows={addressRows}
              setRows={setAddressRows}
              heading={step0.addresses.heading}
              description={step0.addresses.description}
              addLabel={step0.addresses.add}
              typeLabel={dict.typeLabel}
              types={step0.addresses.types}
              otherLabel={step0.addresses.other}
              otherPlaceholder={step0.addresses.otherPlaceholder}
              valueLabel={step0.addresses.valueLabel}
              valuePlaceholder={step0.addresses.valuePlaceholder}
              valueRequired={false}
              valueType="text"
              namePrefix="address"
              removeLabel={dict.removeLabel}
            />
          </section>

          {/* Step 1 — Business */}
          <section
            ref={(el) => {
              sectionRefs.current[1] = el;
            }}
            className={step === 1 ? "grid gap-8" : "hidden"}
          >
            <div>
              <p className="text-xs font-bold tracking-widest text-brand uppercase">{step1.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{step1.heading}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{step1.intro}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldLabelClass}>
                {step1.brandName.label}
                <input name="brandName" placeholder={step1.brandName.placeholder} className={inputClass} />
              </label>
              <label className={fieldLabelClass}>
                {step1.website.label}
                <input name="website" type="url" dir="ltr" placeholder={step1.website.placeholder} className={inputClass} />
              </label>
              <label className={fieldLabelClass}>
                {step1.businessType.label} <span className="text-brand">*</span>
                <select
                  name="businessType"
                  required
                  defaultValue=""
                  onChange={(event) => setBusinessTypeOther(event.target.value === "other")}
                  className={inputClass}
                >
                  <option value="" disabled>
                    {step1.businessType.placeholder}
                  </option>
                  {step1.businessType.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="other">{step1.businessType.other}</option>
                </select>
                {businessTypeOther && (
                  <input
                    name="businessTypeOther"
                    required
                    placeholder={step1.businessType.otherPlaceholder}
                    className={`${inputClass} mt-1`}
                  />
                )}
              </label>
              <label className={fieldLabelClass}>
                {step1.mainMarket.label} <span className="text-brand">*</span>
                <select name="mainMarket" required defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    {step1.mainMarket.placeholder}
                  </option>
                  {step1.mainMarket.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <h3 className="text-base font-semibold text-ink">{step1.industry.heading}</h3>
              <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-gray-500">{step1.industry.description}</p>
              <div
                className={`mt-4 grid gap-3 sm:grid-cols-3 ${industryError ? "rounded-2xl outline-2 outline-offset-4 outline-[#d95553]/50" : ""}`}
              >
                {industryOptions.map((option) => (
                  <ChoiceCard
                    key={option.key}
                    type="radio"
                    name="industry"
                    value={option.label}
                    checked={industry === option.key}
                    onChange={() => {
                      setIndustry(option.key);
                      setIndustryError(false);
                    }}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                  />
                ))}
              </div>
              {industry === "other" && (
                <label className={`${fieldLabelClass} mt-4`}>
                  {step1.industry.otherLabel}
                  <input name="otherIndustry" required placeholder={step1.industry.otherPlaceholder} className={inputClass} />
                </label>
              )}
            </div>
          </section>

          {/* Step 2 — Services */}
          <section
            ref={(el) => {
              sectionRefs.current[2] = el;
            }}
            className={step === 2 ? "grid gap-6" : "hidden"}
          >
            <div>
              <p className="text-xs font-bold tracking-widest text-brand uppercase">{step2.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{step2.heading}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{step2.intro}</p>
            </div>

            <div
              className={`grid gap-3 sm:grid-cols-3 ${servicesError ? "rounded-2xl outline-2 outline-offset-4 outline-[#d95553]/50" : ""}`}
            >
              <ChoiceCard
                type="checkbox"
                name="serviceAll"
                value="all"
                checked={allServicesChecked}
                onChange={() => {
                  setServices(allServicesChecked ? new Set() : new Set(serviceOptions.map((o) => o.key)));
                  setServicesError(false);
                }}
                icon={step2.allService.icon}
                label={step2.allService.label}
                description={step2.allService.description}
              />
              {serviceOptions.map((option) => (
                <ChoiceCard
                  key={option.key}
                  type="checkbox"
                  name="services"
                  value={option.label}
                  checked={services.has(option.key)}
                  onChange={() => {
                    setServices((prev) => {
                      const next = new Set(prev);
                      if (next.has(option.key)) next.delete(option.key);
                      else next.add(option.key);
                      return next;
                    });
                    setServicesError(false);
                  }}
                  icon={option.icon}
                  label={option.label}
                  description={option.description}
                />
              ))}
            </div>
            <p className="rounded-xl border-s-[3px] border-brand bg-gray-50 px-4 py-3.5 text-xs leading-relaxed text-gray-600">
              {step2.note}
            </p>
          </section>

          {/* Step 3 — Adaptive questions */}
          <section
            ref={(el) => {
              sectionRefs.current[3] = el;
            }}
            className={step === 3 ? "grid gap-8" : "hidden"}
          >
            <div>
              <p className="text-xs font-bold tracking-widest text-brand uppercase">{step3.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{step3.heading}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{step3.intro}</p>
            </div>

            {industry === "fashion" && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.industryBlocks.fashion.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.industryBlocks.fashion.intro}</p>
                <div className="mt-4 grid gap-2">
                  <span className="text-xs font-semibold text-gray-500">{step3.industryBlocks.fashion.categoriesLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {step3.industryBlocks.fashion.categories.map((category) => (
                      <ChipOption
                        key={category}
                        type="checkbox"
                        name="fashionCategory"
                        value={category}
                        checked={fashionCategories.has(category)}
                        onChange={() =>
                          setFashionCategories((prev) => {
                            const next = new Set(prev);
                            if (next.has(category)) next.delete(category);
                            else next.add(category);
                            return next;
                          })
                        }
                        label={category}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={fieldLabelClass}>
                    {step3.industryBlocks.fashion.segment.label}
                    <select name="fashionSegment" defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {step3.industryBlocks.fashion.segment.placeholder}
                      </option>
                      {step3.industryBlocks.fashion.segment.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.industryBlocks.fashion.status.label}
                    <select name="productStatus" defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {step3.industryBlocks.fashion.status.placeholder}
                      </option>
                      {step3.industryBlocks.fashion.status.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {industry === "electronics" && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.industryBlocks.electronics.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.industryBlocks.electronics.intro}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={fieldLabelClass}>
                    {step3.industryBlocks.electronics.type.label}
                    <input name="electronicsType" placeholder={step3.industryBlocks.electronics.type.placeholder} className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.industryBlocks.electronics.certification.label}
                    <input
                      name="certification"
                      placeholder={step3.industryBlocks.electronics.certification.placeholder}
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            )}

            {industry === "home" && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.industryBlocks.home.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.industryBlocks.home.intro}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={fieldLabelClass}>
                    {step3.industryBlocks.home.type.label}
                    <input name="homeType" placeholder={step3.industryBlocks.home.type.placeholder} className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.industryBlocks.home.dimensions.label}
                    <input name="dimensions" placeholder={step3.industryBlocks.home.dimensions.placeholder} className={inputClass} />
                  </label>
                </div>
              </div>
            )}

            {industry === "beauty" && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.industryBlocks.beauty.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.industryBlocks.beauty.intro}</p>
                <div className="mt-4 grid gap-2">
                  <span className="text-xs font-semibold text-gray-500">{step3.industryBlocks.beauty.typeLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {step3.industryBlocks.beauty.types.map((type) => (
                      <ChipOption
                        key={type}
                        type="radio"
                        name="beautyType"
                        value={type}
                        checked={beautyType === type}
                        onChange={() => setBeautyType(type)}
                        label={type}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {industry === "machinery" && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.industryBlocks.machinery.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.industryBlocks.machinery.intro}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={fieldLabelClass}>
                    {step3.industryBlocks.machinery.type.label}
                    <input name="industrialType" placeholder={step3.industryBlocks.machinery.type.placeholder} className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.industryBlocks.machinery.spec.label}
                    <select name="specAvailable" defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {step3.industryBlocks.machinery.spec.placeholder}
                      </option>
                      {step3.industryBlocks.machinery.spec.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {services.has("sourcing") && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.serviceBlocks.sourcing.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.serviceBlocks.sourcing.intro}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.sourcing.product.label}
                    <input name="sourceProduct" placeholder={step3.serviceBlocks.sourcing.product.placeholder} className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.sourcing.qty.label}
                    <input name="sourceQty" placeholder={step3.serviceBlocks.sourcing.qty.placeholder} className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.sourcing.targetPrice.label}
                    <input name="targetPrice" placeholder={step3.serviceBlocks.sourcing.targetPrice.placeholder} className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.sourcing.reference.label}
                    <input name="reference" placeholder={step3.serviceBlocks.sourcing.reference.placeholder} className={inputClass} />
                  </label>
                </div>
              </div>
            )}

            {services.has("verification") && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.serviceBlocks.verification.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.serviceBlocks.verification.intro}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.verification.name.label}
                    <input name="supplierName" placeholder={step3.serviceBlocks.verification.name.placeholder} className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.verification.link.label}
                    <input name="supplierLink" placeholder={step3.serviceBlocks.verification.link.placeholder} className={inputClass} />
                  </label>
                </div>
              </div>
            )}

            {services.has("purchasing") && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.serviceBlocks.purchasing.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.serviceBlocks.purchasing.intro}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.purchasing.orderValue.label}
                    <input name="orderValue" placeholder={step3.serviceBlocks.purchasing.orderValue.placeholder} className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.purchasing.termsAgreed.label}
                    <select name="termsAgreed" defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {step3.serviceBlocks.purchasing.termsAgreed.placeholder}
                      </option>
                      {step3.serviceBlocks.purchasing.termsAgreed.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {services.has("qc") && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.serviceBlocks.qc.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.serviceBlocks.qc.intro}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.qc.goodsReady.label}
                    <input type="date" name="goodsReady" className={inputClass} />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.qc.priority.label}
                    <select name="qcPriority" defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        {step3.serviceBlocks.qc.priority.placeholder}
                      </option>
                      {step3.serviceBlocks.qc.priority.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {services.has("warehousing") && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.serviceBlocks.warehousing.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.serviceBlocks.warehousing.intro}</p>
                <div className="mt-4 grid gap-2">
                  <span className="text-xs font-semibold text-gray-500">{step3.serviceBlocks.warehousing.purposeLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {step3.serviceBlocks.warehousing.purposes.map((purpose) => (
                      <ChipOption
                        key={purpose}
                        type="checkbox"
                        name="warehousePurpose"
                        value={purpose}
                        checked={warehousePurpose.has(purpose)}
                        onChange={() =>
                          setWarehousePurpose((prev) => {
                            const next = new Set(prev);
                            if (next.has(purpose)) next.delete(purpose);
                            else next.add(purpose);
                            return next;
                          })
                        }
                        label={purpose}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {services.has("shipping") && (
              <div className="rounded-2xl border border-black/10 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-ink">{step3.serviceBlocks.shipping.heading}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{step3.serviceBlocks.shipping.intro}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className={`${fieldLabelClass} sm:col-span-2`}>
                    {step3.serviceBlocks.shipping.destination.label} <span className="text-brand">*</span>
                    <input
                      name="deliveryDestination"
                      placeholder={step3.serviceBlocks.shipping.destination.placeholder}
                      className={inputClass}
                    />
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.shipping.transport.label}
                    <select name="transport" defaultValue="" className={inputClass}>
                      <option value="">{step3.serviceBlocks.shipping.transport.placeholder}</option>
                      {step3.serviceBlocks.shipping.transport.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={fieldLabelClass}>
                    {step3.serviceBlocks.shipping.cargoSize.label}
                    <input name="cargoSize" placeholder={step3.serviceBlocks.shipping.cargoSize.placeholder} className={inputClass} />
                  </label>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-semibold text-ink">{step3.attachments.heading}</h3>
              <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-gray-500">{step3.attachments.description}</p>
              <div className="mt-4">
                <FileUpload
                  files={files}
                  onChange={setFiles}
                  validate={validateAttachments}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  title={step3.attachments.title}
                  copy={step3.attachments.copy}
                  actionLabel={step3.attachments.action}
                />
              </div>
            </div>
          </section>

          {/* Step 4 — Commercial fit */}
          <section
            ref={(el) => {
              sectionRefs.current[4] = el;
            }}
            className={step === 4 ? "grid gap-8" : "hidden"}
          >
            <div>
              <p className="text-xs font-bold tracking-widest text-brand uppercase">{step4.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{step4.heading}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{step4.intro}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={fieldLabelClass}>
                {step4.orderSize.label} <span className="text-brand">*</span>
                <select name="orderSize" required defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    {step4.orderSize.placeholder}
                  </option>
                  {step4.orderSize.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className={fieldLabelClass}>
                {step4.frequency.label} <span className="text-brand">*</span>
                <select name="frequency" required defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    {step4.frequency.placeholder}
                  </option>
                  {step4.frequency.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className={fieldLabelClass}>
                {step4.timeline.label}
                <select name="timeline" defaultValue="" className={inputClass}>
                  <option value="">{step4.timeline.placeholder}</option>
                  {step4.timeline.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className={fieldLabelClass}>
                {step4.priority.label}
                <select name="priority" defaultValue="" className={inputClass}>
                  <option value="">{step4.priority.placeholder}</option>
                  {step4.priority.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className={fieldLabelClass}>
              {step4.notes.label}
              <textarea name="notes" placeholder={step4.notes.placeholder} className={`${inputClass} min-h-32 resize-y py-3`} />
            </label>
          </section>

          {/* Step 5 — Review */}
          <section
            ref={(el) => {
              sectionRefs.current[5] = el;
            }}
            className={step === 5 ? "grid gap-6" : "hidden"}
          >
            <div>
              <p className="text-xs font-bold tracking-widest text-brand uppercase">{step5.eyebrow}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{step5.heading}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{step5.intro}</p>
            </div>
            {step === 5 && (
              <div className="grid gap-4">
                {summaryCards.map((card) => (
                  <div key={card.title} className="rounded-2xl border border-black/10 p-5">
                    <h4 className="text-xs font-bold tracking-widest text-brand uppercase">{card.title}</h4>
                    <dl className="mt-3 grid gap-2.5 text-sm">
                      {card.rows.map(([label, value]) => (
                        <div key={label} className="grid grid-cols-[160px_1fr] gap-4">
                          <dt className="text-gray-400">{label}</dt>
                          <dd className="font-medium wrap-break-word text-ink">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            )}
            <p className="rounded-xl border-s-[3px] border-brand bg-gray-50 px-4 py-3.5 text-xs leading-relaxed text-gray-600">
              {step5.note}
            </p>
          </section>

          {/* Step 6 — Success */}
          <section
            ref={(el) => {
              sectionRefs.current[6] = el;
            }}
            className={step === 6 ? "grid justify-items-center gap-5 py-16 text-center" : "hidden"}
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white">
              <CheckCircleIcon className="h-7 w-7" />
            </div>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">{step6.heading}</h2>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">{step6.body}</p>
            <Link
              href={`/${locale}/contact`}
              className="mt-3 inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              {dict.back}
            </Link>
          </section>

          {step < 6 && (
            <div className="flex items-center justify-between gap-4 border-t border-black/5 pt-6">
              <button
                type="button"
                onClick={goBack}
                style={{ visibility: step === 0 ? "hidden" : "visible" }}
                className="min-h-11 text-sm font-semibold text-gray-500 transition-colors rounded-xl border border-black/10 px-4 hover:text-brand cursor-pointer hover:border-black"
              >
                {nav.back}
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveDraftNow}
                  className="hidden min-h-11 items-center rounded-xl border border-black/10 px-4 text-sm font-semibold text-ink sm:inline-flex cursor-pointer hover:border-black hover:text-brand"
                >
                  {savedFlash ? nav.saved : nav.saveDraft}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover cursor-pointer"
                >
                  {step === 5 ? nav.submit : nav.continue}
                  <ArrowForwardIcon />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

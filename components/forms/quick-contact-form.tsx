"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { ArrowForwardIcon, CheckCircleIcon } from "@/components/icons";
import { FileUpload } from "@/components/forms/file-upload";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-[15px] text-ink outline-none transition-colors placeholder:text-gray-400 focus:border-brand focus:ring-4 focus:ring-brand/10";
const labelClass = "text-sm font-semibold text-ink";

export function QuickContactForm({ dict, locale }: { dict: Dictionary["quickForm"]; locale: Locale }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [regarding, setRegarding] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const isOther = regarding === "other";

  function validateFiles(picked: File[]): string {
    if (picked.length > MAX_FILES) return dict.attachments.errorTooMany;
    const tooLarge = picked.find((file) => file.size > MAX_FILE_SIZE);
    if (tooLarge) return dict.attachments.errorTooLarge.replace("{name}", tooLarge.name);
    return "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-brand text-white">
          <CheckCircleIcon className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{dict.success.heading}</h1>
        <p className="mx-auto mt-3 max-w-[48ch] text-base leading-relaxed text-gray-600">
          {dict.success.body}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          {dict.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
      <Link
        href={`/${locale}/contact`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-brand"
      >
        <ArrowForwardIcon className="rotate-180" />
        {dict.back}
      </Link>

      <p className="mt-6 text-xs font-bold tracking-widest text-brand uppercase">{dict.eyebrow}</p>
      <h1 className="mt-2 text-4xl leading-[0.98] font-extrabold tracking-tight text-balance md:text-6xl">
        {dict.headingPrefix} <span className="text-brand">{dict.headingAccent}</span>
      </h1>
      <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-gray-600 text-pretty">{dict.intro}</p>

      <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="name">
            {dict.name.label} <span className="text-brand">*</span>
          </label>
          <input id="name" name="name" type="text" autoComplete="name" required className={inputClass} />
        </div>

        <div className="grid gap-2">
          <label className={labelClass} htmlFor="company">
            {dict.company.label}
          </label>
          <input id="company" name="company" type="text" autoComplete="organization" className={inputClass} />
        </div>

        <div className="grid gap-2">
          <label className={labelClass} htmlFor="email">
            {dict.email.label} <span className="text-brand">*</span>
          </label>
          <input id="email" name="email" type="email" dir="ltr" autoComplete="email" required className={inputClass} />
        </div>

        <div className="grid gap-2">
          <label className={labelClass} htmlFor="phone">
            {dict.phone.label}
          </label>
          <input id="phone" name="phone" type="tel" dir="ltr" autoComplete="tel" className={inputClass} />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <label className={labelClass} htmlFor="regard">
            {dict.regarding.label} <span className="text-brand">*</span>
          </label>
          <select
            id="regard"
            name="regard"
            required
            value={regarding}
            onChange={(event) => setRegarding(event.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              {dict.regarding.placeholder}
            </option>
            {dict.regarding.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="other">{dict.regarding.other}</option>
          </select>
        </div>

        {isOther && (
          <div className="grid gap-2 sm:col-span-2">
            <label className={labelClass} htmlFor="otherRegarding">
              {dict.otherRegarding.label}
            </label>
            <input
              id="otherRegarding"
              name="otherRegarding"
              type="text"
              required
              placeholder={dict.otherRegarding.placeholder}
              className={inputClass}
            />
          </div>
        )}

        <div className="grid gap-2 sm:col-span-2">
          <label className={labelClass} htmlFor="message">
            {dict.message.label} <span className="text-brand">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            placeholder={dict.message.placeholder}
            className={`${inputClass} min-h-44 resize-y py-3.5 leading-relaxed`}
          />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <span className={labelClass}>{dict.attachments.label}</span>
          <FileUpload
            files={files}
            onChange={setFiles}
            validate={validateFiles}
            accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.csv"
            title={dict.attachments.title}
            copy={dict.attachments.copy}
            actionLabel={dict.attachments.action}
          />
        </div>

        <div className="flex justify-end sm:col-span-2">
          <button
            type="submit"
            className="inline-flex min-h-13 items-center gap-2.5 rounded-xl bg-brand px-7 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20"
          >
            {dict.submit}
            <ArrowForwardIcon />
          </button>
        </div>
      </form>
    </div>
  );
}

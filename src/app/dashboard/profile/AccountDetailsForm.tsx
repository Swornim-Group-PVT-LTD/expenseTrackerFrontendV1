"use client";

import { isAxiosError } from "axios";
import { type FormEvent, useEffect, useState } from "react";
import protectedApi from "@/app/services/protectedApi";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { type User, useAuth } from "@/context/AuthContext";

const profileUrl = `${BASE_URL}/api/profile`;

const fields = [
  { name: "first_name", label: "First name", required: true },
  { name: "middle_name", label: "Middle name" },
  { name: "last_name", label: "Last name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phonenumber", label: "Phone number", type: "tel", maxLength: 20, required: true },
  { name: "country", label: "Country", required: true },
  { name: "address", label: "Address", required: true },
  { name: "user_type", label: "Account type" },
  { name: "representative_full_name", label: "Representative full name" },
] as const;

const inputClass = "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2";

function profileHeaders() {
  const token = document.cookie.match(/(?:^|;\s*)access_token="?([^";]+)"?/)?.[1];
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token ?? ""}`,
  };
}

function errorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    return fallback;
  }
  const data = error.response?.data;
  return Object.values(data?.errors ?? {}).flat().join(" ") || data?.message || fallback;
}

export default function AccountDetailsForm() {
  const { login } = useAuth();
  const [profile, setProfile] = useState<User>();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    protectedApi.get<{ user: User }>(profileUrl, {
      headers: profileHeaders(),
      signal: controller.signal,
    }).then(({ data }) => setProfile(data.user)).catch((requestError) => {
      if (!controller.signal.aborted) {
        setError(errorMessage(requestError, "Could not load account details."));
      }
    });
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !profile) return;

    const form = event.currentTarget;
    const payload = new FormData(form);
    for (const { name } of fields) {
      if (payload.get(name) === (profile[name] ?? "")) payload.delete(name);
    }
    const logo = payload.get("logo_uploads");
    if (!(logo instanceof File) || !logo.name) payload.delete("logo_uploads");
    if (!payload.get("current_password")) payload.delete("current_password");
    if (!payload.get("password") && !payload.get("password_confirmation")) {
      payload.delete("password");
      payload.delete("password_confirmation");
    }
    // PHP reads multipart uploads from POST requests.
    payload.set("_method", "PATCH");

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const { data } = await protectedApi.post<{ user: User; message: string }>(
        profileUrl,
        payload,
        { headers: profileHeaders() },
      );
      setProfile(data.user);
      login(data.user);
      form.reset();
      setMessage(data.message);
    } catch (requestError) {
      setError(errorMessage(requestError, "Could not save account details."));
    } finally {
      setSaving(false);
    }
  }

  const logoPath = profile?.logo_uploads;
  const logoUrl = logoPath && /^logo_uploads\/[\w.-]+$/.test(logoPath)
    ? new URL(logoPath, BASE_URL + "/").href
    : null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Account details</h2>
      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-4 text-sm text-green-700">{message}</p>}
      {!profile && !error && <p role="status">Loading account details…</p>}
      {profile && (
        <form onSubmit={handleSubmit}>
          <fieldset disabled={saving} className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className="text-sm font-medium">
                {field.label}
                <input
                  name={field.name}
                  defaultValue={profile[field.name] ?? ""}
                  type={"type" in field ? field.type : "text"}
                  maxLength={"maxLength" in field ? field.maxLength : 255}
                  required={"required" in field && field.required}
                  className={inputClass}
                />
              </label>
            ))}
            <div className="sm:col-span-2">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Current account logo"
                  className="mb-3 h-24 w-24 rounded-lg border border-gray-200 object-contain"
                />
              )}
              <label className="block text-sm font-medium">
                {logoUrl ? "Replace logo" : "Upload logo"}
                <input
                  name="logo_uploads"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  aria-describedby="logo-help"
                  className={inputClass}
                />
              </label>
              <p id="logo-help" className="mt-1 text-sm text-gray-600">
                JPEG, PNG, GIF, or WebP, up to 2 MB.
              </p>
            </div>
            <p className="text-sm text-gray-600 sm:col-span-2">
              Enter your current password to change your email or password.
            </p>
            <label className="text-sm font-medium">
              Current password
              <input name="current_password" type="password" autoComplete="current-password" className={inputClass} />
            </label>
            <label className="text-sm font-medium">
              New password
              <input name="password" type="password" autoComplete="new-password" minLength={6} maxLength={72} className={inputClass} />
            </label>
            <label className="text-sm font-medium">
              Confirm new password
              <input name="password_confirmation" type="password" autoComplete="new-password" className={inputClass} />
            </label>
            <div className="sm:col-span-2">
              <button className="rounded-lg bg-[#082c28] px-4 py-2 font-medium text-white disabled:opacity-60">
                {saving ? "Saving…" : "Save account details"}
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </section>
  );
}

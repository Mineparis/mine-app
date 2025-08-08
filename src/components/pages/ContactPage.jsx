import React, { useState } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { toast } from "react-hot-toast";
import * as Sentry from "@sentry/nextjs";
import { fetchAPI } from "@lib/api";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ContactPage = ({ lang }) => {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);
  const SUBMIT_COOLDOWN = 5 * 60 * 1000; // 5 min

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error(t("all_fields_required"));
      return false;
    }
    if (!validateEmail(formData.email)) {
      toast.error(t("invalid_email"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const now = Date.now();
    if (now - lastSubmit < SUBMIT_COOLDOWN) {
      toast.error(t("wait_before_resend"));
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      await fetchAPI("/contact", "POST", { ...formData, lang });
      toast.success(t("email_sent_successfully"));
      setFormData(initialFormData);
      setLastSubmit(now);
    } catch (err) {
      Sentry.captureException(err);
      toast.error(t("error_default_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("contact_title")}</title>
        <meta name="description" content={t("contact_meta_description")}/>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://mineparis.com/contact" />
      </Head>

      <div className="bg-white min-h-screen p-4 flex flex-col items-center">
        <header className="mb-8 w-full max-w-xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("contact", "Contact")}
          </h1>
          <p className="text-gray-600">
            {t("contact_intro")}
          </p>
        </header>

        <form
          className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4"
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-label={t("contact_form", "Formulaire de contact")}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                {t("firstName", "Prénom")}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.firstName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                {t("lastName", "Nom")}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.lastName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={50}
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t("email", "Email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={100}
              disabled={loading}
              inputMode="email"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              {t("message", "Message")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={1000}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-lg bg-primary text-white font-semibold text-lg transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? t("sending", "Envoi...") : t("send", "Envoyer")}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactPage;
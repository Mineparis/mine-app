import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

import { fetchAPI } from "../lib/api";

const Footer = () => {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChangeEmail = (event) => setEmail(event.target.value);

  const handleSubmitNewsletterEmail = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.error(t("email_required"));
      return;
    }
    setIsLoading(true);
    try {
      await fetchAPI("/mailings", "POST", { email });
      toast.success(t("email_sent_successfully"));
      setEmail("");
    } catch (err) {
      const errMsg = err.statusCode === 409 ? t(err.message) : t("error_sending_email");
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = useMemo(
    () => [
      {
        sectionName: t("informations", "Informations"),
        links: [
          { href: "/about-us", label: t("about_us") },
          { href: "/contact", label: t("contact_us") },
          { href: "/faq", label: "FAQ" },
          { href: "/delivery-policy", label: t("delivery_policy") },
          { href: "/terms-of-use", label: t("terms_of_use") },
          { href: "/legal-notice", label: t("legal_notice") },
        ],
      },
    ],
    [t]
  );

  const socialLinks = [
    {
      href: "https://www.instagram.com/_mineparis",
      label: "Instagram",
      title: "Instagram",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="17" cy="7" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      href: "https://www.tiktok.com/@mineparis_",
      label: "Tiktok",
      title: "Tiktok",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16.5 3v10.25a3.25 3.25 0 11-2-3V6.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      href: "https://www.pinterest.fr/mine_paris",
      label: "Pinterest",
      title: "Pinterest",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2.5 12h19M12 2.5v19M7 12c0 2.5 2 4.5 5 4.5s5-2 5-4.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
  ];

  if (!isMounted) return null;

  return (
    <footer className="bg-primary text-gray-200 pt-10 pb-4" aria-label={t("footer", "Footer")}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row w-full gap-8">
          {/* Newsletter */}
          <section className="flex-1 min-w-[220px] md:max-w-xs md:mr-8" aria-labelledby="newsletter-heading">
            <h2 id="newsletter-heading" className="uppercase tracking-widest font-semibold mb-3 text-lg">
              {t("newsletter_label")}
            </h2>
            <p className="mb-4 text-gray-300">{t("newsletter_description")}</p>
            <form
              onSubmit={handleSubmitNewsletterEmail}
              className="flex flex-col sm:flex-row gap-2"
              aria-label={t("newsletter_form", "Newsletter signup form")}
              autoComplete="off"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {t("newsletter_placeholder")}
              </label>
              <input
                id="newsletter-email"
                className="flex-1 rounded-lg border border-gray-400 bg-white/10 px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200 transition"
                type="email"
                placeholder={t("newsletter_placeholder")}
                aria-label={t("newsletter_placeholder")}
                value={email}
                onChange={handleChangeEmail}
                required
                disabled={isLoading}
                autoCapitalize="off"
                autoCorrect="off"
                inputMode="email"
              />
              <button
                type="submit"
                aria-label={t("submit_newsletter")}
                disabled={isLoading}
                className="rounded-lg bg-white text-black font-semibold px-4 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <span className="sr-only">{t("submit_newsletter")}</span>
                <EnvelopeIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>
          </section>

          <div className="flex flex-1 flex-col md:flex-row gap-8">
            {/* Informations */}
            {categories.map(({ sectionName, links }) => (
              <nav
                key={sectionName}
                aria-label={t("footer_navigation")}
                className="flex-1 min-w-[140px]"
              >
                <h2 className="uppercase tracking-widest font-semibold mb-3 text-lg">{sectionName}</h2>
                <ul className="space-y-2">
                  {links.map(({ href, label, icon: Icon }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="flex items-center gap-2 hover:text-white text-gray-100 no-underline"
                      >
                        {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Social */}
            <nav
              aria-label={t("footer_social")}
              className="flex-1 min-w-[140px]"
            >
              <h2 className="uppercase tracking-widest font-semibold mb-3 text-lg">Social</h2>
              <ul className="space-y-2">
                {socialLinks.map(({ href, label, title, icon }) => (
                  <li key={label}>
                    <a
                      className="flex items-center gap-2 hover:text-white text-gray-100"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={title}
                    >
                      {icon}
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} Mine. {t("all_rights_reserved")}.
          </p>
          <ul className="flex gap-4 items-center" aria-label={t("payment_methods", "Payment methods")}>
            {["visa", "mastercard", "paypal"].map((payment) => (
              <li key={payment}>
                <Image
                  width={35}
                  height={35}
                  src={`/svg/${payment}.svg`}
                  alt={payment}
                  className="w-9 h-9 object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

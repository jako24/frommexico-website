"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import Section from "@/components/Section";
import copy from "@/lib/copy";
import { products } from "@/lib/data";
import { sendContactEmail } from "@/app/actions/contact";

interface FormData {
  name: string;
  company: string;
  email: string;
  country: string;
  product: string;
  volume: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  company: "",
  email: "",
  country: "",
  product: "",
  volume: "",
  message: "",
};

const requiredFields: (keyof FormData)[] = [
  "name",
  "company",
  "email",
  "country",
  "product",
  "volume",
  "message",
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof FormData]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormData];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = copy.contact.form.required;
      }
    });
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendContactEmail(formData);
      
      if (response.success) {
        setSubmitSuccess(true);
        setFormData(initialFormData);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        console.error("Submission error:", response.error);
        alert(response.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg border ${
      hasError ? "border-red-500" : "border-muted/30"
    } bg-surface text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface transition-colors`;

  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <div className="max-w-4xl mx-auto">
        <h2
          id="contact-heading"
          className="text-3xl font-semibold text-center mb-6 text-foreground"
        >
          {copy.contact.title}
        </h2>
        <p className="text-center text-muted mb-12 max-w-2xl mx-auto">
          {copy.contact.subtitle}
        </p>

        <div className="bg-surface rounded-2xl shadow-sm border border-muted/10 p-8 md:p-12">
          <AnimatePresence>
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                  <svg
                    className="size-8 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Message Sent
                </h3>
                <p className="text-muted">{copy.contact.form.success}</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {copy.contact.form.nameLabel}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClasses(!!errors.name)}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className={inputClasses(!!errors.company)}
                      placeholder="Company name"
                    />
                    {errors.company && (
                      <p className="mt-2 text-sm text-red-500">{errors.company}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {copy.contact.form.emailLabel}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses(!!errors.email)}
                      placeholder="your.email@company.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      className={inputClasses(!!errors.country)}
                      placeholder="Netherlands"
                    />
                    {errors.country && (
                      <p className="mt-2 text-sm text-red-500">{errors.country}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="product"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Product interest
                    </label>
                    <select
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className={inputClasses(!!errors.product)}
                    >
                      <option value="" disabled>
                        Select a product
                      </option>
                      {products.map((product) => (
                        <option key={product.id} value={product.name}>
                          {product.name}
                        </option>
                      ))}
                      <option value="Mixed produce">Mixed produce</option>
                    </select>
                    {errors.product && (
                      <p className="mt-2 text-sm text-red-500">{errors.product}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="volume"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Estimated monthly volume
                    </label>
                    <input
                      id="volume"
                      name="volume"
                      type="text"
                      value={formData.volume}
                      onChange={handleChange}
                      className={inputClasses(!!errors.volume)}
                      placeholder="e.g., 10 tonnes / 2 pallets"
                    />
                    {errors.volume && (
                      <p className="mt-2 text-sm text-red-500">{errors.volume}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {copy.contact.form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={inputClasses(!!errors.message)}
                    placeholder="Preferred delivery window, pack sizes, destination port..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? "Sending..." : copy.contact.form.submit}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

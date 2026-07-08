import { footerLinks } from "@/lib/data";
import { Mail, Phone, MapPin } from "lucide-react";
import { copy } from "@/lib/copy";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-dark-surface text-stone-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo variant="light" size={36} />
              <span className="ml-3 text-xl font-semibold text-white">{copy.footer.columns.brand}</span>
            </div>
            <p className="text-stone-400 max-w-xs">
              {copy.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{copy.footer.columns.explore}</h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-stone-400 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="size-5 text-accent mr-3 mt-0.5" />
                <span className="text-stone-400">
                  {copy.contact.details.address}
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="size-5 text-accent mr-3 mt-0.5" />
                <div className="text-stone-400">
                  <div>{copy.contact.details.phone}</div>
                  <div>{copy.contact.details.phone2}</div>
                </div>
              </li>
              <li className="flex items-center">
                <Mail className="size-5 text-accent mr-3" />
                <span className="text-stone-400">{copy.contact.details.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{copy.footer.socialLabel}</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-foreground/10 hover:bg-accent hover:text-white p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="bg-foreground/10 hover:bg-accent hover:text-white p-2 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="bg-foreground/10 hover:bg-accent hover:text-white p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="bg-foreground/10 hover:bg-accent hover:text-white p-2 rounded-full transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/10 mt-16 pt-8 text-center text-sm text-stone-400">
          <p>{copy.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

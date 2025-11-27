import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  const socialLinks = {
    instagram: "#",
    facebook: "#",
    twitter: "#",
    youtube: "#",
  };

  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10 md:flex md:gap-16">
        <div className="md:w-2/5 space-y-4">
          <div className="flex items-center gap-2 h-10 w-10">
            <img
              src="/logo.png"
              alt="Foody logo"
              className="h-full w-full object-cover"
            />
            <span className="text-lg font-semibold">Foody</span>
          </div>
          <p className="text-sm text-slate-400">
            Enjoy immersive flavors & city signature dishes. Browse, discover,
            and order your favorite meals easily.
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-slate-200">
              Follow us on Social Media
            </p>
            <div className="flex items-center gap-3">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid flex-1 gap-8 text-sm md:mt-0 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mb-3 font-semibold text-slate-100">Explore</p>
            <ul className="space-y-2 text-slate-400">
              <li>All Restaurant</li>
              <li>Nearby</li>
              <li>Discount</li>
              <li>Best Seller</li>
              <li>Delivery</li>
              <li>Lunch</li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-semibold text-slate-100">Help</p>
            <ul className="space-y-2 text-slate-400">
              <li>How to Order</li>
              <li>Payment Methods</li>
              <li>Track My Order</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div className="hidden lg:block">
            <p className="mb-3 font-semibold text-slate-100">More</p>
            <ul className="space-y-2 text-slate-400">
              <li>About Us</li>
              <li>Careers</li>
              <li>Terms &amp; Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Foody. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

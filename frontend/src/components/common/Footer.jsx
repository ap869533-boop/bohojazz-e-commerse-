import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-boho-dark text-gray-300">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="font-display text-2xl font-bold text-boho-cream mb-1">
            Boho<span className="text-boho-gold">Jazz</span>
          </div>
          <p className="text-xs tracking-[0.2em] text-gray-500 uppercase mb-4">Classic · Contemporary · Fusion</p>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            We believe true style is an investment, not an impulse. Curated fashion for the free-spirited soul.
          </p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-boho-terra transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-boho-cream text-lg mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'New Arrivals', path: '/shop?sort=newest' },
              { label: 'Kurtas & Suits', path: '/shop/kurtas-suits' },
              { label: 'Dresses', path: '/shop/dresses' },
              { label: 'Co-ords & Sets', path: '/shop/co-ords-sets' },
              { label: 'Sale', path: '/shop/sale' },
            ].map(link => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-boho-gold transition-colors">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-display text-boho-cream text-lg mb-4">Help & Info</h4>
          <ul className="space-y-2 text-sm">
            {['About Us', 'Contact Us', 'FAQ', 'Shipping Policy', 'Return Policy', 'Privacy Policy', 'Terms of Service'].map(item => (
              <li key={item}><a href="#" className="hover:text-boho-gold transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          <h4 className="font-display text-boho-cream text-lg mb-4">Get In Touch</h4>
          <div className="space-y-3 text-sm mb-5">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-boho-gold mt-0.5 flex-shrink-0" />
              <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-boho-gold flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-boho-gold flex-shrink-0" />
              <span>hello@bohojazz.com</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-boho-cream mb-2">Subscribe to Newsletter</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-boho-gold" />
              <button className="px-3 py-2 bg-boho-gold rounded-lg text-white text-sm font-medium hover:brightness-90 transition-all">Go</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} BohoJazz. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Sell on BohoJazz</span>
          <Link to="/register?role=vendor" className="hover:text-boho-gold transition-colors">Become a Vendor</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

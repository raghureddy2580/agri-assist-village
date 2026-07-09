import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Sprout,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Labor Hiring", href: "#labor" },
    { name: "Crop Management", href: "#crops" },
    { name: "Weather Forecast", href: "#weather" },
    { name: "Marketplace", href: "#marketplace" },
    { name: "Knowledge Hub", href: "/knowledge-hub" }
  ];

  const supportLinks = [
    { name: "Help Center", href: "#help" },
    { name: "Contact Us", href: "#contact" },
    { name: "Community Forum", href: "#forum" },
    { name: "Video Tutorials", href: "#tutorials" },
    { name: "FAQ", href: "#faq" },
    { name: "Technical Support", href: "#support" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Data Security", href: "#security" },
    { name: "Cookie Policy", href: "#cookies" }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Agri-Rover</h3>
                <p className="text-sm text-muted-foreground">Agri-Rover Platform</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Empowering farmers with modern technology for better productivity,
              direct market access, and sustainable farming practices.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">support@agrirover99.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">+91 8073859162</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Bangalore, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Platform</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.name === "Knowledge Hub" ? (
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-6">Stay Updated</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Get the latest farming tips, weather alerts, and market updates directly in your inbox.
            </p>

            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="flex-1"
                />
                <Button size="sm" className="px-3">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            <div className="mt-6">
              <h5 className="font-medium text-foreground mb-3 text-sm">Legal</h5>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2024 Agri-Rover. All rights reserved. Empowering farmers with technology.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-xs text-muted-foreground">Available in:</span>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                  English
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                  हिंदी
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                  ਪੰਜਾਬੀ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
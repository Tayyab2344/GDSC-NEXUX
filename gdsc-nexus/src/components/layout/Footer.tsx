import { Link } from "react-router-dom";
import { Code2, Github, Twitter, Linkedin, Youtube, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    platform: [
      { name: "Teams", href: "/teams" },
      { name: "Events", href: "/events" },
      { name: "Gallery", href: "/gallery" },
      { name: "Announcements", href: "/announcements" },
    ],
    resources: [
      { name: "Developer Tracks", href: "/tracks" },
      { name: "Workshops", href: "/workshops" },
      { name: "Documentation", href: "/docs" },
      { name: "FAQs", href: "/faqs" },
    ],
    community: [
      { name: "Join Discord", href: "#" },
      { name: "Contribute", href: "#" },
      { name: "Code of Conduct", href: "#" },
      { name: "Become a Lead", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-google-blue flex items-center justify-center shadow-md">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground">GDSC</span>
                <span className="font-bold text-lg text-google-blue ml-1">Nexus</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Empowering students to learn, build, and grow together. Join our community of passionate developers and innovators.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 GDSC Nexus. Built with passion by students.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

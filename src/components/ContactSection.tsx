import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Phone as PhoneIcon, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Channel = "whatsapp" | "viber" | "email" | "phone" | "messenger";

const ContactSection = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("whatsapp");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const channels = [
    { id: "whatsapp" as Channel, label: "WhatsApp", icon: MessageCircle },
    { id: "viber" as Channel, label: "Viber", icon: MessageCircle },
    { id: "email" as Channel, label: "Email", icon: Mail },
    { id: "phone" as Channel, label: "Phone Call", icon: PhoneIcon },
    { id: "messenger" as Channel, label: "Messenger", icon: Send },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Phone number copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || (selectedChannel === "email" && !email) || (selectedChannel === "phone" && !phone)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (selectedChannel !== "phone" && !message) {
      toast({
        title: "Missing message",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    const encodedMessage = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}\n\nFound us via: ${source}`
    );

    let url = "";
    switch (selectedChannel) {
      case "whatsapp":
        url = `https://api.whatsapp.com/send?phone=+639458751971&text=${encodedMessage}`;
        break;
      case "viber":
        url = `viber://chat?number=%2B639458751971`;
        break;
      case "email":
        url = `mailto:hello@technofy.com?subject=Inquiry&body=${encodedMessage}`;
        break;
      case "messenger":
        url = `https://m.me/yourpageusername`;
        break;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <section id="contact" className="py-8 sm:py-12 md:py-20 px-4 sm:px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-center">Get In Touch</h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-6 sm:mb-10 md:mb-12">
          Reach us via WhatsApp, Viber, Email, or Phone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Choose your preferred channel</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-1.5 sm:gap-2 ${
                      selectedChannel === channel.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-medium text-center">{channel.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedChannel === "phone" ? (
            <div className="bg-muted/50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <Label className="text-xs sm:text-sm text-muted-foreground">Telephone</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base sm:text-lg font-semibold">(02) 8740-2151</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy("02-8740-2151")}
                  >
                    {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm text-muted-foreground">Mobile</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base sm:text-lg font-semibold">+63 945 875 1971</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy("+639458751971")}
                  >
                    {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => window.open("tel:+63287402151")}
                  className="flex-1"
                >
                  Call Telephone
                </Button>
                <Button
                  type="button"
                  onClick={() => window.open("tel:+639458751971")}
                  className="flex-1"
                >
                  Call Mobile
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="text-sm sm:text-base"
                    required
                  />
                </div>
                {selectedChannel === "email" && (
                  <div>
                    <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="text-sm sm:text-base"
                      required
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="phone" className="text-sm sm:text-base">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 XXX XXX XXXX"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-sm sm:text-base">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <Label htmlFor="source" className="text-sm sm:text-base">Where did you find us?</Label>
                <select
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-input rounded-md bg-background"
                >
                  <option value="">Select one...</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                  <option value="Referral">Referral</option>
                  <option value="Repeat Client">Repeat Client</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send via {channels.find((c) => c.id === selectedChannel)?.label}
              </Button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;

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
    <section id="contact" className="py-16 md:py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Get In Touch</h2>
        <p className="text-center text-muted-foreground mb-12">
          Reach us via WhatsApp, Viber, Email, or Phone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="mb-3 block">Choose your preferred channel</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      selectedChannel === channel.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{channel.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedChannel === "phone" ? (
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Telephone</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-semibold">(02) 8740-2151</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy("02-8740-2151")}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Mobile</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-semibold">+63 945 875 1971</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy("+639458751971")}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
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
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                {selectedChannel === "email" && (
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 XXX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label htmlFor="source">Where did you find us?</Label>
                <select
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
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

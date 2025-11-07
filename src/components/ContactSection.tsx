import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Send, Phone as PhoneIcon, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { leadsService, contactSchema } from "@/lib/dataService";
import { z } from "zod";

type Channel = "whatsapp" | "viber" | "email" | "phone" | "messenger";

const countryCodes = [
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+1-US", country: "USA", flag: "🇺🇸", dialCode: "+1" },
  { code: "+1-CA", country: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
];

const ContactSection = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel>("whatsapp");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+63");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("");
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      return;
    }

    // Basic rate limiting - client side
    const lastSubmitTime = localStorage.getItem("lastContactSubmit");
    if (lastSubmitTime) {
      const timeSinceLastSubmit = Date.now() - parseInt(lastSubmitTime);
      if (timeSinceLastSubmit < 3000) { // 3 seconds
        toast({
          title: "Please wait",
          description: "You're submitting too quickly. Please wait a moment.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      // Get the actual dial code (handle USA/Canada special case)
      const selectedCountry = countryCodes.find(c => c.code === countryCode);
      const actualDialCode = selectedCountry?.dialCode || countryCode;
      
      // Clean phone number: remove leading zeros and spaces
      let cleanedPhone = phone.trim().replace(/^0+/, '');
      
      // Combine country code and phone number
      const fullPhone = cleanedPhone ? `${actualDialCode}${cleanedPhone}` : undefined;
      
      // Validate with zod schema
      const validatedData = contactSchema.parse({
        name: name.trim(),
        email: email && email.trim() ? email.trim() : undefined,
        phone: fullPhone,
        message: message.trim(),
        where_did_you_find_us: source || undefined,
        contact_method: selectedChannel,
      });

      // Save to database ONLY for whatsapp, viber, messenger, email (NOT phone)
      if (selectedChannel !== "phone") {
        await leadsService.createLead({
          name: validatedData.name,
          phone: validatedData.phone,
          message: validatedData.message,
          where_did_you_find_us: validatedData.where_did_you_find_us,
          contact_method: validatedData.contact_method as "whatsapp" | "viber" | "messenger" | "email",
        });

        // Set rate limit timestamp
        localStorage.setItem("lastContactSubmit", Date.now().toString());
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit your message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const selectedCountry = countryCodes.find(c => c.code === countryCode);
    const actualDialCode = selectedCountry?.dialCode || countryCode;
    
    // Clean phone number: remove leading zeros and spaces
    let cleanedPhone = phone.trim().replace(/^0+/, '');
    
    const fullPhone = cleanedPhone ? `${actualDialCode}${cleanedPhone}` : "";
    const encodedMessage = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${fullPhone}\n\n${message}\n\nFound us via: ${source}`
    );

    let url = "";
    switch (selectedChannel) {
      case "whatsapp":
        // Use wa.me format - works on both mobile and web
        url = `https://wa.me/639458751971?text=${encodedMessage}`;
        break;
      case "viber":
        // Viber only works if app is installed, fallback shows number
        url = `viber://contact?number=%2B639458751971`;
        toast({
          title: "Opening Viber",
          description: "If Viber doesn't open, please search for +639458751971 in your Viber app",
        });
        break;
      case "email":
        url = `mailto:technofyph@gmail.com?subject=Inquiry - Technofy&body=${encodedMessage}`;
        break;
      case "messenger":
        // Messenger with page username (without pre-filled text as it's not supported)
        url = `https://m.me/technofy.ph`;
        toast({
          title: "Opening Messenger",
          description: "Please send your message in the chat that opens",
        });
        break;
    }

    if (url) {
      console.log("Opening URL:", url);
      window.open(url, "_blank");
      
      // Show success message
      toast({
        title: "Redirecting...",
        description: `Opening ${channels.find((c) => c.id === selectedChannel)?.label}`,
      });
    }
  };

  return (
    <section id="contact" className="py-6 md:py-16 px-4 sm:px-5 bg-muted/30">
      <div className="container mx-auto max-w-screen-sm md:max-w-4xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-8 text-center">Get In Touch</h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-4 md:mb-8">
          Reach us via WhatsApp, Viber, Email, or Phone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <Label className="mb-1.5 block text-sm">Choose your preferred channel</Label>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`h-20 rounded-xl p-4 flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-0 active:ring-0 ${
                      selectedChannel === channel.id
                        ? "bg-white dark:bg-card border border-[#F05192] text-[#F05192]"
                        : "bg-white dark:bg-card border border-[#E6E6E6] dark:border-neutral-800 focus:border-[#F05192] active:border-[#F05192] focus:text-[#F05192] active:text-[#F05192]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${selectedChannel === channel.id ? "text-[#F05192]" : ""}`} />
                    <span className={`text-sm font-medium text-center ${selectedChannel === channel.id ? "text-[#F05192]" : ""}`}>{channel.label}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="mb-3">
                  <Label htmlFor="name" className="mb-1.5 text-sm">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 md:h-12 text-[15px] w-full rounded-lg border-[#D6D6D6] focus:border-[#F05192] focus-visible:ring-0"
                    required
                  />
                </div>
                {selectedChannel === "email" && (
                  <div className="mb-3">
                    <Label htmlFor="email" className="mb-1.5 text-sm">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-11 md:h-12 text-[15px] w-full rounded-lg border-[#D6D6D6] focus:border-[#F05192] focus-visible:ring-0"
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <Label htmlFor="phone" className="mb-1.5 text-sm">Phone</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="h-11 md:h-12 w-[140px] rounded-lg border-[#D6D6D6] focus:border-[#F05192] focus-visible:ring-0">
                        <SelectValue>
                          {(() => {
                            const selected = countryCodes.find(c => c.code === countryCode);
                            const displayCode = selected?.dialCode || selected?.code || countryCode;
                            return `${selected?.flag} ${displayCode}`;
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {countryCodes.map((country) => {
                          const displayCode = country.dialCode || country.code;
                          return (
                            <SelectItem key={country.code} value={country.code}>
                              <span className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span>{country.country}</span>
                                <span className="text-muted-foreground">{displayCode}</span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="XXX XXX XXXX"
                      className="h-11 md:h-12 text-[15px] flex-1 rounded-lg border-[#D6D6D6] focus:border-[#F05192] focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <Label htmlFor="message" className="mb-1.5 text-sm">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project..."
                  className="min-h-[120px] text-[15px] rounded-lg border-[#D6D6D6] focus:border-[#F05192] focus-visible:ring-0"
                  required
                />
              </div>

              <div className="mb-3">
                <Label htmlFor="source" className="mb-1.5 text-sm">Where did you find us?</Label>
                <select
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full h-11 md:h-12 px-3 text-[15px] border border-[#D6D6D6] rounded-lg bg-background focus:border-[#F05192] focus:outline-none"
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

              {/* Honeypot field - hidden from users, only bots will fill it */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Button 
                type="submit" 
                className="h-12 w-full rounded-xl bg-gradient-to-r from-[#625CC8] to-[#F74F8C] text-white hover:opacity-90 transition-all transform active:scale-95"
              >
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

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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { leadsService, contactSchema } from "@/lib/dataService";
import { getUserLocation } from "@/lib/locationService";
import { z } from "zod";
import * as Flags from "country-flag-icons/react/3x2";

type Channel = "whatsapp" | "viber" | "email" | "phone" | "messenger";

// Helper component to render country flags
const CountryFlag = ({ countryCode }: { countryCode: string }) => {
  try {
    const FlagComponent = (Flags as Record<string, React.ComponentType<{ className?: string; title?: string }>>)[countryCode];
    if (!FlagComponent) return null;
    return <FlagComponent className="w-5 h-4 object-cover rounded-sm" title={countryCode} />;
  } catch (error) {
    return null;
  }
};

const countryCodes = [
  { code: "+63", country: "Philippines", isoCode: "PH" },
  { code: "+1-US", country: "USA", isoCode: "US", dialCode: "+1" },
  { code: "+1-CA", country: "Canada", isoCode: "CA", dialCode: "+1" },
  { code: "+44", country: "United Kingdom", isoCode: "GB" },
  { code: "+61", country: "Australia", isoCode: "AU" },
  { code: "+852", country: "Hong Kong", isoCode: "HK" },
  { code: "+886", country: "Taiwan", isoCode: "TW" },
  { code: "+65", country: "Singapore", isoCode: "SG" },
  { code: "+81", country: "Japan", isoCode: "JP" },
  { code: "+82", country: "South Korea", isoCode: "KR" },
  { code: "+86", country: "China", isoCode: "CN" },
  { code: "+91", country: "India", isoCode: "IN" },
  { code: "+971", country: "UAE", isoCode: "AE" },
  { code: "+974", country: "Qatar", isoCode: "QA" },
  { code: "+966", country: "Saudi Arabia", isoCode: "SA" },
  { code: "+965", country: "Kuwait", isoCode: "KW" },
  { code: "+968", country: "Oman", isoCode: "OM" },
  { code: "+973", country: "Bahrain", isoCode: "BH" },
  { code: "+39", country: "Italy", isoCode: "IT" },
  { code: "+34", country: "Spain", isoCode: "ES" },
  { code: "+33", country: "France", isoCode: "FR" },
  { code: "+49", country: "Germany", isoCode: "DE" },
  { code: "+31", country: "Netherlands", isoCode: "NL" },
  { code: "+41", country: "Switzerland", isoCode: "CH" },
  { code: "+32", country: "Belgium", isoCode: "BE" },
  { code: "+64", country: "New Zealand", isoCode: "NZ" },
  { code: "+60", country: "Malaysia", isoCode: "MY" },
  { code: "+66", country: "Thailand", isoCode: "TH" },
  { code: "+84", country: "Vietnam", isoCode: "VN" },
  { code: "+62", country: "Indonesia", isoCode: "ID" },
  { code: "+20", country: "Egypt", isoCode: "EG" },
  { code: "+27", country: "South Africa", isoCode: "ZA" },
  { code: "+55", country: "Brazil", isoCode: "BR" },
  { code: "+52", country: "Mexico", isoCode: "MX" },
  { code: "+7", country: "Russia", isoCode: "RU" },
];

// Browser detection function
const detectBrowser = (): { name: string; isLocationBlocked: boolean } => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for Safari (including mobile Safari)
  const isSafari = /safari/.test(userAgent) && /^((?!chrome|android|fxios).)*$/.test(userAgent);
  
  // Check for Opera
  const isOpera = /opera|opr/.test(userAgent);
  
  // Check for Opera-based browsers (like Opera GX)
  const isOperaBased = /opr|opera/.test(userAgent);
  
  if (isSafari || isOpera || isOperaBased) {
    return { 
      name: isSafari ? 'Safari' : 'Opera', 
      isLocationBlocked: true 
    };
  }
  
  return { 
    name: 'Other', 
    isLocationBlocked: false 
  };
};

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
  const [userLocation, setUserLocation] = useState<{ country: string | null; region: string | null; city: string | null } | null>(null);
  const { toast } = useToast();

  // Pre-fetch location when component mounts (only if browser supports it)
  useEffect(() => {
    // Detect browser
    const browserInfo = detectBrowser();
    
    // Skip location fetch for Safari and Opera browsers
    if (browserInfo.isLocationBlocked) {
      console.log(`🚫 Location fetch skipped for ${browserInfo.name} browser`);
      setUserLocation({ country: null, region: null, city: null });
      return;
    }

    const fetchLocation = async () => {
      try {
        console.log('📍 Pre-fetching user location...');
        const location = await getUserLocation();
        setUserLocation(location);
        console.log('✅ Location pre-fetched:', location);
      } catch (error) {
        console.error('❌ Failed to pre-fetch location:', error);
        // Set empty location on error
        setUserLocation({ country: null, region: null, city: null });
      }
    };
    
    fetchLocation();
  }, []);

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
    // Wrap in try-catch to handle Safari private browsing mode
    let lastSubmitTime: string | null = null;
    try {
      lastSubmitTime = localStorage.getItem("lastContactSubmit");
    } catch (error) {
      // Safari private browsing mode or localStorage disabled
      console.warn("localStorage not available, skipping rate limit check:", error);
    }
    
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
      const cleanedPhone = phone.trim().replace(/^0+/, '');
      
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
        // Detect browser to check if location is blocked
        const browserInfo = detectBrowser();
        
        // Check if browser blocks location (Safari/Opera)
        let location = userLocation || { country: null, region: null, city: null };
        
        // Only try to fetch location if browser supports it and we don't have it yet
        if (!browserInfo.isLocationBlocked && !location.country && !location.city) {
          console.log('📍 Location not pre-fetched, fetching now...');
          try {
            location = await getUserLocation();
            setUserLocation(location); // Cache it for future use
            console.log('✅ Location fetched during submission:', location);
          } catch (error) {
            console.error('❌ Failed to get location during submission:', error);
            // Continue with empty location if fetch fails
            location = { country: null, region: null, city: null };
          }
        } else if (browserInfo.isLocationBlocked) {
          console.log(`🚫 Skipping location fetch for ${browserInfo.name} browser`);
          location = { country: null, region: null, city: null };
        } else {
          console.log('✅ Using pre-fetched location:', location);
        }

        // Save form data to database (with or without location)
        const leadData = {
          name: validatedData.name,
          phone: validatedData.phone,
          message: validatedData.message,
          where_did_you_find_us: validatedData.where_did_you_find_us,
          contact_method: validatedData.contact_method as "whatsapp" | "viber" | "messenger" | "email",
          country: location.country,
          region: location.region,
          city: location.city,
          geo_source: browserInfo.isLocationBlocked ? 'blocked' : 'ip',
        };

        console.log('💾 Attempting to save lead data:', {
          name: leadData.name,
          phone: leadData.phone,
          message: leadData.message,
          contact_method: leadData.contact_method,
          browser: browserInfo.name,
          locationBlocked: browserInfo.isLocationBlocked,
          country: leadData.country,
          region: leadData.region,
          city: leadData.city,
          geo_source: leadData.geo_source,
        });

        console.log('📤 Calling leadsService.createLead...');
        const result = await leadsService.createLead(leadData);
        console.log('📥 Response from createLead:', result);

        // Check if save failed - if so, show error and prevent redirect
        if (result.error) {
          console.error('❌ Error saving lead:', result.error);
          console.error('Error details:', JSON.stringify(result.error, null, 2));
          console.error('Error message:', result.error.message);
          console.error('Full error object:', result.error);
          
          // Log the lead data that failed to save
          console.error('Failed lead data:', leadData);
          
          // Show error message to user and keep them on the page
          toast({
            title: "Failed to save your message",
            description: result.error.message || "There was an error saving your information. Please try again or contact us directly.",
            variant: "destructive",
          });
          
          // Prevent redirect on error - keep user on page
          return;
        }

        // Verify save was successful before proceeding
        if (!result.data) {
          console.error('❌ No data returned from save operation');
          toast({
            title: "Failed to save your message",
            description: "Your message could not be saved. Please try again or contact us directly.",
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Lead saved successfully!');
        console.log('Saved lead data:', {
          id: result.data.id,
          name: result.data.name,
          country: result.data.country,
          region: result.data.region,
          city: result.data.city,
        });

        // Set rate limit timestamp - wrap in try-catch for Safari private mode
        try {
          localStorage.setItem("lastContactSubmit", Date.now().toString());
        } catch (error) {
          // Safari private browsing mode or localStorage disabled - continue anyway
          console.warn("Could not set rate limit timestamp:", error);
        }
      }
    } catch (error) {
      console.error('❌ Exception during form submission:', error);
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

    // Continue with redirect after database save (whether successful or not)
    const selectedCountry = countryCodes.find(c => c.code === countryCode);
    const actualDialCode = selectedCountry?.dialCode || countryCode;
    
    // Clean phone number: remove leading zeros and spaces
    const cleanedPhone = phone.trim().replace(/^0+/, '');
    
    const fullPhone = cleanedPhone ? `${actualDialCode}${cleanedPhone}` : "";
    const encodedMessage = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${fullPhone}\n\n${message}\n\nFound us via: ${source}`
    );

    let url = "";
    switch (selectedChannel) {
      case "whatsapp":
        url = `https://wa.me/639458751971?text=${encodedMessage}`;
        break;
      case "viber":
        url = `viber://contact?number=%2B639458751971`;
        break;
      case "email":
        url = `mailto:technofyph@gmail.com?subject=Inquiry - Technofy&body=${encodedMessage}`;
        break;
      case "messenger":
        url = `https://m.me/Technofyph`;
        break;
    }

    if (url) {
      // Only redirect if we're not in the database save path (phone channel) 
      // OR if database save was successful (for other channels)
      // For non-phone channels, the redirect only happens if save succeeded (checked above)
      
      // Show success message before redirect
      toast({
        title: "Message sent!",
        description: "Redirecting you to continue the conversation...",
      });

      // Add small delay before redirect to ensure async operations complete
      // This is especially important for Safari which can interrupt async operations
      setTimeout(() => {
        console.log("Redirecting to:", url);
        // Use direct navigation instead of window.open for better mobile support
        try {
          window.location.href = url;
        } catch (error) {
          console.error("Redirect error:", error);
          // Fallback: try opening in new window
          window.open(url, '_blank');
        }
      }, 150); // 150ms delay to ensure database operations complete
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
                      <SelectTrigger className="h-11 md:h-12 w-[110px] rounded-lg border-[#D6D6D6] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 [&>span:first-child]:hidden">
                        <SelectValue placeholder="Select country" className="hidden" />
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {(() => {
                            const selected = countryCodes.find(c => c.code === countryCode);
                            if (selected) {
                              const displayCode = selected.dialCode || selected.code;
                              return (
                                <>
                                  <CountryFlag countryCode={selected.isoCode} />
                                  <span className="text-sm font-medium truncate">{displayCode}</span>
                                </>
                              );
                            }
                            return <span className="text-sm text-muted-foreground">Select</span>;
                          })()}
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {countryCodes.map((country) => {
                          const displayCode = country.dialCode || country.code;
                          return (
                            <SelectItem key={country.code} value={country.code}>
                              <span className="flex items-center gap-2">
                                <CountryFlag countryCode={country.isoCode} />
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
              <div className="hidden" aria-hidden="true">
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

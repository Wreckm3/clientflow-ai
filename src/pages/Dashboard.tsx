import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Sparkles, Loader2, Lock } from "lucide-react";

const MAX_FREE_MESSAGES = 5;

const Dashboard = () => {
  const [service, setService] = useState("");
  const [targetClient, setTargetClient] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const handleGenerate = async () => {
    if (!service || !targetClient || !platform || !tone) {
      toast.error("Please fill in all fields");
      return;
    }

    if (dailyCount >= MAX_FREE_MESSAGES) {
      setLimitReached(true);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-message", {
        body: { service, targetClient, platform, tone },
      });

      if (error) throw error;

      setResult(data);
      setDailyCount((prev) => prev + 1);
      if (dailyCount + 1 >= MAX_FREE_MESSAGES) {
        setLimitReached(true);
      }
      toast.success("Messages generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate messages");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Usage tracker */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Message Generator</h1>
            <p className="text-sm text-muted-foreground">Create high-converting outreach messages</p>
          </div>
          <Badge variant={dailyCount >= MAX_FREE_MESSAGES ? "destructive" : "secondary"} className="text-sm">
            {dailyCount}/{MAX_FREE_MESSAGES} today
          </Badge>
        </div>

        {/* Input form */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Your Service</Label>
                <Input
                  placeholder="e.g. Graphic design, Video editing"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Target Client</Label>
                <Input
                  placeholder="e.g. Small businesses, Startups"
                  value={targetClient}
                  onChange={(e) => setTargetClient(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="instagram">Instagram DM</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="kenyan">Kenyan Vibe 🇰🇪</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="mt-4 w-full sm:w-auto gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Messages
            </Button>
          </CardContent>
        </Card>

        {/* Limit reached overlay */}
        {limitReached && !result && (
          <Card className="mb-6 border-accent">
            <CardContent className="pt-6 text-center">
              <Lock className="w-10 h-10 text-accent mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-2">Daily Limit Reached</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock unlimited messages and get clients faster
              </p>
              <Button className="gap-2">Upgrade to Pro — KSh 999/mo</Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {[
              { label: "Cold Outreach", key: "coldOutreach", badge: "Primary" },
              { label: "Follow-up", key: "followUp", badge: "Follow-up" },
              { label: "Safe Variation", key: "safeVariation", badge: "Safe" },
              { label: "Bold Variation", key: "boldVariation", badge: "Bold" },
            ].map((item) => (
              <Card key={item.key} className={`relative ${limitReached && item.key !== "coldOutreach" ? "overflow-hidden" : ""}`}>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">{item.label}</CardTitle>
                    <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                  </div>
                  {!(limitReached && item.key !== "coldOutreach") && (
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result[item.key] || "")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <p className={`text-sm text-foreground leading-relaxed ${limitReached && item.key !== "coldOutreach" ? "blur-sm select-none" : ""}`}>
                    {result[item.key] || "No message generated"}
                  </p>
                  {limitReached && item.key !== "coldOutreach" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
                      <div className="text-center">
                        <Lock className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="text-sm font-medium text-foreground">Upgrade to unlock</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

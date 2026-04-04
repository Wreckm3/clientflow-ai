import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Target, Loader2, MapPin, AlertCircle, MessageCircle } from "lucide-react";

const ClientTargeting = () => {
  const [service, setService] = useState("");
  const [loading, setLoading] = useState(false);
  const [intel, setIntel] = useState<any>(null);

  const handleGetIntel = async () => {
    if (!service.trim()) {
      toast.error("Please enter your service");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("client-targeting", {
        body: { service },
      });
      if (error) throw error;
      setIntel(data);
      toast.success("Intelligence ready!");
    } catch (error: any) {
      toast.error(error.message || "Failed to get intelligence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Client Targeting Intelligence</h1>
          <p className="text-sm text-muted-foreground">Find where your ideal clients are and how to reach them</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Label>Your Service</Label>
            <Input
              placeholder="e.g. Social media management, Logo design"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="mt-1.5"
            />
            <Button onClick={handleGetIntel} disabled={loading} className="mt-4 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
              Get Client Intelligence
            </Button>
          </CardContent>
        </Card>

        {intel && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Where to Find Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{intel.platforms}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-accent" /> Client Pain Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{intel.painPoints}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" /> Messaging Angle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{intel.angle}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientTargeting;

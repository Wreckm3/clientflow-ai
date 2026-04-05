import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Calendar, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

const Stats = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [totalMessages, setTotalMessages] = useState(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [daysActive, setDaysActive] = useState(1);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { count } = await supabase
        .from("message_history")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setTotalMessages(count || 0);

      const { data } = await supabase
        .from("message_history")
        .select("service, platform, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setRecentMessages(data || []);

      if (data && data.length > 0) {
        const oldest = new Date(data[data.length - 1].created_at);
        const diff = Math.ceil((Date.now() - oldest.getTime()) / 86400000);
        setDaysActive(Math.max(1, diff));
      }
    };
    load();
  }, [user]);

  const stats = [
    { icon: MessageSquare, label: "Messages Today", value: String(profile?.daily_usage_count || 0), color: "text-primary" },
    { icon: TrendingUp, label: "Total Messages", value: String(totalMessages), color: "text-primary" },
    { icon: Calendar, label: "Days Active", value: String(daysActive), color: "text-accent" },
    { icon: Crown, label: "Plan", value: profile?.plan === "premium" ? "Premium" : "Free", color: profile?.plan === "premium" ? "text-accent" : "text-muted-foreground" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Your Stats</h1>
          <p className="text-sm text-muted-foreground">Track your outreach activity</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No messages generated yet. Head to the Generator to create your first outreach message!
              </p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{msg.service}</p>
                      <p className="text-xs text-muted-foreground capitalize">{msg.platform}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Stats;

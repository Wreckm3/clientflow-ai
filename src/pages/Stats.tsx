import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Calendar, Zap } from "lucide-react";

const Stats = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Your Stats</h1>
          <p className="text-sm text-muted-foreground">Track your outreach activity</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MessageSquare, label: "Messages Today", value: "0", color: "text-primary" },
            { icon: TrendingUp, label: "Total Messages", value: "0", color: "text-primary" },
            { icon: Calendar, label: "Days Active", value: "1", color: "text-accent" },
            { icon: Zap, label: "Plan", value: "Free", color: "text-muted-foreground" },
          ].map((stat) => (
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
            <p className="text-sm text-muted-foreground text-center py-8">
              No messages generated yet. Head to the Generator to create your first outreach message!
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Stats;

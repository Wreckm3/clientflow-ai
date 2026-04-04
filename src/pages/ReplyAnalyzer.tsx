import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, Loader2, MessageSquare, ArrowRight, Lightbulb } from "lucide-react";

const ReplyAnalyzer = () => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!reply.trim()) {
      toast.error("Please paste a client reply");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-reply", {
        body: { reply },
      });
      if (error) throw error;
      setAnalysis(data);
      toast.success("Analysis complete!");
    } catch (error: any) {
      toast.error(error.message || "Failed to analyze reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Reply Analyzer</h1>
          <p className="text-sm text-muted-foreground">Paste a client reply and get AI-powered insights</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Label>Client's Reply</Label>
            <Textarea
              placeholder='Paste the reply here, e.g. "Sounds interesting, but I need to check with my team first..."'
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="mt-1.5 min-h-[120px]"
            />
            <Button onClick={handleAnalyze} disabled={loading} className="mt-4 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              Analyze Reply
            </Button>
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> What This Means
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{analysis.meaning}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" /> Suggested Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{analysis.suggestedResponse}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" /> Best Next Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{analysis.nextAction}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReplyAnalyzer;

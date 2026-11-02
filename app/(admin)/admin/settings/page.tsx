import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Platform Settings</h1>
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-warm-ink">AI Matching</div>
            <div className="text-sm text-warm-muted">Enable AI-assisted talent matching</div>
          </div>
          <Button variant="outline" size="sm">Enabled</Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-warm-ink">Content Moderation</div>
            <div className="text-sm text-warm-muted">Require approval for new jobs</div>
          </div>
          <Button variant="outline" size="sm">Enabled</Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-warm-ink">Registration</div>
            <div className="text-sm text-warm-muted">Allow new sign-ups</div>
          </div>
          <Button variant="outline" size="sm">Enabled</Button>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { RefreshCw, Play, Square, Clock, Mail, AlertTriangle } from 'lucide-react';

interface SchedulerStatus {
  isRunning: boolean;
  config: {
    expirationCheckInterval: number;
    reminderCheckInterval: number;
    enableScheduler: boolean;
  };
  nextExpirationCheck: string | null;
  nextReminderCheck: string | null;
}

export function MembershipLifecycleManagement() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/membership/lifecycle');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching scheduler status:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerAction = async (action: string) => {
    try {
      setActionLoading(action);
      const response = await fetch('/api/admin/membership/lifecycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log(data.message);
        await fetchStatus(); // Refresh status
      } else {
        console.error('Action failed:', data.error);
      }
    } catch (error) {
      console.error('Error triggering action:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatInterval = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatNextRun = (dateString: string | null): string => {
    if (!dateString) return 'Not scheduled';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Overdue';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `in ${diffHours}h ${diffMinutes}m`;
    }
    return `in ${diffMinutes}m`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading Lifecycle Management...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Membership Lifecycle Management
          </CardTitle>
          <CardDescription>
            Automated processes for membership expiration handling and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scheduler Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Scheduler Status</h3>
              <Badge variant={status?.isRunning ? 'default' : 'secondary'}>
                {status?.isRunning ? 'Running' : 'Stopped'}
              </Badge>
            </div>
            
            {status && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Expiration Check</p>
                  <p className="text-sm text-muted-foreground">
                    Interval: {formatInterval(status.config.expirationCheckInterval)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Next run: {formatNextRun(status.nextExpirationCheck)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Reminder Check</p>
                  <p className="text-sm text-muted-foreground">
                    Interval: {formatInterval(status.config.reminderCheckInterval)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Next run: {formatNextRun(status.nextReminderCheck)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Scheduler Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Scheduler Controls</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => triggerAction(status?.isRunning ? 'stop_scheduler' : 'start_scheduler')}
                disabled={actionLoading !== null}
                variant={status?.isRunning ? 'destructive' : 'default'}
              >
                {status?.isRunning ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Scheduler
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Scheduler
                  </>
                )}
              </Button>
              
              <Button
                onClick={fetchStatus}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
            </div>
          </div>

          <Separator />

          {/* Manual Triggers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Manual Triggers</h3>
            <p className="text-sm text-muted-foreground">
              Manually trigger lifecycle processes for testing or immediate execution
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button
                onClick={() => triggerAction('run_expiration_check')}
                disabled={actionLoading !== null}
                variant="outline"
                className="justify-start"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {actionLoading === 'run_expiration_check' ? 'Running...' : 'Check Expirations'}
              </Button>
              
              <Button
                onClick={() => triggerAction('run_reminder_check')}
                disabled={actionLoading !== null}
                variant="outline"
                className="justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                {actionLoading === 'run_reminder_check' ? 'Running...' : 'Send Reminders'}
              </Button>
              
              <Button
                onClick={() => triggerAction('run_all_processes')}
                disabled={actionLoading !== null}
                variant="outline"
                className="justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {actionLoading === 'run_all_processes' ? 'Running...' : 'Run All Processes'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Process Information</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-500" />
                <div>
                  <p className="font-medium text-foreground">Expiration Check</p>
                  <p>Identifies expired memberships and updates their status, removes benefits, and sends expiration notifications.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium text-foreground">Reminder Check</p>
                  <p>Sends renewal reminders to members whose memberships expire within 30 days.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <RefreshCw className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">All Processes</p>
                  <p>Runs both expiration checks and reminder processes in sequence.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
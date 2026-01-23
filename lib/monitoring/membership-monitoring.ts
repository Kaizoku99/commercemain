/**
 * Monitoring and alerting system for ATP membership operations
 */

export interface MembershipMetrics {
  activeMemberships: number;
  newSignups: number;
  renewals: number;
  cancellations: number;
  totalRevenue: number;
  averageDiscount: number;
  webhookFailures: number;
  apiErrors: number;
}

export interface MembershipAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class MembershipMonitoringService {
  private metrics: MembershipMetrics = {
    activeMemberships: 0,
    newSignups: 0,
    renewals: 0,
    cancellations: 0,
    totalRevenue: 0,
    averageDiscount: 0,
    webhookFailures: 0,
    apiErrors: 0
  };

  private alerts: MembershipAlert[] = [];
  private readonly maxAlerts = 1000;

  /**
   * Track membership signup
   */
  trackSignup(customerId: string, amount: number): void {
    this.metrics.newSignups++;
    this.metrics.totalRevenue += amount;
    this.metrics.activeMemberships++;

    this.logEvent('membership_signup', {
      customerId,
      amount,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track membership renewal
   */
  trackRenewal(customerId: string, amount: number): void {
    this.metrics.renewals++;
    this.metrics.totalRevenue += amount;

    this.logEvent('membership_renewal', {
      customerId,
      amount,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track membership cancellation
   */
  trackCancellation(customerId: string, reason?: string): void {
    this.metrics.cancellations++;
    this.metrics.activeMemberships = Math.max(0, this.metrics.activeMemberships - 1);

    this.logEvent('membership_cancellation', {
      customerId,
      reason,
      timestamp: new Date().toISOString()
    });

    // Alert on high cancellation rate
    if (this.metrics.cancellations > 10) {
      this.createAlert('warning', 'High cancellation rate detected', {
        cancellations: this.metrics.cancellations,
        activeMemberships: this.metrics.activeMemberships
      });
    }
  }

  /**
   * Track discount application
   */
  trackDiscountApplication(customerId: string, originalPrice: number, discountAmount: number): void {
    const discountPercentage = (discountAmount / originalPrice) * 100;
    
    // Update average discount (simple moving average)
    this.metrics.averageDiscount = 
      (this.metrics.averageDiscount + discountPercentage) / 2;

    this.logEvent('discount_applied', {
      customerId,
      originalPrice,
      discountAmount,
      discountPercentage,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track webhook failure
   */
  trackWebhookFailure(webhookType: string, error: string, payload?: any): void {
    this.metrics.webhookFailures++;

    this.createAlert('error', `Webhook failure: ${webhookType}`, {
      webhookType,
      error,
      payload: payload ? JSON.stringify(payload).substring(0, 500) : undefined,
      timestamp: new Date().toISOString()
    });

    this.logEvent('webhook_failure', {
      webhookType,
      error,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track API error
   */
  trackApiError(endpoint: string, error: string, statusCode?: number): void {
    this.metrics.apiErrors++;

    this.createAlert('error', `API error: ${endpoint}`, {
      endpoint,
      error,
      statusCode,
      timestamp: new Date().toISOString()
    });

    this.logEvent('api_error', {
      endpoint,
      error,
      statusCode,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get current metrics
   */
  getMetrics(): MembershipMetrics {
    return { ...this.metrics };
  }

  /**
   * Get recent alerts
   */
  getAlerts(limit: number = 50): MembershipAlert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Clear old alerts
   */
  clearOldAlerts(olderThanHours: number = 24): void {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - olderThanHours);

    this.alerts = this.alerts.filter(alert => 
      new Date(alert.timestamp) > cutoffTime
    );
  }

  /**
   * Create alert
   */
  private createAlert(type: MembershipAlert['type'], message: string, metadata?: Record<string, any>): void {
    const alert: MembershipAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.alerts.push(alert);

    // Keep only the most recent alerts
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }

    // Log critical alerts
    if (type === 'error') {
      console.error(`🚨 Membership Alert: ${message}`, metadata);
    } else if (type === 'warning') {
      console.warn(`⚠️ Membership Warning: ${message}`, metadata);
    }
  }

  /**
   * Log event for debugging
   */
  private logEvent(eventType: string, data: Record<string, any>): void {
    if (process.env.MEMBERSHIP_DEBUG_MODE === 'true') {
      console.log(`📊 Membership Event: ${eventType}`, data);
    }
  }

  /**
   * Generate health report
   */
  generateHealthReport(): {
    status: 'healthy' | 'warning' | 'critical';
    metrics: MembershipMetrics;
    recentAlerts: MembershipAlert[];
    recommendations: string[];
  } {
    const recentErrors = this.alerts.filter(alert => 
      alert.type === 'error' && 
      new Date(alert.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    const recentWarnings = this.alerts.filter(alert => 
      alert.type === 'warning' && 
      new Date(alert.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    const recommendations: string[] = [];

    // Determine health status
    if (recentErrors.length > 5) {
      status = 'critical';
      recommendations.push('High error rate detected - investigate immediately');
    } else if (recentErrors.length > 0 || recentWarnings.length > 3) {
      status = 'warning';
      recommendations.push('Monitor system closely - some issues detected');
    }

    // Add specific recommendations
    if (this.metrics.webhookFailures > 10) {
      recommendations.push('High webhook failure rate - check Shopify webhook configuration');
    }

    if (this.metrics.apiErrors > 20) {
      recommendations.push('High API error rate - check Shopify API limits and connectivity');
    }

    if (this.metrics.cancellations > this.metrics.newSignups * 0.1) {
      recommendations.push('High cancellation rate - review membership value proposition');
    }

    return {
      status,
      metrics: this.getMetrics(),
      recentAlerts: this.getAlerts(10),
      recommendations
    };
  }

  /**
   * Reset metrics (for testing or periodic reset)
   */
  resetMetrics(): void {
    this.metrics = {
      activeMemberships: 0,
      newSignups: 0,
      renewals: 0,
      cancellations: 0,
      totalRevenue: 0,
      averageDiscount: 0,
      webhookFailures: 0,
      apiErrors: 0
    };
  }
}

// Singleton instance
export const membershipMonitoring = new MembershipMonitoringService();
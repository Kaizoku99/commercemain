import { AtpMembership } from '../types/membership';

export interface NotificationTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface NotificationConfig {
  fromEmail: string;
  fromName: string;
  replyTo?: string;
}

export class MembershipNotificationService {
  private config: NotificationConfig;

  constructor(config?: NotificationConfig) {
    this.config = config || {
      fromEmail: process.env.MEMBERSHIP_FROM_EMAIL || 'membership@atpgroup.ae',
      fromName: 'ATP Group Services',
      replyTo: process.env.MEMBERSHIP_REPLY_TO || 'support@atpgroup.ae'
    };
  }

  /**
   * Send membership expiration notification
   */
  async sendExpirationNotification(membership: AtpMembership): Promise<void> {
    try {
      const template = this.getExpirationTemplate(membership);
      await this.sendEmail(membership.customerId, template);
      
      console.log(`Expiration notification sent for membership ${membership.id}`);
    } catch (error) {
      console.error(`Error sending expiration notification for ${membership.id}:`, error);
      throw error;
    }
  }

  /**
   * Send renewal reminder notification
   */
  async sendRenewalReminder(membership: AtpMembership): Promise<void> {
    try {
      const daysUntilExpiration = this.getDaysUntilExpiration(membership);
      const template = this.getRenewalReminderTemplate(membership, daysUntilExpiration);
      
      await this.sendEmail(membership.customerId, template);
      
      console.log(`Renewal reminder sent for membership ${membership.id}`);
    } catch (error) {
      console.error(`Error sending renewal reminder for ${membership.id}:`, error);
      throw error;
    }
  }

  /**
   * Send renewal confirmation notification
   */
  async sendRenewalConfirmation(membership: AtpMembership): Promise<void> {
    try {
      const template = this.getRenewalConfirmationTemplate(membership);
      await this.sendEmail(membership.customerId, template);
      
      console.log(`Renewal confirmation sent for membership ${membership.id}`);
    } catch (error) {
      console.error(`Error sending renewal confirmation for ${membership.id}:`, error);
      throw error;
    }
  }

  /**
   * Send payment failure notification
   */
  async sendPaymentFailureNotification(membership: AtpMembership): Promise<void> {
    try {
      const template = this.getPaymentFailureTemplate(membership);
      await this.sendEmail(membership.customerId, template);
      
      console.log(`Payment failure notification sent for membership ${membership.id}`);
    } catch (error) {
      console.error(`Error sending payment failure notification for ${membership.id}:`, error);
      throw error;
    }
  }

  /**
   * Send welcome notification for new memberships
   */
  async sendWelcomeNotification(membership: AtpMembership): Promise<void> {
    try {
      const template = this.getWelcomeTemplate(membership);
      await this.sendEmail(membership.customerId, template);
      
      console.log(`Welcome notification sent for membership ${membership.id}`);
    } catch (error) {
      console.error(`Error sending welcome notification for ${membership.id}:`, error);
      throw error;
    }
  }

  /**
   * Get expiration notification template
   */
  private getExpirationTemplate(membership: AtpMembership): NotificationTemplate {
    const expirationDate = new Date(membership.expirationDate).toLocaleDateString();
    
    return {
      subject: 'Your ATP Group Membership Has Expired',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Your ATP Group Membership Has Expired</h2>
          
          <p>Dear Valued Member,</p>
          
          <p>We hope you've enjoyed the exclusive benefits of your ATP Group Services membership. 
          Unfortunately, your membership expired on <strong>${expirationDate}</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #e74c3c; margin-top: 0;">What This Means:</h3>
            <ul>
              <li>Your 15% discount on premium services is no longer active</li>
              <li>Free delivery on product orders has been suspended</li>
              <li>Access to member-exclusive offers has ended</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/membership/renew" 
               style="background-color: #3498db; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Renew Your Membership
            </a>
          </div>
          
          <p>Renew today for just 99 AED and continue enjoying:</p>
          <ul>
            <li>15% discount on all premium services</li>
            <li>Free delivery on all orders</li>
            <li>Priority booking and exclusive offers</li>
          </ul>
          
          <p>Thank you for being part of the ATP Group family.</p>
          
          <p>Best regards,<br>
          The ATP Group Team</p>
        </div>
      `,
      textContent: `
        Your ATP Group Membership Has Expired
        
        Dear Valued Member,
        
        Your membership expired on ${expirationDate}. This means your 15% discount on premium services and free delivery benefits are no longer active.
        
        Renew today for just 99 د.إ to continue enjoying all membership benefits.
        
        Visit: ${process.env.NEXT_PUBLIC_SITE_URL}/membership/renew
        
        Thank you for being part of the ATP Group family.
        
        Best regards,
        The ATP Group Team
      `
    };
  }

  /**
   * Get renewal reminder template
   */
  private getRenewalReminderTemplate(membership: AtpMembership, daysUntilExpiration: number): NotificationTemplate {
    const expirationDate = new Date(membership.expirationDate).toLocaleDateString();
    
    return {
      subject: `Your ATP Group Membership Expires in ${daysUntilExpiration} Days`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f39c12;">Your Membership Expires Soon</h2>
          
          <p>Dear Valued Member,</p>
          
          <p>This is a friendly reminder that your ATP Group Services membership will expire on 
          <strong>${expirationDate}</strong> (in ${daysUntilExpiration} days).</p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
            <h3 style="color: #856404; margin-top: 0;">Don't Lose Your Benefits!</h3>
            <p style="margin-bottom: 0;">Renew now to continue enjoying your exclusive membership benefits without interruption.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/membership/renew" 
               style="background-color: #27ae60; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Renew Now - 99 AED
            </a>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px;">
            <h4 style="color: #27ae60; margin-top: 0;">Your Membership Benefits:</h4>
            <ul style="margin-bottom: 0;">
              <li>15% discount on Home Massage & Spa Services</li>
              <li>15% discount on EMS Training sessions</li>
              <li>15% discount on Home Yoga Sessions</li>
              <li>15% discount on Cosmetics & Health Supplements</li>
              <li>Free delivery on all product orders</li>
            </ul>
          </div>
          
          <p>Questions? Contact our support team at ${this.config.replyTo}</p>
          
          <p>Best regards,<br>
          The ATP Group Team</p>
        </div>
      `,
      textContent: `
        Your ATP Group Membership Expires in ${daysUntilExpiration} Days
        
        Dear Valued Member,
        
        Your membership expires on ${expirationDate}. Renew now for just 99 د.إ to continue enjoying:
        
        - 15% discount on all premium services
        - Free delivery on all orders
        - Priority booking and exclusive offers
        
        Renew at: ${process.env.NEXT_PUBLIC_SITE_URL}/membership/renew
        
        Questions? Contact: ${this.config.replyTo}
        
        Best regards,
        The ATP Group Team
      `
    };
  }

  /**
   * Get renewal confirmation template
   */
  private getRenewalConfirmationTemplate(membership: AtpMembership): NotificationTemplate {
    const newExpirationDate = new Date(membership.expirationDate).toLocaleDateString();
    
    return {
      subject: 'ATP Group Membership Renewed Successfully',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">Membership Renewed Successfully!</h2>
          
          <p>Dear Valued Member,</p>
          
          <p>Great news! Your ATP Group Services membership has been successfully renewed.</p>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <h3 style="color: #155724; margin-top: 0;">Membership Details:</h3>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Valid Until:</strong> ${newExpirationDate}</p>
            <p style="margin-bottom: 0;"><strong>Membership ID:</strong> ${membership.id}</p>
          </div>
          
          <h3 style="color: #2c3e50;">Your Active Benefits:</h3>
          <ul>
            <li>✅ 15% discount on Home Massage & Spa Services</li>
            <li>✅ 15% discount on EMS Training sessions</li>
            <li>✅ 15% discount on Home Yoga Sessions</li>
            <li>✅ 15% discount on Cosmetics & Health Supplements</li>
            <li>✅ Free delivery on all product orders</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/membership" 
               style="background-color: #3498db; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View Membership Dashboard
            </a>
          </div>
          
          <p>Thank you for continuing to be part of the ATP Group family!</p>
          
          <p>Best regards,<br>
          The ATP Group Team</p>
        </div>
      `,
      textContent: `
        ATP Group Membership Renewed Successfully!
        
        Dear Valued Member,
        
        Your membership has been successfully renewed and is valid until ${newExpirationDate}.
        
        Your active benefits include:
        - 15% discount on all premium services
        - Free delivery on all orders
        
        View your dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/account/membership
        
        Thank you for continuing to be part of the ATP Group family!
        
        Best regards,
        The ATP Group Team
      `
    };
  }

  /**
   * Get payment failure template
   */
  private getPaymentFailureTemplate(membership: AtpMembership): NotificationTemplate {
    return {
      subject: 'Payment Failed - ATP Group Membership',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">Payment Failed</h2>
          
          <p>Dear Valued Member,</p>
          
          <p>We were unable to process your membership renewal payment. This may be due to:</p>
          
          <ul>
            <li>Insufficient funds</li>
            <li>Expired payment method</li>
            <li>Bank security restrictions</li>
          </ul>
          
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e74c3c;">
            <h3 style="color: #721c24; margin-top: 0;">Action Required</h3>
            <p style="margin-bottom: 0;">Please update your payment method and try again to avoid service interruption.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/membership/renew" 
               style="background-color: #e74c3c; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Update Payment Method
            </a>
          </div>
          
          <p>If you continue to experience issues, please contact our support team at ${this.config.replyTo}</p>
          
          <p>Best regards,<br>
          The ATP Group Team</p>
        </div>
      `,
      textContent: `
        Payment Failed - ATP Group Membership
        
        Dear Valued Member,
        
        We were unable to process your membership renewal payment. Please update your payment method to avoid service interruption.
        
        Update payment: ${process.env.NEXT_PUBLIC_SITE_URL}/membership/renew
        
        Need help? Contact: ${this.config.replyTo}
        
        Best regards,
        The ATP Group Team
      `
    };
  }

  /**
   * Get welcome template for new memberships
   */
  private getWelcomeTemplate(membership: AtpMembership): NotificationTemplate {
    const expirationDate = new Date(membership.expirationDate).toLocaleDateString();
    
    return {
      subject: 'Welcome to ATP Group Services Membership!',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">Welcome to ATP Group Services Membership!</h2>
          
          <p>Dear New Member,</p>
          
          <p>Congratulations! Your ATP Group Services membership is now active and ready to use.</p>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <h3 style="color: #155724; margin-top: 0;">Membership Details:</h3>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Valid Until:</strong> ${expirationDate}</p>
            <p style="margin-bottom: 0;"><strong>Membership ID:</strong> ${membership.id}</p>
          </div>
          
          <h3 style="color: #2c3e50;">Your Exclusive Benefits:</h3>
          <ul>
            <li>🎯 15% discount on Home Massage & Spa Services</li>
            <li>💪 15% discount on EMS Training sessions</li>
            <li>🧘 15% discount on Home Yoga Sessions</li>
            <li>🌿 15% discount on Cosmetics & Health Supplements</li>
            <li>🚚 Free delivery on all product orders</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/membership" 
               style="background-color: #3498db; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View Your Dashboard
            </a>
          </div>
          
          <p>Start booking your services and enjoy immediate savings!</p>
          
          <p>Welcome to the ATP Group family!</p>
          
          <p>Best regards,<br>
          The ATP Group Team</p>
        </div>
      `,
      textContent: `
        Welcome to ATP Group Services Membership!
        
        Dear New Member,
        
        Your membership is now active until ${expirationDate}.
        
        Your exclusive benefits:
        - 15% discount on all premium services
        - Free delivery on all orders
        
        View dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/account/membership
        
        Welcome to the ATP Group family!
        
        Best regards,
        The ATP Group Team
      `
    };
  }

  /**
   * Calculate days until expiration
   */
  private getDaysUntilExpiration(membership: AtpMembership): number {
    const now = new Date();
    const expirationDate = new Date(membership.expirationDate);
    const diffTime = expirationDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Send email using configured email service
   */
  private async sendEmail(customerId: string, template: NotificationTemplate): Promise<void> {
    // In a real implementation, this would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Shopify's email service
    
    console.log(`Sending email to customer ${customerId}:`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Content: ${template.textContent.substring(0, 100)}...`);
    
    // For now, we'll just log the email. In production, implement actual email sending:
    /*
    const emailService = new EmailService();
    await emailService.send({
      to: await this.getCustomerEmail(customerId),
      from: this.config.fromEmail,
      fromName: this.config.fromName,
      replyTo: this.config.replyTo,
      subject: template.subject,
      html: template.htmlContent,
      text: template.textContent
    });
    */
  }

  /**
   * Get customer email address from Shopify
   */
  private async getCustomerEmail(customerId: string): Promise<string> {
    // This would fetch the customer's email from Shopify
    // For now, return a placeholder
    return `customer-${customerId}@example.com`;
  }
}
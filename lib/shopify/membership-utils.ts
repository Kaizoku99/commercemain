// Define CustomerData interface locally - compatible with customer hook data structure
export interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  orders: Array<{
    name: string;
    processedAt: string;
    fulfillmentStatus?: string;
    financialStatus?: string;
    currentTotalPrice: {
      amount: string;
      currencyCode: string;
    };
    lineItems: Array<{
      quantity: number;
      title: string;
    }>;
  }>;
}

export interface MembershipStats {
  totalOrders: number;
  totalSpent: number;
  memberSavings: number;
  memberSince: string;
  tier: "basic" | "premium" | "elite";
  nextTierProgress: number;
}

export function calculateMembershipStats(customer: CustomerData): MembershipStats {
  const orders = customer.orders || [];
  const totalOrders = orders.length;
  
  // Calculate total spent
  const totalSpent = orders.reduce((sum: number, order: CustomerData['orders'][0]) => {
    return sum + parseFloat(order.currentTotalPrice.amount);
  }, 0);

  // Calculate member savings (assuming 15% discount for premium members)
  const memberSavings = totalSpent * 0.15;

  // Determine membership tier based on total spent
  let tier: "basic" | "premium" | "elite" = "basic";
  let nextTierProgress = 0;

  if (totalSpent >= 5000) {
    tier = "elite";
    nextTierProgress = 100;
  } else if (totalSpent >= 1000) {
    tier = "premium";
    // Progress to elite (need 5000 total)
    nextTierProgress = Math.min(100, (totalSpent / 5000) * 100);
  } else {
    tier = "basic";
    // Progress to premium (need 1000 total)
    nextTierProgress = Math.min(100, (totalSpent / 1000) * 100);
  }

  // Get member since date from first order or account creation
  const memberSince = orders.length > 0 
    ? orders[orders.length - 1].processedAt 
    : new Date().toISOString();

  return {
    totalOrders,
    totalSpent,
    memberSavings,
    memberSince,
    tier,
    nextTierProgress,
  };
}

export function getRecentOrders(customer: CustomerData, limit: number = 3) {
  const orders = customer.orders || [];
  
  return orders
    .slice(0, limit)
    .map((order: CustomerData['orders'][0]) => ({
      id: order.name,
      date: order.processedAt,
      status: order.fulfillmentStatus || order.financialStatus,
      total: parseFloat(order.currentTotalPrice.amount),
      memberSavings: parseFloat(order.currentTotalPrice.amount) * 0.15, // 15% savings
      items: order.lineItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0),
    }));
}

export function getNextTierRequirement(currentTier: "basic" | "premium" | "elite", totalSpent: number) {
  switch (currentTier) {
    case "basic":
      return {
        nextTier: "premium",
        amountNeeded: Math.max(0, 1000 - totalSpent),
        totalRequired: 1000,
      };
    case "premium":
      return {
        nextTier: "elite",
        amountNeeded: Math.max(0, 5000 - totalSpent),
        totalRequired: 5000,
      };
    case "elite":
      return {
        nextTier: null,
        amountNeeded: 0,
        totalRequired: 5000,
      };
    default:
      return {
        nextTier: "premium",
        amountNeeded: 1000,
        totalRequired: 1000,
      };
  }
}
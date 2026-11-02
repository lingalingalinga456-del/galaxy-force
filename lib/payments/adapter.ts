export interface PaymentProvider {
  name: string;
  displayName: string;
  logo: string;
  createPayment: (
    amount: number,
    currency: 'BDT' | 'USD',
    metadata: Record<string, unknown>
  ) => Promise<{ success: true; paymentUrl?: string; reference: string } | { success: false; error: string }>;
  verifyPayment: (reference: string) => Promise<{ success: boolean; status: 'pending' | 'available' | 'failed'; amount?: number }>;
  initiatePayout: (amount: number, currency: 'BDT' | 'USD', recipientInfo: Record<string, unknown>) => Promise<{ success: true; reference: string } | { success: false; error: string }>;
}

export interface PaymentAdapterOptions {
  apiKey?: string;
  merchantId?: string;
  sandbox?: boolean;
  testMode?: boolean;
}

export class ManualDemoAdapter implements PaymentProvider {
  name = 'manual_demo';
  displayName = 'Demo Mode';
  logo = '';

  async createPayment(
    amount: number,
    currency: 'BDT' | 'USD',
    metadata: Record<string, unknown>
  ): Promise<{ success: true; paymentUrl?: string; reference: string } | { success: false; error: string }> {
    const reference = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return {
      success: true,
      reference,
    };
  }

  async verifyPayment(reference: string): Promise<{ success: boolean; status: 'pending' | 'available' | 'failed'; amount?: number }> {
    return {
      success: true,
      status: 'available',
    };
  }

  async initiatePayout(
    amount: number,
    currency: 'BDT' | 'USD',
    recipientInfo: Record<string, unknown>
  ): Promise<{ success: true; reference: string } | { success: false; error: string }> {
    const reference = `payout_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return {
      success: true,
      reference,
    };
  }
}

export class BKashSandboxAdapter implements PaymentProvider {
  name = 'bkash_sandbox';
  displayName = 'bKash (Sandbox)';
  logo = '/logos/bkash.svg';

  async createPayment(
    amount: number,
    currency: 'BDT' | 'USD',
    metadata: Record<string, unknown>
  ): Promise<{ success: true; paymentUrl?: string; reference: string } | { success: false; error: string }> {
    return {
      success: true,
      reference: `bks_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    };
  }

  async verifyPayment(reference: string): Promise<{ success: boolean; status: 'pending' | 'available' | 'failed'; amount?: number }> {
    return {
      success: true,
      status: 'available',
    };
  }

  async initiatePayout(
    amount: number,
    currency: 'BDT' | 'USD',
    recipientInfo: Record<string, unknown>
  ): Promise<{ success: true; reference: string } | { success: false; error: string }> {
    const reference = `bkp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return {
      success: true,
      reference,
    };
  }
}

export class NagadSandboxAdapter implements PaymentProvider {
  name = 'nagad_sandbox';
  displayName = 'Nagad (Sandbox)';
  logo = '/logos/nagad.svg';

  async createPayment(
    amount: number,
    currency: 'BDT' | 'USD',
    metadata: Record<string, unknown>
  ): Promise<{ success: true; paymentUrl?: string; reference: string } | { success: false; error: string }> {
    return {
      success: true,
      reference: `ngd_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    };
  }

  async verifyPayment(reference: string): Promise<{ success: boolean; status: 'pending' | 'available' | 'failed'; amount?: number }> {
    return {
      success: true,
      status: 'available',
    };
  }

  async initiatePayout(
    amount: number,
    currency: 'BDT' | 'USD',
    recipientInfo: Record<string, unknown>
  ): Promise<{ success: true; reference: string } | { success: false; error: string }> {
    const reference = `ngp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return {
      success: true,
      reference,
    };
  }
}

export class SSLCommerzSandboxAdapter implements PaymentProvider {
  name = 'sslcommerz_sandbox';
  displayName = 'SSLCommerz (Sandbox)';
  logo = '/logos/sslcommerz.svg';

  async createPayment(
    amount: number,
    currency: 'BDT' | 'USD',
    metadata: Record<string, unknown>
  ): Promise<{ success: true; paymentUrl?: string; reference: string } | { success: false; error: string }> {
    return {
      success: true,
      reference: `ssl_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    };
  }

  async verifyPayment(reference: string): Promise<{ success: boolean; status: 'pending' | 'available' | 'failed'; amount?: number }> {
    return {
      success: true,
      status: 'available',
    };
  }

  async initiatePayout(
    amount: number,
    currency: 'BDT' | 'USD',
    recipientInfo: Record<string, unknown>
  ): Promise<{ success: true; reference: string } | { success: false; error: string }> {
    const reference = `slp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return {
      success: true,
      reference,
    };
  }
}

export function getPaymentAdapter(provider: string): PaymentProvider {
  switch (provider) {
    case 'bkash_sandbox':
      return new BKashSandboxAdapter();
    case 'nagad_sandbox':
      return new NagadSandboxAdapter();
    case 'sslcommerz_sandbox':
      return new SSLCommerzSandboxAdapter();
    case 'manual_demo':
    default:
      return new ManualDemoAdapter();
  }
}
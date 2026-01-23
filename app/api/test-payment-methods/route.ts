import { NextRequest, NextResponse } from 'next/server';
import { getShopPaymentSettings, getAvailablePaymentMethods } from '@/lib/shopify/shop';

export async function GET(request: NextRequest) {
    try {
        console.log('Testing payment methods API...');

        // Test 1: Get shop payment settings
        const paymentSettings = await getShopPaymentSettings();
        console.log('Payment settings:', paymentSettings);

        // Test 2: Get available payment methods
        const paymentMethods = await getAvailablePaymentMethods();
        console.log('Available payment methods:', paymentMethods);

        return NextResponse.json({
            success: true,
            test: 'Payment methods API test',
            results: {
                paymentSettings,
                paymentMethods,
                methodCount: paymentMethods.length,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Test API error:', error);

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        }, { status: 500 });
    }
}

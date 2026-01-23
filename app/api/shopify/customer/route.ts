import { NextRequest, NextResponse } from "next/server";
import { customerAccountFetch } from "@/lib/shopify/customer-account";

export async function POST(request: NextRequest) {
  try {
    const { query, variables, customerAccessToken } = await request.json();

    const response = await customerAccountFetch({
      query,
      variables,
      customerAccessToken,
    });

    return NextResponse.json(response.body);
  } catch (error) {
    console.error("Shopify Customer API Error:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch customer data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
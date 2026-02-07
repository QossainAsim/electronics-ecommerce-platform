// app/api/validate-email/route.ts

import { NextRequest, NextResponse } from 'next/server';

/**
 * Email validation API endpoint
 * 
 * This endpoint validates email addresses using multiple methods:
 * 1. Format validation (regex)
 * 2. Domain validation (DNS check)
 * 3. Optional: Third-party API integration
 */

// Helper function to check if domain has MX records
async function checkDomainMX(domain: string): Promise<boolean> {
  try {
    // Note: DNS lookups are not natively supported in Edge runtime
    // You'll need to use a third-party API or run this in Node.js runtime
    // This is a placeholder implementation
    
    // Option 1: Use a third-party API like AbstractAPI, Hunter.io, etc.
    // Option 2: Use a server-side DNS library (only works in Node.js runtime)
    
    return true; // Assume valid for now
  } catch (error) {
    console.error('Domain check failed:', error);
    return false;
  }
}

// Helper function to validate email using AbstractAPI (example)
async function validateWithAbstractAPI(email: string): Promise<{ exists: boolean; message: string }> {
  const API_KEY = process.env.ABSTRACT_API_KEY;
  
  if (!API_KEY) {
    console.warn('ABSTRACT_API_KEY not configured');
    return { exists: true, message: 'Email validation not configured' };
  }

  try {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${encodeURIComponent(email)}`
    );
    
    const data = await response.json();
    
    // AbstractAPI response structure:
    // {
    //   email: "test@example.com",
    //   autocorrect: "",
    //   deliverability: "DELIVERABLE" | "UNDELIVERABLE" | "RISKY" | "UNKNOWN",
    //   quality_score: 0.99,
    //   is_valid_format: { value: true },
    //   is_free_email: { value: false },
    //   is_disposable_email: { value: false },
    //   is_role_email: { value: false },
    //   is_catchall_email: { value: false },
    //   is_mx_found: { value: true },
    //   is_smtp_valid: { value: true }
    // }
    
    if (data.deliverability === 'DELIVERABLE') {
      return { exists: true, message: 'Email is valid and deliverable' };
    } else if (data.deliverability === 'RISKY') {
      return { exists: true, message: 'Email may exist but is risky' };
    } else {
      return { exists: false, message: 'Email may not exist or is undeliverable' };
    }
  } catch (error) {
    console.error('AbstractAPI validation failed:', error);
    return { exists: true, message: 'Could not verify email' };
  }
}

// Helper function to validate email using EmailListVerify (example)
async function validateWithEmailListVerify(email: string): Promise<{ exists: boolean; message: string }> {
  const API_KEY = process.env.EMAILLISTVERIFY_API_KEY;
  
  if (!API_KEY) {
    console.warn('EMAILLISTVERIFY_API_KEY not configured');
    return { exists: true, message: 'Email validation not configured' };
  }

  try {
    const response = await fetch(
      `https://apps.emaillistverify.com/api/verifyEmail?secret=${API_KEY}&email=${encodeURIComponent(email)}`
    );
    
    const data = await response.json();
    
    // EmailListVerify response:
    // {
    //   email: "test@example.com",
    //   status: "valid" | "invalid" | "unknown" | "disposable" | "catchall"
    // }
    
    if (data.status === 'valid') {
      return { exists: true, message: 'Email is valid' };
    } else if (data.status === 'unknown' || data.status === 'catchall') {
      return { exists: true, message: 'Email status is uncertain' };
    } else {
      return { exists: false, message: 'Email is invalid or disposable' };
    }
  } catch (error) {
    console.error('EmailListVerify validation failed:', error);
    return { exists: true, message: 'Could not verify email' };
  }
}

// Simple format validation
function validateEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Extract domain from email
function extractDomain(email: string): string {
  return email.split('@')[1] || '';
}

// Check if domain is a common free email provider
function isKnownEmailProvider(domain: string): boolean {
  const knownProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'icloud.com', 'live.com', 'msn.com', 'protonmail.com',
    'aol.com', 'zoho.com', 'mail.com', 'gmx.com'
  ];
  
  return knownProviders.includes(domain.toLowerCase());
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { exists: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Step 1: Format validation
    if (!validateEmailFormat(email)) {
      return NextResponse.json(
        { exists: false, message: 'Invalid email format' },
        { status: 200 }
      );
    }

    // Step 2: Extract domain
    const domain = extractDomain(email);
    
    // Step 3: If it's a known provider, assume it's valid
    if (isKnownEmailProvider(domain)) {
      return NextResponse.json(
        { exists: true, message: 'Email format is valid' },
        { status: 200 }
      );
    }

    // Step 4: Use third-party API for validation
    // Choose one of the following methods:
    
    // Method A: AbstractAPI (recommended for accuracy)
    // const result = await validateWithAbstractAPI(email);
    
    // Method B: EmailListVerify
    // const result = await validateWithEmailListVerify(email);
    
    // Method C: Just validate format and domain (no API required)
    const domainValid = await checkDomainMX(domain);
    const result = {
      exists: domainValid,
      message: domainValid ? 'Email appears valid' : 'Domain may not exist'
    };

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Email validation error:', error);
    
    // In case of error, return true to allow checkout to proceed
    return NextResponse.json(
      { exists: true, message: 'Could not verify email' },
      { status: 200 }
    );
  }
}
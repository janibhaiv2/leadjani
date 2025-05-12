import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();

  // Add trailing slashes for consistency
  if (url.pathname === '/csv-processor') {
    url.pathname = '/csv-processor/';
    return NextResponse.redirect(url);
  }

  if (url.pathname === '/split-leads') {
    url.pathname = '/split-leads/';
    return NextResponse.redirect(url);
  }

  if (url.pathname === '/merge-leads') {
    url.pathname = '/merge-leads/';
    return NextResponse.redirect(url);
  }

  if (url.pathname === '/advanced-filter') {
    url.pathname = '/advanced-filter/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/csv-processor', '/split-leads', '/merge-leads', '/advanced-filter'],
};

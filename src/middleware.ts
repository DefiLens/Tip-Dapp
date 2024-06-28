import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login'
  
  const token = request.cookies.get("privy-token")?.value || "";

  console.log(token)
  if(isPublicPath && token){
    return NextResponse.redirect(new URL('/', request.url))
  }
  if(!isPublicPath && !token){
    return NextResponse.redirect(new URL('/login', request.url))
  }

}
 
export const config = {
  matcher: [
    // '/',
    '/login',
    '/deposit',
    '/create-post',
    '/bookmarks',
    '/profile',
    '/profile/edit',
  ]
}
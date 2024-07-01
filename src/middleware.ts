import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login'
  const token = request.cookies.get("privy-token")?.value || "";
  // const token = request.cookies.get("login-token")?.value || "";

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
    // '/login',
    '/deposit',
    '/create-post',
    '/bookmarks',
    '/profile',
    '/profile/edit',
  ]
}

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // This function can be marked async if using await inside
// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   const isPublicPath = ['/login', '/onboarding'].includes(path);
//   const isProtectedPath = [
//     '/',
//     '/deposit',
//     '/cart',
//     '/create-post',
//     '/bookmarks',
//     '/profile',
//     '/profile/edit',
//   ].includes(path);

//   const token = request.cookies.get("login-token")?.value || "";
//   console.log(token)

//   // If the user is logged in and trying to access the onboarding or login page, redirect them to the home page
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   // If the user is not logged in and trying to access a protected page, redirect them to the login page
//   if (isProtectedPath && !token) {
//     return NextResponse.redirect(new URL('/onboarding', request.url));
//   }

//   // Allow access to all other pages
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/',
//     '/login',
//     '/onboarding',
//     '/deposit',
//     '/create-post',
//     '/bookmarks',
//     '/profile',
//     '/profile/edit',
//   ],
// };
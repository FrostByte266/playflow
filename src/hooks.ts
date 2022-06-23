// import type { Handle, GetSession } from "@sveltejs/kit"
// import type { IEmployee } from '$lib/types/employee'

// import jwtDecode from "jwt-decode"

// interface JWT extends IEmployee {
//     _id: string
//     exp: number
// }

// export const handle: Handle = async ({ event, resolve }) => {
//     // Make sure we are not trying to parse out tokens when visting login screen
//     if(event.url.pathname.includes('login')) {
//         return await resolve(event)
//     }
//     try {
//         const token = jwtDecode<JWT>(event.request.headers.get('cookie') || '')
//         // JWT expiry dates are expressed as UNIX epoch (seconds),
//         // Date objects use microseconds, so we must make the two equal in scale
//         if(token.exp * 1000 < Date.now()) {
//             throw new Error('Expired token')
//         }
//         const { ID, name, role, _id } = token
//         event.locals.user = { ID, name, role, _id }
//         return await resolve(event)
//     } catch (e) {
//         // If there are errors decoding the JWT, it has been altered by the client,
//         // redirect to the login page to get a new one
//         // Will also redirect if the JWT was expired
//         return new Response('Redirect',
//             {
//                 status: 303,
//                 headers: {
//                     Location: '/login'
//                 }
//             }
//         )
//     }
    
// }

// export const getSession: GetSession = event => event.locals



// import React from "react";
// import { Authenticator } from "@aws-amplify/ui-react";
// import { Amplify } from "aws-amplify";
// import "@aws-amplify/ui-react/styles.css";







// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
//       userPoolClientId:
//         process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
//     },
//   },
// });
  



// const formFields = {
//   signUp: {
//     username: {
//       order: 1,
//       placeholder: "Choose a username",
//       label: "Username",
//       inputProps: { required: true },
//     },
//     email: {
//       order: 2, // Corrected order
//       placeholder: "Enter your email address",
//       label: "Email",
//       inputProps: { type: "email", required: true },
//     },
//     password: {
//       order: 3,
//       placeholder: "Enter your password",
//       label: "Password",
//       inputProps: { type: "password", required: true },
//     },
//     confirm_password: {
//       order: 4,
//       placeholder: "Confirm your password",
//       label: "Confirm Password",
//       inputProps: { type: "password", required: true },
//     },
//   },
// };

// const AuthProvider = ({ children }: any) => {
//   return (
//     <div>
//       <Authenticator formFields={formFields}>
//         {({ user, signOut }) => // Destructure 'signOut' from the context
//           user ? (
//             // --- FIX FOR 'attributes' ERROR: Access 'username' directly ---
//             <div>
//               <h1>Welcome, {user.username || 'User'}!</h1> {/* Changed this line */}
//               <button onClick={signOut}>Sign Out</button>
//               {children}
//             </div>
//           ) : (
//             <div>
//               <h1>Please sign in below:</h1>
//             </div>
//           )
//         }
//       </Authenticator>
//     </div>
//   );
// };

// export default AuthProvider;



// File: TaskFlow/client/src/authprovider.tsx

import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
      // If you are using a userPoolWebClientId (for SPA/web apps), it's good practice to include it here:
      // userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    },
  },
});

const formFields = {
  signUp: {
    // Reorder email to be first for better UX, or keep it as order: 2
    email: {
      order: 1, // Changed order
      placeholder: "Enter your email address",
      label: "Email",
      inputProps: { type: "email", required: true },
    },
    // This 'username' field will be mapped to the Cognito 'username' primary identifier.
    // If your User Pool uses email as the primary sign-in (most common),
    // then the 'username' field in your form should be treated as 'preferred_username'
    // in Cognito. We need to tell Authenticator how to map this.
    // We achieve this by *renaming* the key in formFields to 'preferred_username' directly,
    // and letting the Authenticator handle the primary 'username' from 'email' if configured.
    preferred_username: { // CHANGED KEY FROM 'username' TO 'preferred_username'
      order: 2, // Changed order
      placeholder: "Choose a display username", // More descriptive placeholder
      label: "Display Username", // More descriptive label
      // You can also use 'Username' if that's what you prefer to call it on the UI
      inputProps: { required: true },
    },
    // NEW FIELD FOR 'name'
    name: { // ADDED THIS FIELD FOR THE REQUIRED 'name' ATTRIBUTE
      order: 3, // New order
      placeholder: "Enter your full name",
      label: "Full Name",
      inputProps: { required: true },
    },
    password: {
      order: 4, // Changed order
      placeholder: "Enter your password",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
    confirm_password: {
      order: 5, // Changed order
      placeholder: "Confirm your password",
      label: "Confirm Password",
      inputProps: { type: "password", required: true },
    },
  },
};

const AuthProvider = ({ children }: any) => {
  return (
    <div>
      <Authenticator formFields={formFields}>
        {({ user, signOut }) => // Destructure 'signOut' from the context
          user ? (
            <div>
              {/* Accessing user.username for display. Cognito's user.username is the primary identifier. */}
              {/* If you prefer to display preferred_username here, you'd access user.attributes.preferred_username */}
              <h1>Welcome, {user.username || (user as any).attributes?.preferred_username || 'User'}!</h1>
              <button onClick={signOut}>Sign Out</button>
              {children}
            </div>
          ) : (
            <div>
              <h1>Please sign in below:</h1>
            </div>
          )
        }
      </Authenticator>
    </div>
  );
};

export default AuthProvider;
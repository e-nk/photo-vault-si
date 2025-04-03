// app/auth-test/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function AuthTestPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSupabaseUser() {
      if (isSignedIn && user) {
        try {
          const response = await fetch("/api/users/current");
          const data = await response.json();
          
          if (data.error) {
            setError(data.error);
          } else {
            setSupabaseUser(data.user);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else if (isLoaded && !isSignedIn) {
        setLoading(false);
      }
    }

    fetchSupabaseUser();
  }, [isSignedIn, isLoaded, user]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      {isSignedIn ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Clerk User</h2>
          <pre className="bg-gray-100 p-4 rounded mb-6 overflow-auto max-w-full">
            {JSON.stringify({
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl
            }, null, 2)}
          </pre>
          
          <h2 className="text-xl font-semibold mb-2">Supabase User</h2>
          {error ? (
            <div className="text-red-500 mb-4">Error: {error}</div>
          ) : supabaseUser ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-w-full">
              {JSON.stringify(supabaseUser, null, 2)}
            </pre>
          ) : (
            <div className="text-yellow-500">
              No Supabase user found. The webhook might not have processed yet.
            </div>
          )}
          
				<button 
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					onClick={async () => {
						try {
							setLoading(true);
							const response = await fetch("/api/users", {
								method: "POST"
							});
							const data = await response.json();
							
							if (!response.ok) {
								console.error("Error response:", data);
								setError(data.error || `Error: ${response.status} ${response.statusText}`);
								if (data.details) {
									console.error("Error details:", data.details);
								}
							} else {
								setSupabaseUser(data.user);
								setError(null);
							}
						} catch (err) {
							console.error("Exception:", err);
							setError(err.message);
						} finally {
							setLoading(false);
						}
					}}
				>
					Manually Sync User
				</button>
        </div>
      ) : (
        <div>
          <p>You are not signed in.</p>
          <a 
            href="/sign-in"
            className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </a>
        </div>
      )}
    </div>
  );
}
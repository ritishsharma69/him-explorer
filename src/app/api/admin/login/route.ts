import { NextResponse, type NextRequest } from "next/server";

import { authenticateAdmin } from "@/server/services/admin-auth.service";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

	  if (!email || !password) {
	    return NextResponse.json(
	      { error: "Email and password are required" },
	      { status: 400 },
	    );
	  }

	  // Temporary: hardcoded admin credentials for initial setup.
	  // Email field should contain "admin@gmail.com" and password "password".
	  if (email === "admin@gmail.com" && password === "password") {
	    return NextResponse.json({
	      admin: {
	        id: "hardcoded-admin",
	        fullName: "Demo Admin",
	        email: "admin@example.com",
	        role: "admin",
	      },
	    });
	  }

	  const result = await authenticateAdmin(email, password);

	  if (!result.ok) {
	    return NextResponse.json(
	      { error: "Invalid credentials" },
	      { status: 401 },
	    );
	  }

	  // TODO: Issue a proper session or JWT and set httpOnly cookie.

	  return NextResponse.json({ admin: result.admin });
}

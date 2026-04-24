import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { WaitlistSignupBodySchema } from "@/lib/services/waitlist.types";
import { createWaitlistSignup, deleteWaitlistSignup } from "@/lib/services/waitlist.service";

export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = WaitlistSignupBodySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    try {
        const result = await createWaitlistSignup(parsed.data);
        return NextResponse.json({ success: true, created: result.created });
    } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_EMAIL') {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }
        console.error('POST /api/waitlist error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

const DeleteBodySchema = z.object({
    email: z.string().trim().min(1).max(320),
});

export async function DELETE(request: NextRequest) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = DeleteBodySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    try {
        const result = await deleteWaitlistSignup(parsed.data.email);
        return NextResponse.json({ success: true, deleted: result.deleted });
    } catch (error) {
        console.error('DELETE /api/waitlist error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

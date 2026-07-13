"use client";

// ModerateButton is superseded by AdminCommentList which handles all comment
// moderation actions (approve, unapprove, delete, bulk, reply) with session-
// based auth. This file is kept as a no-op stub in case it is referenced
// anywhere else, but it renders nothing.

export default function ModerateButton(_props: {
	commentId: string;
	currentApproved: boolean;
}) {
	return null;
}

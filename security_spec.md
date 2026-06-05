# Security Spec

## Data Invariants
1. plant_journals:
   - Must belong strictly to the authenticated user (`userId == request.auth.uid`).
   - Image should be valid string length, title and content restricted size.
   - Tags array max size bounded.
   - Likes not applicable.
2. stories:
   - Must belong strictly to the authenticated user (`userId == request.auth.uid`).
   - `likes` field can only be incremented or decremented properly? Wait, since stories are personal, only the owner can like it? Let's just say only owner can write and read their own stories for now, as it's a personal journal app.
   - Owner can edit their own stories.

## The Dirty Dozen Payloads (Conceptual)
1. Write plant journal with `userId` not matching logged in user (`userId: 'hacker'`).
2. Write story without tracking `createdAt`.
3. Update `userId` to a different user during update.
4. Payload with tags size exceeding 10.
5. Create journal with missing title.
6. Create story with missing content.
7. Read another user's story directly by guessing ID.
8. Update story changing `createdAt`.
9. Send image string > 5000 characters.
10. Spoofing user email without `email_verified == true`.
11. Update fields using un-listed properties.
12. Attempt to list all plant journals without validating `userId == request.auth.uid` in resource data.

## Test Runner
Defined in `firestore.rules.test.ts`.

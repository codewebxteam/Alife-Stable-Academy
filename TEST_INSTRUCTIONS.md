# Partner Dashboard Real-Time Testing Instructions

## How the System Works

When a student signs up with a partner's referral code:
1. A record is created in Firestore `sales` collection
2. The partner's dashboard listens to this collection in real-time
3. The "Students Sold" counter updates automatically

## Testing Steps

### Step 1: Sign Up as Partner
1. Go to `/signup`
2. Click "Signup as a Partner"
3. Fill in details and sign up
4. Note your referral code (check Firebase Realtime Database → users → your UID → referralCode)

### Step 2: Sign Up as Student with Referral Code
1. Open incognito/private window
2. Go to `/signup`
3. Fill in student details
4. In "Referral code" field, enter the partner's referral code
5. Sign up

### Step 3: Check Partner Dashboard
1. Go back to partner account
2. Navigate to `/dashboard`
3. You should see "Students Sold: 1" (updates in real-time)

## Verify in Firebase Console

### Check Firestore Collections:

**partners collection:**
```
{
  userId: "partner_uid",
  referralCode: "abc123",
  commissionRate: 10,
  pendingCommission: 0,
  clearedCommission: 0
}
```

**sales collection:**
```
{
  partnerId: "partner_uid",
  customerName: "Student Name",
  customerEmail: "student@email.com",
  courseName: "Platform Registration",
  amount: 0,
  purchaseDate: timestamp,
  planDays: 0
}
```

## Current Implementation

The Dashboard.tsx already has:
- ✅ Real-time Firestore listener for sales
- ✅ Automatic count calculation
- ✅ Live updates when new students join

The counter will show 0 until students sign up with your referral code.

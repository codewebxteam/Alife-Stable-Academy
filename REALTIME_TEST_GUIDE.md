# Real-Time Sales Tracking - Test Guide

## How to Test Real-Time Functionality

### Step 1: Create Partner Account
1. Go to `/signup`
2. Click "Signup as a Partner"
3. Fill in details and create account
4. Note your referral code from `/resell` page

### Step 2: Open Partner Dashboard
1. Login as partner
2. Go to `/partnerdashboard`
3. Keep this tab open
4. You should see "Total: 0" in Sales Overview

### Step 3: Create Student Account with Referral
1. Open a NEW browser tab (or incognito window)
2. Go to `/signup`
3. Fill in student details
4. **IMPORTANT**: Enter the partner's referral code in "Referral code" field
5. Create account

### Step 4: Purchase a Course
1. As the student, go to `/pricing`
2. Click "Get Started" on any package (₹999, ₹2,499, or ₹4,999)
3. Purchase will be processed

### Step 5: Check Partner Dashboard (Real-Time Update)
1. Go back to the Partner Dashboard tab
2. **The Sales Overview table should automatically update** showing:
   - Customer name
   - Course name (package name)
   - Amount paid
   - Purchase date
3. Stats at top should also update:
   - Students Sold: +1
   - Total Revenue: +amount
   - Commission Earned: +20% of amount

## What Happens Behind the Scenes

1. **Student Signup**: Referral code saved to `users/{studentId}/referralCode`
2. **Purchase**: Creates record in `sales/{timestamp}_{studentId}` with `partnerId`
3. **Real-Time Sync**: Firebase `onValue` listener in PartnerDashboard automatically detects new sale
4. **Dashboard Updates**: Table and stats refresh instantly without page reload

## Firebase Structure Created

```
users/
  {studentId}/
    referralCode: "partnercode"
    purchases/
      {packageId}/
        ...

sales/
  {timestamp}_{studentId}/
    partnerId: "partnercode"
    studentName: "Student Name"
    courseName: "Pro Starter"
    amount: 999
    commission: 199.8
    purchaseDate: 1234567890
    status: "pending"
```

## Troubleshooting

### Sales not showing?
1. Check if student entered referral code during signup
2. Verify referral code matches partner's code (check `/resell`)
3. Check Firebase console: `sales/` node should have entries
4. Ensure `partnerId` in sales matches partner's `referralCode`

### Real-time not working?
1. Refresh partner dashboard
2. Check browser console for errors
3. Verify Firebase connection
4. Make sure partner is logged in

## Expected Results

✅ Sales appear instantly in partner dashboard
✅ No page refresh needed
✅ Stats update automatically
✅ Commission calculated (20%)
✅ All tabs (Sales, Insights, Earnings) show updated data

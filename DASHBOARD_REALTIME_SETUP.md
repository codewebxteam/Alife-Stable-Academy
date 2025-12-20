# ✅ Real-Time Sales Tracking in Dashboard

## What's Been Done

The Dashboard.tsx now has **REAL-TIME** sales tracking functionality. When a student purchases a course using a partner's referral code, the sale appears **INSTANTLY** in the partner's dashboard without any page refresh.

## How It Works

### 1. **Student Signup with Referral**
- Student enters partner's referral code during signup
- Code saved to `users/{studentId}/referralCode`

### 2. **Student Purchases Course**
- Goes to `/pricing` page
- Clicks "Get Started" on any package (₹999, ₹2,499, or ₹4,999)
- Purchase creates sale record in Firebase:
  ```
  sales/{timestamp}_{studentId}/
    partnerId: "partnercode"
    studentName: "Student Name"
    courseName: "Package Name"
    amount: 999
    commission: 199.8 (20%)
    purchaseDate: timestamp
    status: "pending"
  ```

### 3. **Real-Time Update in Dashboard**
- Partner's Dashboard has Firebase listener (`onValue`)
- Automatically detects new sales
- Updates table instantly with:
  - Customer name
  - Course name
  - Purchase date
  - View Details button

### 4. **Live Indicator**
- Green pulsing dot shows "Live" status
- Confirms real-time sync is active

## Dashboard Features

### Sales Tab
- Real-time sales table
- Customer details
- Course purchased
- Purchase date
- View details modal

### Course Insights Tab
- Best selling courses
- Sales count per course
- Revenue per course
- Trending indicators

### Earnings Tab
- Total commission (20%)
- Pending payments
- Cleared payments
- Commission breakdown by course

## Stats Cards (Auto-Update)
1. **Students Sold** - Total number of sales
2. **Total Revenue** - Sum of all sales amounts
3. **Courses Sold** - Unique courses sold
4. **Commission Rate** - Fixed at 20%
5. **Commission Earned** - Total commission from all sales

## Testing Steps

1. **Create Partner Account**
   - Signup as partner
   - Get referral code from `/resell`

2. **Open Dashboard**
   - Login as partner
   - Go to `/dashboard`
   - See "Total: 0" in Sales Overview

3. **Create Student & Purchase**
   - New browser/incognito
   - Signup as student with partner's referral code
   - Go to `/pricing`
   - Purchase any package

4. **Watch Dashboard Update**
   - Go back to partner dashboard
   - **Sale appears instantly** in table
   - Stats update automatically
   - No refresh needed!

## Key Points

✅ Uses Firebase Realtime Database
✅ `onValue` listener for real-time sync
✅ 20% commission rate
✅ Clean referral code handling
✅ Live indicator shows active sync
✅ All tabs update automatically
✅ Works across all devices

## Firebase Structure

```
users/
  {studentId}/
    referralCode: "partnercode"

sales/
  {timestamp}_{studentId}/
    partnerId: "partnercode"
    studentName: "Name"
    courseName: "Pro Starter"
    amount: 999
    commission: 199.8
    purchaseDate: 1234567890
    expiryDate: 1234567890
    planDays: 180
    status: "pending"
```

## No More Separate PartnerDashboard

All functionality is now in **Dashboard.tsx** only. Partners see their sales, insights, and earnings all in one place with real-time updates!

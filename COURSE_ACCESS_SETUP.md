# Course Access System - Setup Guide

## Overview
This system implements real-time course access management based on pricing tiers. When users purchase a course package, they automatically get access to courses according to their selected tier.

## Pricing Tiers

### 1. Pro Starter (₹999)
- 5 Core Courses
- Community Support
- Weekly Assignments
- Certificate
- Duration: 180 days

### 2. Premium Elite (₹2,499)
- 12 Advanced Courses
- Priority Support
- Case Studies
- Portfolio Review
- Duration: 365 days

### 3. Supreme Master (₹4,999)
- All Courses (Unlimited)
- 1-on-1 Mentorship
- Job Placement
- Lifetime Access
- Duration: Lifetime

## How It Works

### Purchase Flow
1. User visits `/pricing` page
2. Selects a package and clicks "Get Started"
3. System creates purchase record in Firebase:
   ```
   users/{userId}/purchases/{packageId}
   ```
4. Updates user's active package
5. If user has referral code, creates sale record for partner:
   ```
   sales/{timestamp}_{userId}
   ```

### Course Access Check
- Use `useCourseAccess` hook to check user's access
- Use `hasAccessToCourse(packageId, courseId)` to verify specific course access
- Use `isPackageActive(purchaseDate, packageId)` to check if package is still valid

### Partner Commission
- Partners earn 20% commission on all sales
- Commission tracked in real-time in PartnerDashboard
- Sales data automatically synced when students purchase

## Firebase Structure

```
users/
  {userId}/
    purchases/
      {packageId}/
        packageId: string
        packageName: string
        price: number
        purchaseDate: timestamp
        expiryDate: timestamp (-1 for lifetime)
        status: "active" | "expired"
        courses: array | "all"
    activePackage: string

sales/
  {timestamp}_{userId}/
    partnerId: string (referral code)
    studentId: string
    studentName: string
    courseName: string
    amount: number
    commission: number
    purchaseDate: timestamp
    expiryDate: timestamp
    planDays: number
    status: "pending" | "cleared"
```

## Usage Examples

### Check Course Access in Component
```tsx
import { useCourseAccess } from "@/hooks/useCourseAccess";

function CourseComponent() {
  const { hasAccess, activePackage, loading } = useCourseAccess("course1");
  
  if (loading) return <div>Loading...</div>;
  if (!hasAccess) return <div>Purchase required</div>;
  
  return <div>Course content...</div>;
}
```

### Display User's Courses
```tsx
import MyCourses from "@/components/MyCourses";

function Dashboard() {
  return <MyCourses />;
}
```

### Partner Dashboard
- Automatically shows real-time sales
- Displays commission breakdown
- Shows course insights
- All data synced from Firebase

## Integration Points

1. **Home Page** - Pricing section links to `/pricing`
2. **Pricing Page** - Handles purchases and Firebase updates
3. **Dashboard** - Shows user's active courses via MyCourses component
4. **Partner Dashboard** - Real-time sales and commission tracking
5. **Course Pages** - Check access before showing content

## Testing

1. Create a test user account
2. Visit `/pricing` and purchase a package
3. Check Firebase to verify purchase record
4. Visit dashboard to see active courses
5. If using referral code, check partner dashboard for sale record

## Notes

- All prices are in Indian Rupees (₹)
- Commission rate is 20% for partners
- Lifetime access packages have expiryDate = -1
- Package expiry is checked in real-time
- Sales data updates automatically for partners

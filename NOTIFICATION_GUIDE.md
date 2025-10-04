# Local Notifications in React Native with Expo

This guide shows how to implement local notifications in your React Native app using Expo Notifications.

## Features Implemented

✅ **Permission Management**: Request and check notification permissions  
✅ **Immediate Notifications**: Send notifications that appear instantly  
✅ **Delayed Notifications**: Schedule notifications for later (seconds/minutes)  
✅ **Future Notifications**: Schedule notifications for specific dates  
✅ **Notification Management**: Cancel individual or all notifications  
✅ **Event Handling**: Listen for notification taps and responses  
✅ **Status Tracking**: Monitor permission status and scheduled notifications  

## Files Created/Modified

### 1. `services/notificationService.ts`
A comprehensive service class that handles all notification operations:

- **Permission Management**: `requestPermissions()`, `areNotificationsEnabled()`
- **Scheduling**: `scheduleNotification()`, `scheduleDelayedNotification()`, `scheduleNotificationForDate()`
- **Management**: `cancelNotification()`, `cancelAllNotifications()`, `getScheduledNotifications()`
- **Event Handling**: `addNotificationResponseListener()`, `addNotificationReceivedListener()`

### 2. `app/(tabs)/index.tsx`
Updated the home screen with a complete notification demo:

- Permission status display
- Interactive buttons for all notification types
- Real-time status updates
- Error handling with user feedback

### 3. `components/NotificationExample.tsx`
A reusable component showing how to use notifications in other parts of your app.

## Usage Examples

### Basic Usage

```typescript
import { NotificationService } from '@/services/notificationService';

// Request permissions
const hasPermission = await NotificationService.requestPermissions();

// Send immediate notification
await NotificationService.scheduleNotification({
  title: 'Hello!',
  body: 'This is a notification',
  data: { type: 'immediate' }
});

// Schedule delayed notification (5 seconds)
await NotificationService.scheduleDelayedNotification({
  title: 'Delayed',
  body: 'This appears in 5 seconds',
  data: { type: 'delayed' }
}, 5);

// Schedule for specific date
const futureDate = new Date();
futureDate.setMinutes(futureDate.getMinutes() + 1);
await NotificationService.scheduleNotificationForDate({
  title: 'Future',
  body: 'This appears in 1 minute',
  data: { type: 'future' }
}, futureDate);
```

### Event Handling

```typescript
// Listen for notification taps
const responseListener = NotificationService.addNotificationResponseListener(
  (response) => {
    console.log('User tapped notification:', response);
    // Handle navigation or other actions
  }
);

// Listen for notifications received while app is open
const notificationListener = NotificationService.addNotificationReceivedListener(
  (notification) => {
    console.log('Notification received:', notification);
  }
);

// Clean up listeners
NotificationService.removeNotificationSubscription(responseListener);
NotificationService.removeNotificationSubscription(notificationListener);
```

### Permission Management

```typescript
// Check if notifications are enabled
const isEnabled = await NotificationService.areNotificationsEnabled();

// Get detailed permission status
const permissions = await NotificationService.getPermissionsStatus();
console.log('Permission status:', permissions.status);
```

## Testing the Implementation

1. **Run your app**: `npm start` or `expo start`
2. **Grant permissions**: Tap "Request Permission" button
3. **Test immediate notifications**: Tap "Send Immediate Notification"
4. **Test delayed notifications**: Tap "Schedule 5s Delayed Notification"
5. **Test future notifications**: Tap "Schedule 1min Future Notification"
6. **Test cancellation**: Tap "Cancel All Notifications"

## Platform-Specific Notes

### iOS
- Notifications work in both foreground and background
- Users must grant permission for notifications to appear
- Badge numbers can be set on app icon

### Android
- Notifications work in both foreground and background
- Permission is granted automatically on Android 13+
- Custom notification channels can be configured

## Advanced Features

### Custom Notification Data
```typescript
await NotificationService.scheduleNotification({
  title: 'Custom Notification',
  body: 'With custom data',
  data: {
    userId: '123',
    action: 'navigate',
    screen: 'profile',
    timestamp: Date.now()
  }
});
```

### Notification Management
```typescript
// Get all scheduled notifications
const scheduled = await NotificationService.getScheduledNotifications();
console.log('Scheduled notifications:', scheduled.length);

// Cancel specific notification
await NotificationService.cancelNotification(notificationId);

// Cancel all notifications
await NotificationService.cancelAllNotifications();
```

## Troubleshooting

### Common Issues

1. **Notifications not appearing**: Check if permissions are granted
2. **Permission denied**: Guide users to app settings to enable notifications
3. **Notifications not working on device**: Test on physical device, not simulator
4. **TypeScript errors**: Ensure all imports are correct and types are properly defined

### Debug Tips

- Use `console.log` to track notification events
- Check permission status before scheduling
- Test on physical devices for accurate behavior
- Use Expo Go app for development testing

## Next Steps

- Add push notifications for remote notifications
- Implement notification categories and actions
- Add notification scheduling UI
- Create notification history/logs
- Add notification preferences in settings

## Dependencies

The implementation uses:
- `expo-notifications`: Core notification functionality
- `react-native`: UI components and platform APIs
- `expo`: Expo framework for React Native

All dependencies are already included in your `package.json`.

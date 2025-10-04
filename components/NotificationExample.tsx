import { NotificationService } from '@/services/notificationService';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface NotificationExampleProps {
  onNotificationSent?: () => void;
}

export const NotificationExample: React.FC<NotificationExampleProps> = ({ onNotificationSent }) => {
  const sendCustomNotification = async () => {
    try {
      await NotificationService.scheduleNotification({
        title: 'Custom Notification',
        body: 'This is a custom notification from your app!',
        data: { 
          type: 'custom',
          timestamp: Date.now(),
          userId: 'user123'
        }
      });
      
      Alert.alert('Success', 'Custom notification sent!');
      onNotificationSent?.();
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification. Make sure permissions are granted.');
    }
  };

  const scheduleReminder = async () => {
    try {
      // Schedule a reminder for 10 seconds from now
      await NotificationService.scheduleDelayedNotification({
        title: 'Reminder',
        body: 'Don\'t forget to check your app!',
        data: { type: 'reminder' }
      }, 10);
      
      Alert.alert('Success', 'Reminder scheduled for 10 seconds!');
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule reminder.');
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={sendCustomNotification}>
        <Text style={styles.buttonText}>Send Custom Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={scheduleReminder}>
        <Text style={styles.buttonText}>Schedule Reminder (10s)</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

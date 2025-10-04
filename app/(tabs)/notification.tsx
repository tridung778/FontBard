import { NotificationService } from '@/services/notificationService';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Bank {
  id: string;
  name: string;
}

export default function NotificationScreen() {
  const [message, setMessage] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(false);

  const banks: Bank[] = [
    { id: '1', name: 'Vietcombank' },
    { id: '2', name: 'BIDV' },
    { id: '3', name: 'VietinBank' },
    { id: '4', name: 'Techcombank' },
    { id: '5', name: 'ACB' },
  ];

  React.useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const hasPermission = await NotificationService.areNotificationsEnabled();
    setNotificationPermission(hasPermission);
  };

  const requestPermission = async () => {
    try {
      const granted = await NotificationService.requestPermissions();
      setNotificationPermission(granted);
      if (granted) {
        Alert.alert('Thành công', 'Đã cấp quyền thông báo!');
      } else {
        Alert.alert('Từ chối', 'Quyền thông báo bị từ chối.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể yêu cầu quyền thông báo.');
    }
  };

  const sendImmediateNotification = async () => {
    if (!notificationPermission) {
      Alert.alert('Lỗi', 'Vui lòng cấp quyền thông báo trước!');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung tin nhắn!');
      return;
    }

    try {
      await NotificationService.scheduleNotification({
        title: selectedBank ? `Thông báo từ ${selectedBank.name}` : 'Thông báo FontBard',
        body: message,
        data: { 
          type: 'immediate',
          bank: selectedBank?.name || 'N/A',
          timestamp: Date.now()
        }
      });
      Alert.alert('Thành công', 'Đã gửi thông báo ngay!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi thông báo.');
    }
  };

  const sendDelayedNotification = async (seconds: number) => {
    if (!notificationPermission) {
      Alert.alert('Lỗi', 'Vui lòng cấp quyền thông báo trước!');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung tin nhắn!');
      return;
    }

    try {
      await NotificationService.scheduleDelayedNotification({
        title: selectedBank ? `Thông báo từ ${selectedBank.name}` : 'Thông báo FontBard',
        body: message,
        data: { 
          type: 'delayed',
          bank: selectedBank?.name || 'N/A',
          delay: seconds,
          timestamp: Date.now()
        }
      }, seconds);
      Alert.alert('Thành công', `Đã lên lịch thông báo sau ${seconds} giây!`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lên lịch thông báo.');
    }
  };

  const scheduleNotification = async () => {
    if (!notificationPermission) {
      Alert.alert('Lỗi', 'Vui lòng cấp quyền thông báo trước!');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung tin nhắn!');
      return;
    }

    // Schedule for 1 minute from now
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 1);

    try {
      await NotificationService.scheduleNotificationForDate({
        title: selectedBank ? `Thông báo từ ${selectedBank.name}` : 'Thông báo FontBard',
        body: message,
        data: { 
          type: 'scheduled',
          bank: selectedBank?.name || 'N/A',
          scheduledTime: futureDate.toISOString(),
          timestamp: Date.now()
        }
      }, futureDate);
      Alert.alert('Thành công', 'Đã lên lịch thông báo cho 1 phút tới!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lên lịch thông báo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>FontBard</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Nhập nội dung tin nhắn</Text>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Nhập nội dung thông báo..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Chọn ngân hàng</Text>
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <View style={styles.listIcon} />
              <Text style={styles.listTitle}>List</Text>
            </View>
            {banks.map((bank, index) => (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.listItem,
                  selectedBank?.id === bank.id && styles.selectedItem
                ]}
                onPress={() => setSelectedBank(bank)}
              >
                <Text style={[
                  styles.listItemText,
                  selectedBank?.id === bank.id && styles.selectedItemText
                ]}>
                  {bank.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!notificationPermission && (
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Cấp quyền thông báo</Text>
          </TouchableOpacity>
        )}

        <View style={styles.buttonGrid}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.sendNowButton]} 
            onPress={sendImmediateNotification}
            disabled={!notificationPermission}
          >
            <Text style={styles.buttonText}>Gửi ngay</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.delayButton]} 
            onPress={() => sendDelayedNotification(5)}
            disabled={!notificationPermission}
          >
            <Text style={styles.buttonText}>Sau 5s</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.delayButton]} 
            onPress={() => sendDelayedNotification(60)}
            disabled={!notificationPermission}
          >
            <Text style={styles.buttonText}>Sau 1p</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.scheduleButton]} 
            onPress={scheduleNotification}
            disabled={!notificationPermission}
          >
            <Text style={styles.buttonText}>Hẹn giờ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'transparent',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  listContainer: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  listIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    marginRight: 10,
    borderRadius: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedItem: {
    backgroundColor: '#333',
  },
  listItemText: {
    fontSize: 16,
    color: '#ffffff',
  },
  selectedItemText: {
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  sendNowButton: {
    backgroundColor: '#4CAF50',
  },
  delayButton: {
    backgroundColor: '#2196F3',
  },
  scheduleButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

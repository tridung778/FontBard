import { NotificationService } from '@/services/notificationService';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Bank {
  id: string;
  name: string;
  image: string;
}

const { width, height } = Dimensions.get('window');

export default function NotificationScreen() {
  const [message, setMessage] = useState('');
  const [bankSpecificMessage, setBankSpecificMessage] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [delaySeconds, setDelaySeconds] = useState<number>(60); // Default 1 minute
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Reset bank-specific message when bank changes
  const handleBankSelection = (bank: Bank) => {
    setSelectedBank(bank);
    setBankSpecificMessage(''); // Reset the bank-specific message
  };
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const banks: Bank[] = [
    { id: '1', name: 'Vietcombank', image: require('@/assets/banks/Vietcombank.png') },
    { id: '2', name: 'BIDV', image: require('@/assets/banks/BIDV.png') },
    { id: '3', name: 'Techcombank', image: require('@/assets/banks/Techcombank.png') },
    { id: '4', name: 'ACB', image: require('@/assets/banks/ACB.png') },
    { id: '5', name: 'Sacombank', image: require('@/assets/banks/Sacombank.png') }, 
    { id: '6', name: 'VPBank', image: require('@/assets/banks/VPBank.webp') }, 
    { id: '7', name: 'MB Bank', image: require('@/assets/banks/MBBank.jpg') }, 
    { id: '8', name: 'TPBank', image: require('@/assets/banks/TPBank.jpg') }, 
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

  const getBankSpecificMessage = (bankName: string) => {
    // If user has entered a custom bank-specific message, use that instead
    if (bankSpecificMessage.trim()) {
      return bankSpecificMessage;
    }
    
    // Otherwise use default messages
    const bankMessages: { [key: string]: string } = {
      'Vietcombank': 'Thông báo từ Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam',
      'BIDV': 'Thông báo từ BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
      'VietinBank': 'Thông báo từ VietinBank - Ngân hàng TMCP Công thương Việt Nam',
      'Techcombank': 'Thông báo từ Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam',
      'ACB': 'Thông báo từ ACB - Ngân hàng TMCP Á Châu',
      'Agribank': 'Thông báo từ Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
      'Sacombank': 'Thông báo từ Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín',
      'VPBank': 'Thông báo từ VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng',
      'MB Bank': 'Thông báo từ MB Bank - Ngân hàng TMCP Quân đội',
      'TPBank': 'Thông báo từ TPBank - Ngân hàng TMCP Tiên Phong',
      'HDBank': 'Thông báo từ HDBank - Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh',
      'MSB': 'Thông báo từ MSB - Ngân hàng TMCP Hàng Hải',
      'VIB': 'Thông báo từ VIB - Ngân hàng TMCP Quốc tế Việt Nam',
      'Eximbank': 'Thông báo từ Eximbank - Ngân hàng TMCP Xuất Nhập khẩu Việt Nam',
      'SeABank': 'Thông báo từ SeABank - Ngân hàng TMCP Đông Nam Á'
    };
    return bankMessages[bankName] || `Thông báo từ ${bankName}`;
  };

  const validateNotification = () => {
    if (!notificationPermission) {
      return 'Vui lòng cấp quyền thông báo trước!';
    }

    if (!message.trim()) {
      return 'Vui lòng nhập nội dung tin nhắn!';
    }

    if (!selectedBank) {
      return 'Vui lòng chọn ngân hàng!';
    }

    return null; // No errors
  };

  const sendImmediateNotification = async () => {
    const errorMessage = validateNotification();
    if (errorMessage) {
      Alert.alert('Lỗi', errorMessage);
      return;
    }

    setIsLoading(true);
    try {
      await NotificationService.scheduleNotification({
        title: getBankSpecificMessage(selectedBank.name),
        body: message,
        data: { 
          type: 'immediate',
          bank: selectedBank.name,
          bankId: selectedBank.id,
          timestamp: Date.now()
        }
      });
      Alert.alert('Thành công', `Đã gửi thông báo từ ${selectedBank.name}!`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi thông báo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle delay selection
  const handleDelaySelection = () => {
    Alert.alert(
      'Chọn thời gian trì hoãn',
      'Chọn thời gian trì hoãn cho thông báo:',
      [
        { text: '10 giây', onPress: () => setDelaySeconds(10) },
        { text: '30 giây', onPress: () => setDelaySeconds(30) },
        { text: '1 phút', onPress: () => setDelaySeconds(60) },
        { text: '5 phút', onPress: () => setDelaySeconds(300) },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  // Timer countdown function
  const startTimer = (seconds: number) => {
    setTimeRemaining(seconds);
    setTimerActive(true);
    
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return timer;
  };

  const sendDelayedNotification = async (seconds: number) => {
    const errorMessage = validateNotification();
    if (errorMessage) {
      Alert.alert('Lỗi', errorMessage);
      return;
    }

    // Log delay time
    console.log(`Scheduling notification with manual delay: ${seconds} seconds`);
    
    setIsLoading(true);
    
    // Start the countdown timer
    const timerInterval = startTimer(seconds);
    
    try {
      // Show a toast message that notification is scheduled
      Alert.alert('Thông báo', `Đã lên lịch thông báo từ ${selectedBank.name} sau ${seconds} giây!`);
      
      // Use setTimeout for manual delay instead of the notification service's built-in delay
      setTimeout(async () => {
        try {
          // Send immediate notification after the timeout
          await NotificationService.scheduleNotification({
            title: getBankSpecificMessage(selectedBank.name),
            body: message,
            data: { 
              type: 'delayed',
              bank: selectedBank.name,
              bankId: selectedBank.id,
              delay: seconds,
              timestamp: Date.now()
            }
          });
          console.log(`Manual delay completed, notification sent after ${seconds} seconds`);
        } catch (error) {
          console.error('Error sending delayed notification:', error);
          Alert.alert('Lỗi', 'Không thể gửi thông báo sau khi trì hoãn.');
        }
      }, seconds * 1000);
      
    } catch (error) {
      clearInterval(timerInterval);
      setTimerActive(false);
      Alert.alert('Lỗi', 'Không thể lên lịch thông báo.');
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleNotification = async () => {
    const errorMessage = validateNotification();
    if (errorMessage) {
      Alert.alert('Lỗi', errorMessage);
      return;
    }

    setIsLoading(true);
    // Schedule for 1 minute from now
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 1);

    try {
      await NotificationService.scheduleNotificationForDate({
        title: getBankSpecificMessage(selectedBank.name),
        body: message,
        data: { 
          type: 'scheduled',
          bank: selectedBank.name,
          bankId: selectedBank.id,
          scheduledTime: futureDate.toISOString(),
          timestamp: Date.now()
        }
      }, futureDate);
      Alert.alert('Thành công', `Đã lên lịch thông báo từ ${selectedBank.name} cho 1 phút tới!`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lên lịch thông báo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>FontBard</Text>
            <Text style={styles.subtitle}>Gửi thông báo thông minh</Text>
          </View>

          {selectedBank && (
            <View style={styles.card}>
              <Text style={styles.label}>Tiêu đề thông báo</Text>
              <TextInput
                style={styles.textInput}
                value={bankSpecificMessage}
                onChangeText={setBankSpecificMessage}
                placeholder="Nhập tiêu đề ví dụ: Thông báo biến động số dư"
                placeholderTextColor="#888"
                multiline
                numberOfLines={2}
                maxLength={500}
              />
              <Text style={styles.characterCount}>{bankSpecificMessage.length}/500</Text>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.label}>Nhập nội dung thông báo</Text>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Nhập nội dung thông báo..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.characterCount}>{message.length}/500</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ngân hàng phổ biến</Text>
            <View style={styles.bankGrid}>
              {banks.slice(0, 12).map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={[
                    styles.bankCard,
                    selectedBank?.id === bank.id && styles.selectedBankCard
                  ]}
                  onPress={() => handleBankSelection(bank)}
                >
                  <View style={styles.bankLogoContainer}>
                    <Image 
                      source={bank.image} 
                      style={styles.bankLogo}
                      resizeMode="contain"
                    />
                  </View>
                  {/* <Text style={[
                    styles.bankCardText,
                    selectedBank?.id === bank.id && styles.selectedBankCardText
                  ]}>
                    {bank.name}
                  </Text> */}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {selectedBank && (
            <View style={styles.selectedBankIndicator}>
              <Text style={styles.selectedBankLabel}>Ngân hàng đã chọn:</Text>
              <View style={styles.selectedBankInfo}>
                <Image 
                  source={selectedBank.image} 
                  style={styles.selectedBankIcon}
                  resizeMode="contain"
                />
                <Text style={styles.selectedBankName}>{selectedBank.name}</Text>
              </View>
            </View>
          )}

          {!notificationPermission && (
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>🔔 Cấp quyền thông báo</Text>
            </TouchableOpacity>
          )}

          <View style={styles.buttonGrid}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.sendNowButton,
                (!notificationPermission || isLoading) && styles.disabledButton
              ]} 
              onPress={sendImmediateNotification}
              disabled={!notificationPermission || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.buttonText}>⚡ Gửi ngay</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.delayButton,
                (!notificationPermission || isLoading) && styles.disabledButton
              ]} 
              onPress={() => sendDelayedNotification(5)}
              disabled={!notificationPermission || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.buttonText}>⏱️ Sau 5s</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.delayButton,
                (!notificationPermission || isLoading) && styles.disabledButton
              ]} 
              onPress={handleDelaySelection}
              disabled={!notificationPermission || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.buttonText}>⏱️ Chọn trì hoãn ({delaySeconds}s)</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.scheduleButton,
                (!notificationPermission || isLoading) && styles.disabledButton
              ]} 
              onPress={() => sendDelayedNotification(delaySeconds)}
              disabled={!notificationPermission || isLoading || timerActive}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : timerActive ? (
                <Text style={styles.buttonText}>⏳ Còn {timeRemaining}s</Text>
              ) : (
                <Text style={styles.buttonText}>🚀 Gửi sau {delaySeconds}s</Text>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.scheduleButton,
                (!notificationPermission || isLoading) && styles.disabledButton
              ]} 
              onPress={scheduleNotification}
              disabled={!notificationPermission || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.buttonText}>📅 Hẹn giờ</Text>
              )}
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  timerText: {
    color: '#ff9500',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    fontWeight: '400',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: '#0f0f0f',
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  bankCard: {
    width: '22%',
    // backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBankCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f8f0',
  },
  bankLogoContainer: {
    width: 40,
    height: 40,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankLogo: {
    width: 32,
    height: 32,
  },
  bankCardText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedBankCardText: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  viewAllCard: {
    width: '22%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#9C27B0',
    borderStyle: 'dashed',
  },
  viewAllIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#9C27B0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  viewAllIconText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 12,
    color: '#9C27B0',
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedBankIndicator: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  selectedBankLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  selectedBankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedBankIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  selectedBankName: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '700',
  },
  permissionButton: {
    backgroundColor: '#ff4757',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    width: width < 400 ? '100%' : '48%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sendNowButton: {
    backgroundColor: '#00d4aa',
  },
  delayButton: {
    backgroundColor: '#0099ff',
  },
  scheduleButton: {
    backgroundColor: '#ff6b35',
  },
  disabledButton: {
    backgroundColor: '#333',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

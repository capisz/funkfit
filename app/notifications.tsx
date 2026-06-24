import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NotificationCardProps {
  time: string;
  title: string;
  message: string;
}

function NotificationCard({ time, title, message }: NotificationCardProps) {
  return (
    <View style={styles.notifCard}>
      {/* App icon */}
      <View style={styles.notifIconContainer}>
        <Image
          source={require('../assets/images/pepper-icon.png')}
          style={styles.notifIcon}
          resizeMode="contain"
        />
      </View>

      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifAppName}>FUNKFIT</Text>
          <Text style={styles.notifTime}>{time}</Text>
        </View>
        <Text style={styles.notifTitle}>{title}</Text>
        <Text style={styles.notifMessage}>{message}</Text>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      {/* Dark gradient background - layered views */}
      <View style={styles.gradientBg}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
        <View style={styles.gradientLayer3} />
      </View>

      {/* Lock screen clock */}
      <View style={styles.clockContainer}>
        <Text style={styles.clockDate}>Tuesday, June 23</Text>
        <Text style={styles.clockTime}>8:24</Text>
      </View>

      {/* Notifications at bottom */}
      <View style={styles.notificationsContainer}>
        <NotificationCard
          time="now"
          title="Time to log lunch"
          message="You're halfway through the day — tap to log what you had and keep your streak alive."
        />
        <View style={{ height: 10 }} />
        <NotificationCard
          time="8:02 AM"
          title="Your target just adapted — +200 cal"
          message="You burned more than usual this morning. Pepper bumped your target to keep you fueled."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBg: {
    ...StyleSheet.absoluteFill,
  },
  gradientLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#0F3A40',
  },
  gradientLayer2: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#161433',
  },
  gradientLayer3: {
    position: 'absolute',
    top: '70%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#14122B',
  },
  clockContainer: {
    alignItems: 'center',
    paddingTop: 100,
    marginBottom: 'auto',
  },
  clockDate: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  clockTime: {
    fontSize: 82,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  notificationsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
  },
  notifIconContainer: {
    width: 31,
    height: 31,
    borderRadius: 8,
    backgroundColor: '#14A9AE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  notifIcon: {
    width: 31,
    height: 31,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  notifAppName: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  notifMessage: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
});

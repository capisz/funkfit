import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top section */}
        <View style={styles.topSection}>
          <Image
            source={require('../assets/images/pepper-wave.png')}
            style={styles.pepperWave}
            resizeMode="contain"
          />
          <Text style={styles.welcome}>Welcome to FunkFit</Text>
          <Text style={styles.description}>
            Track calories that adjust to your body, automatically. Pepper does the math — you just live your day.
          </Text>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          {/* Sign in with Apple */}
          <TouchableOpacity
            style={styles.appleButton}
            onPress={() => router.replace('/onboarding/goal')}
            activeOpacity={0.8}
          >
            <View style={styles.appleDot} />
            <Text style={styles.appleText}>Sign in with Apple</Text>
          </TouchableOpacity>

          {/* Continue with Google */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => router.replace('/onboarding/goal')}
            activeOpacity={0.8}
          >
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Use email instead */}
          <TouchableOpacity
            onPress={() => router.replace('/onboarding/goal')}
            activeOpacity={0.7}
          >
            <Text style={styles.emailLink}>Use email instead</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to FunkFit's Terms of Service and Privacy
            Policy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4EEE1',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pepperWave: {
    width: 166,
    height: 124,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 27,
    fontWeight: '900',
    color: '#2A2F3A',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#9A968B',
    textAlign: 'center',
    lineHeight: 21.75,
    paddingHorizontal: 12,
    maxWidth: 280,
  },
  bottomSection: {
    paddingBottom: 16,
    gap: 12,
  },
  appleButton: {
    backgroundColor: '#111111',
    borderRadius: 15,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  appleDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },
  appleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2DAC9',
  },
  googleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A2F3A',
  },
  emailLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#14A9AE',
    textAlign: 'center',
    paddingVertical: 4,
  },
  terms: {
    fontSize: 11,
    fontWeight: '500',
    color: '#BBB4A4',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
  },
});

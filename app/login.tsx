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
import { useTheme } from '../contexts/ThemeContext';
import DuoButton from '../components/DuoButton';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const start = () => router.replace('/onboarding/intro');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Top section */}
        <View style={styles.topSection}>
          <Image
            source={require('../assets/images/pepper-wave.png')}
            style={styles.pepperWave}
            resizeMode="contain"
          />
          <Text style={[styles.welcome, { color: colors.text }]}>Welcome to FunkFit</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            Track calories that adjust to your body, automatically. Pepper does the math — you just live your day.
          </Text>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          {/* Sign in with Apple */}
          <TouchableOpacity
            style={[styles.appleButton, { backgroundColor: colors.black }]}
            onPress={start}
            activeOpacity={0.85}
          >
            <View style={styles.appleDot} />
            <Text style={styles.appleText}>Sign in with Apple</Text>
          </TouchableOpacity>

          {/* Continue with Google */}
          <DuoButton title="Continue with Google" variant="secondary" onPress={start} />

          {/* Use email instead */}
          <TouchableOpacity onPress={start} activeOpacity={0.7}>
            <Text style={[styles.emailLink, { color: colors.teal }]}>Use email instead</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={[styles.terms, { color: colors.textSubtle }]}>
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
    width: 180,
    height: 134,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14.5,
    fontWeight: '700',
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
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  appleDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFFFFF',
  },
  appleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emailLink: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 4,
  },
  terms: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
  },
});

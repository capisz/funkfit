import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

export default function ProgressScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.borderLight,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backChevron, { color: colors.text }]}>{'‹'}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Progress
          </Text>
        </View>

        {/* COMPARE section */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          COMPARE
        </Text>
        <View style={styles.compareRow}>
          {/* Before image */}
          <View style={styles.compareItem}>
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: colors.border },
              ]}
            />
            <Text style={[styles.compareDate, { color: colors.textMuted }]}>
              Jun 1 · 204 lbs
            </Text>
          </View>

          {/* After image */}
          <View style={styles.compareItem}>
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: colors.border },
              ]}
            />
            <Text style={[styles.compareDate, { color: colors.textMuted }]}>
              Today · 199 lbs
            </Text>
          </View>
        </View>

        {/* Pepper love message */}
        <View style={styles.pepperRow}>
          <Image
            source={require('../assets/images/pepper-love.png')}
            style={styles.pepperImage}
            resizeMode="contain"
          />
          <View
            style={[
              styles.speechBubble,
              {
                backgroundColor: colors.tealBg,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.speechText,
                { color: colors.tealTextDark },
              ]}
            >
              Down 5 lbs since you started. The camera sees what the scale misses
              — keep going.
            </Text>
            <View
              style={[
                styles.speechTail,
                { borderRightColor: colors.tealBg },
              ]}
            />
          </View>
        </View>

        {/* TIMELINE section */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          TIMELINE
        </Text>
        <View style={styles.timelineRow}>
          <View
            style={[
              styles.timelinePlaceholder,
              { backgroundColor: colors.border },
            ]}
          />
          <View
            style={[
              styles.timelinePlaceholder,
              { backgroundColor: colors.border },
            ]}
          />
          <View
            style={[
              styles.timelinePlaceholder,
              { backgroundColor: colors.border },
            ]}
          />
        </View>

        {/* Add photo button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ Add today's photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: {
    fontSize: 22,
    marginTop: -2,
    marginLeft: -1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  compareRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  compareItem: {
    flex: 1,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: 16,
    marginBottom: 8,
  },
  compareDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  pepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  pepperImage: {
    width: 62,
    height: 48,
  },
  speechBubble: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 10,
    borderWidth: 1,
  },
  speechText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  speechTail: {
    position: 'absolute',
    left: -8,
    bottom: 12,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  timelinePlaceholder: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: '#14A9AE',
    borderRadius: 15,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(20,169,174,0.3)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

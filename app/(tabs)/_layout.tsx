import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router/tabs';
import { useTheme } from '../../contexts/ThemeContext';

function TabIcon({ focused, isCircle, colors }: { focused: boolean; isCircle: boolean; colors: any }) {
  const size = 20;

  if (focused) {
    return (
      <View
        style={[
          styles.iconBase,
          {
            width: size,
            height: size,
            backgroundColor: colors.teal,
            borderRadius: isCircle ? size / 2 : 7,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.iconBase,
        {
          width: size,
          height: size,
          backgroundColor: 'transparent',
          borderRadius: isCircle ? size / 2 : 7,
          borderWidth: 2,
          borderColor: colors.tabIconBorder,
        },
      ]}
    />
  );
}

export default function TabLayout() {
  const { mode, colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1A1F35',
          borderTopColor: colors.tabBorder,
          borderTopWidth: 1,
          paddingTop: 11,
          paddingBottom: 26,
          height: 80,
        },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarLabelStyle: {
            fontSize: 10.5,
            marginTop: 4,
          },
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} isCircle={false} colors={colors} />
          ),
          tabBarLabel: 'Today',
          tabBarActiveTintColor: colors.teal,
          tabBarItemStyle: styles.tabItem,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} isCircle={false} colors={colors} />
          ),
          tabBarLabel: 'Activity',
          tabBarItemStyle: styles.tabItem,
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          title: 'Weight',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} isCircle={false} colors={colors} />
          ),
          tabBarLabel: 'Weight',
          tabBarItemStyle: styles.tabItem,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} isCircle={true} colors={colors} />
          ),
          tabBarLabel: 'You',
          tabBarItemStyle: styles.tabItem,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconBase: {
    alignSelf: 'center',
  },
  tabItem: {
    paddingTop: 0,
  },
});

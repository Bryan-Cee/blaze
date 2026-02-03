import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { AppNavigator } from './src/navigation';
import { useUserStore } from './src/store';
import { colors } from './src/theme';

function AppContent() {
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  if (!hasHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.logo}>BLAZE</Text>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <AppContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 4,
    marginBottom: 24,
  },
});

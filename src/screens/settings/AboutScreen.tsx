import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🔥</Text>
        </View>
        <Text style={styles.appName}>BLAZE</Text>
        <Text style={styles.tagline}>8-Week Fat Loss Companion</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {/* About */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.text}>
          Blaze is a personal fitness companion designed to help you execute a
          structured 8-week fat loss plan. It combines workout tracking,
          nutrition guidance, hydration monitoring, and progress analytics in
          one offline-first app.
        </Text>
      </Card>

      {/* Features */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>💪</Text>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Structured Training</Text>
            <Text style={styles.featureText}>
              5-day weekly workout schedule with strength, cardio, and HIIT
            </Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🥗</Text>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Nutrition Tracking</Text>
            <Text style={styles.featureText}>
              Macro targets, meal plans, and prep checklists
            </Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>💧</Text>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Hydration Goals</Text>
            <Text style={styles.featureText}>
              Track daily water intake with smart reminders
            </Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📊</Text>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Progress Analytics</Text>
            <Text style={styles.featureText}>
              Weight charts, body measurements, and weekly summaries
            </Text>
          </View>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🔒</Text>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Privacy First</Text>
            <Text style={styles.featureText}>
              All data stored locally - no accounts or cloud sync required
            </Text>
          </View>
        </View>
      </Card>

      {/* Design */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Design Inspiration</Text>
        <Text style={styles.text}>
          Blaze's visual design is inspired by Strava's metric-focused interface,
          featuring a dark charcoal background with vibrant orange accents and
          bold typography optimized for quick data scanning during workouts.
        </Text>
      </Card>

      {/* Credits */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Built With</Text>
        <Text style={styles.techItem}>• React Native + Expo</Text>
        <Text style={styles.techItem}>• TypeScript</Text>
        <Text style={styles.techItem}>• Zustand (State Management)</Text>
        <Text style={styles.techItem}>• React Navigation</Text>
        <Text style={styles.techItem}>• React Native Chart Kit</Text>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with 🔥 for the 8-week journey
        </Text>
        <Text style={styles.footerSubtext}>
          © 2026 Blaze App
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    ...typography.h1,
    color: colors.primary,
    letterSpacing: 4,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  feature: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
    textAlign: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  featureText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  techItem: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});

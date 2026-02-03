import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { glossary, tips, faqs } from '../../data';
import { Card } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';

type TabType = 'glossary' | 'tips' | 'faq';

export default function KnowledgeBaseScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('glossary');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredGlossary = glossary.filter(
    (item) =>
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTips = tips.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'glossary', label: 'Glossary', count: filteredGlossary.length },
    { key: 'tips', label: 'Tips', count: filteredTips.length },
    { key: 'faq', label: 'FAQ', count: filteredFaqs.length },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training':
        return colors.primary;
      case 'nutrition':
        return colors.carbs;
      case 'recovery':
        return colors.success;
      default:
        return colors.secondary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search knowledge base..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            <View style={[
              styles.tabBadge,
              activeTab === tab.key && styles.tabBadgeActive,
            ]}>
              <Text style={styles.tabBadgeText}>{tab.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Glossary */}
        {activeTab === 'glossary' && (
          <>
            {filteredGlossary.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleExpanded(item.id)}
              >
                <Card style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.termContainer}>
                      <View
                        style={[
                          styles.categoryDot,
                          { backgroundColor: getCategoryColor(item.category) },
                        ]}
                      />
                      <Text style={styles.term}>{item.term}</Text>
                    </View>
                    <Text style={styles.expandIcon}>
                      {expandedItems.has(item.id) ? '−' : '+'}
                    </Text>
                  </View>
                  {expandedItems.has(item.id) && (
                    <Text style={styles.definition}>{item.definition}</Text>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Tips */}
        {activeTab === 'tips' && (
          <>
            {filteredTips.map((item) => (
              <Card key={item.id} style={styles.tipCard}>
                <View style={styles.tipHeader}>
                  <Text style={styles.tipCategory}>{item.category}</Text>
                </View>
                <Text style={styles.tipTitle}>{item.title}</Text>
                <Text style={styles.tipContent}>{item.content}</Text>
              </Card>
            ))}
          </>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <>
            {filteredFaqs.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleExpanded(item.id)}
              >
                <Card style={styles.faqCard}>
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Text style={styles.expandIcon}>
                      {expandedItems.has(item.id) ? '−' : '+'}
                    </Text>
                  </View>
                  {expandedItems.has(item.id) && (
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Empty state */}
        {((activeTab === 'glossary' && filteredGlossary.length === 0) ||
          (activeTab === 'tips' && filteredTips.length === 0) ||
          (activeTab === 'faq' && filteredFaqs.length === 0)) && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubtext}>
              Try a different search term
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: spacing.md,
  },
  clearButton: {
    padding: spacing.md,
  },
  clearButtonText: {
    ...typography.h3,
    color: colors.textTertiary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.buttonSmall,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  tabBadge: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabBadgeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
    paddingTop: 0,
  },
  card: {
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  termContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  term: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  expandIcon: {
    ...typography.h3,
    color: colors.primary,
  },
  definition: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  tipCard: {
    marginBottom: spacing.sm,
  },
  tipHeader: {
    marginBottom: spacing.xs,
  },
  tipCategory: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  tipTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tipContent: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  faqCard: {
    marginBottom: spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  faqQuestion: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.md,
  },
  faqAnswer: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

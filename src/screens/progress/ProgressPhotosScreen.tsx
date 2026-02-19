import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { format, parseISO } from 'date-fns';
import { useProgressStore } from '../../store';
import { Card } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ProgressPhoto } from '../../types';

const screenWidth = Dimensions.get('window').width;
const COLUMN_GAP = spacing.sm;
const PHOTO_WIDTH = (screenWidth - spacing.md * 2 - COLUMN_GAP) / 2;

export default function ProgressPhotosScreen() {
  const progressPhotos = useProgressStore((s) => s.progressPhotos);
  const addProgressPhoto = useProgressStore((s) => s.addProgressPhoto);
  const deleteProgressPhoto = useProgressStore((s) => s.deleteProgressPhoto);

  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);

  const pickImage = async (useCamera: boolean) => {
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Needed',
          'Please enable camera access in your device settings to take progress photos.'
        );
        return;
      }
    }

    const launcher = useCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await launcher({
      mediaTypes: ['images'],
      quality: 0.8,
      aspect: [3, 4],
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      addProgressPhoto(result.assets[0].uri);
    }
  };

  const handleAddPhoto = () => {
    Alert.alert('Add Progress Photo', 'Choose a source', [
      { text: 'Take Photo', onPress: () => pickImage(true) },
      { text: 'Choose from Library', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDeletePhoto = (photo: ProgressPhoto) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this progress photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (selectedPhoto?.id === photo.id) {
              setSelectedPhoto(null);
            }
            deleteProgressPhoto(photo.id);
          },
        },
      ]
    );
  };

  const renderPhoto = ({ item }: { item: ProgressPhoto }) => (
    <TouchableOpacity
      style={styles.photoItem}
      onPress={() => setSelectedPhoto(item)}
      onLongPress={() => handleDeletePhoto(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.photoThumb} />
      <View style={styles.dateOverlay}>
        <Text style={styles.dateText}>
          {format(parseISO(item.date), 'MMM d, yyyy')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPhoto}>
          <Text style={styles.addButtonText}>+ Add Photo</Text>
        </TouchableOpacity>
      </View>

      {progressPhotos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>No Progress Photos Yet</Text>
            <Text style={styles.emptySubtitle}>
              Take your first progress photo to start tracking your transformation.
            </Text>
          </Card>
        </View>
      ) : (
        <FlatList
          data={progressPhotos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalDate}>
              {selectedPhoto &&
                format(parseISO(selectedPhoto.date), 'MMMM d, yyyy')}
            </Text>
            <TouchableOpacity onPress={() => setSelectedPhoto(null)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
          {selectedPhoto && (
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePhoto(selectedPhoto)}
              >
                <Text style={styles.deleteButtonText}>Delete Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.buttonSmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  grid: {
    padding: spacing.md,
  },
  row: {
    gap: COLUMN_GAP,
    marginBottom: COLUMN_GAP,
  },
  photoItem: {
    width: PHOTO_WIDTH,
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  dateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  dateText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalDate: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  modalClose: {
    ...typography.buttonSmall,
    color: colors.primary,
  },
  fullImage: {
    flex: 1,
  },
  modalFooter: {
    padding: spacing.md,
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  deleteButtonText: {
    ...typography.buttonSmall,
    color: colors.error,
  },
});

import React from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {
  removeAllStrains,
  removeAllPlants,
  refreshPlantAges,
} from '../../../database/storage/asyncStorage';

const SettingsScreen = () => {
  const handleClickRemoveAllStrains = () => {
    Alert.alert(
      'Wipe All Strains',
      `Are you sure you want to clear all strains?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: handleRemoveAllStrains,
        },
      ],
      {cancelable: false},
    );
  };
  const handleRemoveAllStrains = async () => {
    try {
      await removeAllStrains();
      Alert.alert('Success', 'All strains removed successfully');
    } catch (error) {
      console.error('Error removing all strains:', error);
      Alert.alert('Error', 'Failed to remove all strains');
    }
  };
  const handleClickRemoveAllPlants = () => {
    Alert.alert(
      'Wipe All Plants',
      `Are you sure you want to clear all plant records?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: handleRemoveAllPlants,
        },
      ],
      {cancelable: false},
    );
  };
  const handleRemoveAllPlants = async () => {
    try {
      await removeAllPlants();
      Alert.alert('Success', 'All plants removed successfully');
    } catch (error) {
      console.error('Error removing all plants:', error);
      Alert.alert('Error', 'Failed to remove all plants');
    }
  };

  const handleRefreshAllPlants = async () => {
    try {
      await refreshPlantAges();
      Alert.alert('Success', 'All plants have been updated');
    } catch (error) {
      console.error('Error updating age:', error);
      Alert.alert('Error', 'Failed to update age of plants');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Remove All Strains"
          onPress={handleClickRemoveAllStrains}
          color="#e74c3c" // Red color for danger
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Remove All Plants"
          onPress={handleClickRemoveAllPlants}
          color="#e74c3c" // Red color for danger
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Refresh Age of Plants"
          onPress={handleRefreshAllPlants}
          color="#3498db" // Blue color for primary action
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
});

export default SettingsScreen;

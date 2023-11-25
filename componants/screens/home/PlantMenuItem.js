import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {
  removePlant,
  updateCuttingsTakenOn,
} from '../../../database/storage/asyncStorage';
import {useFocusEffect} from '@react-navigation/native';
const PlantMenuItem = ({plant, plantIsDeleted}) => {
  // Extract relevant properties
  const formatDate = dateString => {
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options,
    );
    return formattedDate;
  };
  const {id, strain, age, size, status, createdOn, cuttingsTakenOn} = plant;
  const formattedCuttingsTakenOn = formatDate(cuttingsTakenOn);

  const handleClickDeletePlant = () => {
    Alert.alert('Confirm Delete', `Are you sure you want to delete plant?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => handleDeletePlant(),
      },
    ]);
  };
  const handleClickTakeCuttings = () => {
    Alert.alert('Confirm Update', `Are you sure you have taken cuttings?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Update',
        onPress: () => handleTakeCuttings(),
      },
    ]);
  };
  const handleTakeCuttings = () => {
    updateCuttingsTakenOn(plant.id)
      .then(() => {
        Alert.alert('Success', 'Plant(s) updated successfully!');
      })
      .catch(() => {
        Alert.alert('Error', error);
      });
  };
  const handleDeletePlant = () => {
    removePlant(plant.id)
      .then(() => {
        Alert.alert('Success', 'Plant(s) updated successfully!');
        plantIsDeleted();
      })
      .catch(() => {
        Alert.alert('Error', error);
      });
  };
  return (
    <View style={styles.container}>
      {plant.size === 'mother' ? (
        <View key={`${id}${strain}`} style={styles.plantObject}>
          <Text>Age: {age} days</Text>
          <Text>Status: {status}</Text>
          <TouchableOpacity
            style={styles.cuttingsButton}
            onPress={() => handleClickTakeCuttings()}>
            <Text>Take Cuts</Text>
          </TouchableOpacity>
          <Text>{formattedCuttingsTakenOn}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleClickDeletePlant()}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      ) : plant.size === 'xs' ? (
        <View key={`${id}${strain}`} style={styles.plantObject}>
          <Text>Age: {age} days</Text>
          <Text>Status: {status}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleClickDeletePlant()}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View key={`${id}${strain}`} style={styles.plantObject}>
          <Text>Age: {age} days</Text>
          <Text>Status: {status}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleClickDeletePlant()}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginRight: 20,
    marginBottom: 10,
  },
  plantObject: {
    flexDirection: 'column',
    marginVertical: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  cuttingsButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    backgroundColor: 'green',
    padding: 2,
  },
  deleteButton: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    backgroundColor: 'red',
    padding: 2,
  },
});
export default PlantMenuItem;

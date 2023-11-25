import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';

const ListItem = item => {
  const onEdit = item => {
    setSelectedStrain(item);
    setName(item.strain || ''); // Initialize with the existing name or an empty string
    setFlowerTime(item.flowerTime || ''); // Initialize with the existing flowerTime or an empty string
    setType(item.type || ''); // Initialize with the existing type or an empty string
    setNewStrainInfo({
      name: item.name || '',
      flowerTime: item.flowerTime || '',
      type: item.type || '',
    });
    setEditModalVisible(true);
  };
  const handleDelete = async item => {
    try {
      await removeStrain(item.id);
      loadStrains(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting strain:', error);
    }
  };
  const onDelete = item => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${item.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(item),
        },
      ],
    );
  };
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.strainName}>{item.name}</Text>
      <TouchableOpacity onPress={() => onEdit(item)}>
        <Image
          source={require('../../../assets/edit.png')} // Update with your edit icon
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item)}>
        <Image
          source={require('../../../assets/delete.png')} // Update with your delete icon
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  strainName: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});

export default ListItem;

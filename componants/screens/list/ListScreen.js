import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  editStrain,
  getAllStrains,
  removeStrain,
} from '../../../database/storage/asyncStorage';

const ListScreen = () => {
  const [strains, setStrains] = useState([]);
  const [selectedStrain, setSelectedStrain] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [flowerTime, setFlowerTime] = useState('');
  const [type, setType] = useState('');
  const [newStrainInfo, setNewStrainInfo] = useState({
    name: '',
    flowerTime: '',
    type: '',
  });
  useEffect(() => {
    loadStrains();
  }, []);

  // Use useFocusEffect to reload strains when the tab is focused
  useFocusEffect(
    React.useCallback(() => {
      loadStrains();
    }, []),
  );

  const loadStrains = async () => {
    try {
      const existingStrains = await getAllStrains();
      setStrains(existingStrains);
    } catch (error) {
      console.error('Error loading strains:', error);
    }
  };

  const onEdit = item => {
    setSelectedStrain(item);
    setName(item.name || ''); // Initialize with the existing name or an empty string
    setFlowerTime(item.flowerTime || ''); // Initialize with the existing flowerTime or an empty string
    setType(item.type || ''); // Initialize with the existing type or an empty string
    setNewStrainInfo({
      name: item.name || '',
      flowerTime: item.flowerTime || '',
      type: item.type || '',
    });
    setEditModalVisible(true);
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

  const handleDelete = async item => {
    try {
      await removeStrain(item.id);
      loadStrains(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting strain:', error);
    }
  };

  const handleEdit = () => {
    editStrain(selectedStrain.id, newStrainInfo);
    setEditModalVisible(false);
    // Refresh the list after editing
    loadStrains();
  };

  const closeModal = () => {
    setSelectedStrain(null);
    setEditModalVisible(false);
  };

  const renderItem = ({item}) => (
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

  return (
    <View style={styles.container}>
      <FlatList
        data={strains}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isEditModalVisible}
        onRequestClose={closeModal}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalText}>
            Edit Strain: {selectedStrain?.name}
          </Text>

          <TextInput
            style={modalStyles.modalInput}
            placeholder="Edit Name"
            value={name}
            onChangeText={text => {
              console.log('Name updated:', text);
              setName(text);
            }}
          />
          <TextInput
            style={modalStyles.modalInput}
            placeholder="Flowering Time"
            value={flowerTime}
            onChangeText={text => {
              console.log('Flowering Time updated:', text);
              setFlowerTime(text);
            }}
            keyboardType="numeric"
          />
          <TextInput
            style={modalStyles.modalInput}
            placeholder="Type (Indica/Sativa/Hybrid)"
            value={type}
            onChangeText={text => {
              console.log('Type updated:', text);
              setType(text);
            }}
          />
          <Pressable
            style={[modalStyles.button, modalStyles.buttonClose]}
            onPress={handleEdit}>
            <Text style={modalStyles.textStyle}>Save</Text>
          </Pressable>
          <Pressable
            style={[modalStyles.button, modalStyles.buttonClose]}
            onPress={closeModal}>
            <Text style={modalStyles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
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
    width: 40,
    height: 40,
    marginLeft: 10,
  },
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    height: 40,
    minWidth: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 15,
    width: 100,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ListScreen;

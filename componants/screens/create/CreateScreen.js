import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {CreateButton} from './CreateButton';
import {
  addPlant,
  getAllStrains,
  addStrain,
} from '../../../database/storage/asyncStorage';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
const CreateScreen = () => {
  const [strain, setStrain] = useState('');
  const [age, setAge] = useState('');
  const [quantity, setQuantity] = useState('');
  const [size, setSize] = useState('');
  const [status, setStatus] = useState('');
  const [strains, setStrains] = useState([]);
  const [selectedStrain, setSelectedStrain] = useState('');
  const [isAddStrainModalVisible, setAddStrainModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [flowerTime, setFlowerTime] = useState('');
  const [type, setType] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      loadStrains();
    }, []),
  );
  useEffect(() => {
    // Load existing strains when the component mounts
    loadStrains();
  }, []);

  const loadStrains = async () => {
    try {
      const existingStrains = await getAllStrains();
      setStrains(existingStrains);
    } catch (error) {
      console.error('Error loading strains:', error);
    }
  };

  const handleCreate = async () => {
    // Validate that both strain and age are provided before saving
    if (selectedStrain.trim() === '' || age.trim() === '') {
      Alert.alert('Please provide both strain and age.');
      return;
    }

    try {
      const parsedQuantity = parseInt(quantity, 10);

      // Validate that quantity is a positive integer
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        Alert.alert('Please provide a valid positive quantity.');
        return;
      }

      // Create multiple plants with the same attributes
      for (let i = 0; i < parsedQuantity; i++) {
        const newPlant = {
          strain: selectedStrain,
          age: age,
          size: size,
          status: status,
        };
        await addPlant(newPlant);
      }

      Alert.alert('Success', 'Plant(s) created successfully!', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      // Reset input fields
      setSelectedStrain('');
      setAge('');
      setQuantity('');
      setSize('');
      setStatus('');
    } catch (error) {
      Alert.alert('Error', error, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      console.error('Error saving plant data:', error);
    }
  };

  const handleAddStrain = async () => {
    if (name.trim() === '') {
      Alert.alert('Please provide a strain name.');
      return;
    }

    try {
      // Check if the strain already exists
      const existingStrains = await getAllStrains();
      const isDuplicate = existingStrains.some(
        existingStrain =>
          existingStrain.name.toLowerCase() === name.toLowerCase(),
      );

      if (isDuplicate) {
        Alert.alert('Error', 'Strain with the same name already exists.', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }

      // Add the new strain to the storage
      const newStrain = {
        name: name,
        flowerTime: flowerTime,
        type: type,
      };

      await addStrain(newStrain).then(response => {
        Alert.alert('Success', 'Strain added successfully!', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      });

      // Reload strains after adding a new one
      loadStrains();

      setName('');
      setFlowerTime('');
      setType('');
      // Reset the strain input field
      setStrain('');
      // Close the modal after adding the strain
      setAddStrainModalVisible(false);
    } catch (error) {
      console.error('Error adding strain:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Picker
          selectedValue={selectedStrain}
          onValueChange={itemValue => setSelectedStrain(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Select Strain" value="" />
          {strains.map(strain => (
            <Picker.Item
              key={strain.id}
              label={strain.name}
              value={strain.name}
            />
          ))}
        </Picker>

        <Pressable
          style={styles.addStrainButton}
          onPress={() => setAddStrainModalVisible(true)}>
          <Image
            source={require('../../../assets/add.png')}
            style={styles.imageButton}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={text => setAge(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={text => setQuantity(text)}
        keyboardType="numeric"
      />

      <Picker
        selectedValue={size}
        onValueChange={itemValue => setSize(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Select Size" value="" />
        <Picker.Item label="XS" value="xs" />
        <Picker.Item label="S" value="s" />
        <Picker.Item label="M" value="m" />
        <Picker.Item label="L" value="l" />
        <Picker.Item label="Mother" value="mother" />
      </Picker>

      <Picker
        selectedValue={status}
        onValueChange={itemValue => setStatus(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Select Status" value="" />
        <Picker.Item label="Veg" value="veg" />
        <Picker.Item label="Flower" value="flower" />
        <Picker.Item label="Seedling" value="seedling" />
        <Picker.Item label="Reveg" value="reveg" />
        <Picker.Item label="Cure" value="cure" />
      </Picker>

      <CreateButton title={'Done'} onPress={handleCreate} />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isAddStrainModalVisible}
        onRequestClose={() => setAddStrainModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Add Strain</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Flower Time"
            value={flowerTime}
            onChangeText={text => setFlowerTime(text)}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Type (Indica/Sativa)"
            value={type}
            onChangeText={text => setType(text)}
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setAddStrainModalVisible(false)}>
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonAdd]}
            onPress={handleAddStrain}>
            <Text style={styles.textStyle}>Add</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  addStrainButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  imageButton: {
    width: 24,
    height: 24,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
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
  button: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 15,
    width: 100,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonAdd: {
    backgroundColor: '#4CAF50',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CreateScreen;

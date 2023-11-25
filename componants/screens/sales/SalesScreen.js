import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  View,
  Text,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  useColorScheme,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useFocusEffect} from '@react-navigation/native';
import {
  getAllPlants,
  getPlantsByAttributes,
  removePlant,
} from '../../../database/storage/asyncStorage';
const SalesScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [plants, setPlants] = useState([]);
  const [plantsReady, setPlantsReady] = useState(false);
  const [uniquePlants, setUniquePlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [order, setOrder] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const loadPlants = async () => {
    try {
      const plantData = await getAllPlants();
      setPlants(plantData);
      const uniquePlantSet = new Set();
      const uniquePlantsArray = [];
      plantData.forEach(plant => {
        const key = `${plant.strain}-${plant.age}-${plant.size}`;
        if (!uniquePlantSet.has(key)) {
          uniquePlantSet.add(key);
          uniquePlantsArray.push(plant);
        }
      });
      setUniquePlants(uniquePlantsArray);
      console.log(uniquePlantsArray);
      setPlantsReady(true);
    } catch (error) {
      console.log('Error loading plants:', error);
      setPlantsReady(true);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      loadPlants();
    }, []),
  );

  useEffect(() => {
    loadPlants();
  }, []);

  const handleAddToOrder = async () => {
    if (selectedPlant && quantity > 0) {
      try {
        const plantsToOrder = await getPlantsByAttributes(
          selectedPlant.strain,
          selectedPlant.size,
          selectedPlant.age,
        );

        // Check if there are enough available plants
        if (plantsToOrder.length >= quantity) {
          const updatedOrder = Array.from({length: quantity}, () => ({
            id: selectedPlant.id,
            strain: selectedPlant.strain,
            size: selectedPlant.size,
            age: selectedPlant.age,
            type: selectedPlant.type,
            quantity: 1,
          }));

          setOrder([...order, ...updatedOrder]);

          setSelectedPlant(null);
          setQuantity('1');
        } else {
          console.log('Not enough available plants for the selected quantity.');
        }
      } catch (error) {
        console.log('Error getting plants by attributes:', error);
      }
    }
  };

  const handleClickConfirmOrder = async () => {
    setModalVisible(true);
  };
  const handleConfirmOrder = async () => {
    try {
      // Iterate over each plant in the order and remove it
      for (const orderedPlant of order) {
        await removePlant(orderedPlant.id);
      }
      setOrder([]);
      setModalVisible(false);
    } catch (error) {
      console.error('Error removing plants from the order:', error);
    }
  };

  const handleModalClose = () => {
    setOrder([]);

    setModalVisible(false);
  };
  if (!plantsReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Text>Loading</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Top half - Selecting Plants */}
      <View style={styles.halfContainer}>
        <Text style={styles.heading}>Select Plant:</Text>
        <Picker
          selectedValue={selectedPlant}
          onValueChange={itemValue => setSelectedPlant(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Select a plant" value={null} />
          {uniquePlants.map(plant => (
            <Picker.Item
              key={plant.id}
              label={`${plant.strain}-${plant.size}-${plant.age} days`}
              value={plant}
            />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={text => setQuantity(text)}
          keyboardType="numeric"
        />
        <Button title="Add to Order" onPress={handleAddToOrder} />
      </View>

      {/* Bottom half - Current Order */}
      <View style={styles.halfContainer}>
        <Text style={styles.heading}>Selected Plants:</Text>
        <FlatList
          data={order}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <Text style={styles.orderItem} key={`item.id`}>
              {item.strain} - Quantity: {item.quantity}
            </Text>
          )}
        />

        <Button title="Confirm Order" onPress={handleClickConfirmOrder} />
      </View>

      {/* Order Confirmation Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Order Confirmation</Text>
            <FlatList
              data={order}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <Text style={styles.modalOrderItem} key={item.id}>
                  {item.strain} - {item.size} -Qty: {item.quantity}
                </Text>
              )}
            />
            <Button title="Complete" onPress={handleConfirmOrder} />
            <Button title="Close" onPress={handleModalClose} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  halfContainer: {
    flex: 1,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    marginBottom: 16,
  },
  orderItem: {
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOrderItem: {
    marginBottom: 8,
  },
});

export default SalesScreen;

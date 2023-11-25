import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  getAllPlants,
  updateCuttingsTakenOn,
} from '../../../database/storage/asyncStorage';
import PlantMenuItem from './PlantMenuItem';
import {useFocusEffect} from '@react-navigation/native';
import {Button} from '@rneui/base';
import StrainItem from './StrainItem';

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [plants, setPlants] = useState([]);
  const [plantsReady, setPlantsReady] = useState(false);
  const [visibleStrain, setVisibleStrain] = useState(null);
  const [visibleSize, setVisibleSize] = useState(null);
  const plantIsDeleted = async () => {
    await loadPlants();
  };
  const groupPlantsByStrain = () => {
    const groupedPlantsByStrain = {};
    plants.forEach(plant => {
      if (!groupedPlantsByStrain[plant.strain]) {
        groupedPlantsByStrain[plant.strain] = {
          total: 0,
          plants: [],
        };
      }
      groupedPlantsByStrain[plant.strain].total += 1;
      groupedPlantsByStrain[plant.strain].plants.push(plant);
    });

    return groupedPlantsByStrain;
  };

  const handleStrainClick = strain => {
    setVisibleStrain(visibleStrain === strain ? null : strain);
  };
  const handleSizeClick = size => {
    setVisibleSize(visibleSize === size ? null : size);
  };

  const loadPlants = async () => {
    try {
      const plantData = await getAllPlants();
      setPlants(plantData);
      setVisibleStrain(null);
      setPlantsReady(true);
    } catch (error) {
      console.log('Error loading plants:', error);
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

  if (!plantsReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {plants.length > 0 ? (
        <>
          {Object.entries(groupPlantsByStrain()).map(
            ([strain, strainData], index) => (
              <StrainItem
                key={`${index}-${strain}`}
                strain={strain}
                strainData={strainData}
                visibleStrain={visibleStrain}
                handleStrainClick={handleStrainClick}
                handleSizeClick={handleSizeClick}
                visibleSize={visibleSize}
                plantIsDeleted={plantIsDeleted}></StrainItem>
            ),
          )}
        </>
      ) : (
        <Text>No plants available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 5,
    marginRight: 20,
    marginBottom: 10,
  },
  container: {
    padding: 10,
    marginRight: 20,
    marginBottom: 10,
  },
  strainContainer: {
    flexDirection: 'column',
    marginVertical: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  strainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strainName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  sizeContainer: {
    flexDirection: 'column',
    marginVertical: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20, // Added margin to move the sizes outside the borders
  },
  sizeItem: {
    alignItems: 'center',
  },
  plantContainer: {
    flexDirection: 'column',
    marginLeft: 40,
    marginTop: 5,
  },
  plantDataContainer: {
    flexDirection: 'column',
    marginTop: 5,
  },
  above8Text: {
    color: 'green',
    fontSize: 12,
  },
  below8Text: {
    color: 'red',
    fontSize: 12,
  },
  totalText: {
    fontSize: 18,
  },
});

export default HomeScreen;

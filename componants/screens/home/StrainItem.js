import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SizeItem from './SizeItem';
const StrainItem = ({
  strain,
  strainData,
  visibleStrain,
  handleStrainClick,
  handleSizeClick,
  visibleSize,
  plantIsDeleted,
}) => {
  const isStrainVisible = visibleStrain === strain;
  const groupPlantsBySize = sortedPlants => {
    const groupedPlantsBySize = {};

    sortedPlants.plants.forEach(plant => {
      if (!groupedPlantsBySize[plant.size]) {
        if (plant.size === 'xs') {
          groupedPlantsBySize[plant.size] = {
            total: 0,
            above8: 0,
            below8: 0,
            plants: [],
          };
        } else {
          groupedPlantsBySize[plant.size] = {
            total: 0,
            plants: [],
          };
        }
      }

      // Increment the total count for all sizes
      groupedPlantsBySize[plant.size].total += 1;

      // If the size is 'xs', categorize by age
      if (plant.size === 'xs') {
        if (plant.age >= 8) {
          groupedPlantsBySize[plant.size].above8 += 1;
        } else {
          groupedPlantsBySize[plant.size].below8 += 1;
        }
      }

      groupedPlantsBySize[plant.size].plants.push(plant);
    });

    return groupedPlantsBySize;
  };
  return (
    <View style={styles.container}>
      <View
        key={`${strain}-${strainData.plants.length}-${strainData.age}`}
        style={styles.strainContainer}>
        <TouchableOpacity onPress={() => handleStrainClick(strain)}>
          <View style={styles.strainRow}>
            <Text style={styles.strainName}>{strain}</Text>
            <Text style={styles.totalText}>{strainData.total}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {isStrainVisible && (
        <View style={styles.sizeContainer}>
          {Object.entries(groupPlantsBySize(strainData)).map(
            ([size, sizeData], index) => (
              <SizeItem
                key={`${index}-${size}`}
                strain={strain}
                size={size}
                sizeData={sizeData}
                handleSizeClick={handleSizeClick}
                visibleSize={visibleSize}
                plantIsDeleted={plantIsDeleted}></SizeItem>
            ),
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  strainContainer: {
    flexDirection: 'column',
    marginTop: 10,
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
    marginVertical: 2,
    padding: 10,
  },
});

export default StrainItem;

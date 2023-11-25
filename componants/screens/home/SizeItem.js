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
import PlantMenuItem from './PlantMenuItem';

const SizeItem = ({
  strain,
  size,
  sizeData,
  visibleSize,
  handleSizeClick,
  plantIsDeleted,
}) => {
  const isSizeVisible = visibleSize === size;
  return (
    <View style={styles.container}>
      <View key={`${strain}-${size}`} style={styles.sizeObject}>
        <TouchableOpacity onPress={() => handleSizeClick(size)}>
          {size === 'xs' ? (
            <View style={styles.sizeRow}>
              <Text style={styles.strainName}>{size}</Text>
              <Text style={styles.below8Text}>{sizeData.below8}</Text>

              <Text style={styles.above8Text}>{sizeData.above8}</Text>
              <Text style={styles.totalText}>{sizeData.total}</Text>
            </View>
          ) : size === 'mother' ? (
            <View style={styles.sizeRow}>
              <Text style={styles.strainName}>{size}</Text>
              <Text style={styles.totalText}>{sizeData.total}</Text>
            </View>
          ) : (
            <View style={styles.sizeRow}>
              <Text style={styles.strainName}>{size}</Text>
              <Text style={styles.totalText}>{sizeData.total}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {isSizeVisible && (
        <View style={styles.plantContainer}>
          {sizeData.plants.map((plant, plantIndex) => (
            <View>
              <PlantMenuItem
                key={`${plantIndex}-${strain}`}
                plant={plant}
                plantIsDeleted={plantIsDeleted}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  sizeObject: {
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

export default SizeItem;

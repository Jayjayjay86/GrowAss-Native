import AsyncStorage from '@react-native-async-storage/async-storage';

import uuid from 'react-native-uuid';

const STORAGE_KEY_PLANTS = 'plants';
const STORAGE_KEY_STRAINS = 'strains';

export const addStrain = async strain => {
  try {
    const existingStrains =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_STRAINS)) || [];

    const newStrain = {
      id: uuid.v4(),
      name: strain.name,
      flowerTime: strain.flowerTime,
      type: strain.type,
    };
    existingStrains.push(newStrain);

    await AsyncStorage.setItem(
      STORAGE_KEY_STRAINS,
      JSON.stringify(existingStrains),
    );

    return Promise.resolve('Strain added successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removeStrain = async strainId => {
  try {
    const existingStrains =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_STRAINS)) || [];

    const updatedStrains = existingStrains.filter(
      strain => strain.id !== strainId,
    );

    await AsyncStorage.setItem(
      STORAGE_KEY_STRAINS,
      JSON.stringify(updatedStrains),
    );

    return Promise.resolve('Strain removed successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};

export const addPlant = async plant => {
  try {
    const cuttingsTakenOn = undefined;
    if (plant.cuttingsTakenOn) {
      cuttingsTakenOn = plant.cuttingsTakenOn;
    }

    const ageInDays = plant.age || 0; // Default to 0 if age is not provided
    const today = new Date();

    // Calculate the date by subtracting the age in days
    const createdOn = new Date(today);
    createdOn.setDate(today.getDate() - ageInDays);

    const newPlant = {
      id: uuid.v4(),
      strain: plant.strain,
      age: plant.age,
      size: plant.size,
      status: plant.status,
      cuttingsTakenOn: cuttingsTakenOn,
      createdOn: createdOn,
    };

    console.log('addnewPlant', newPlant);

    const existingPlants =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_PLANTS)) || [];

    existingPlants.push(newPlant);

    await AsyncStorage.setItem(
      STORAGE_KEY_PLANTS,
      JSON.stringify(existingPlants),
    );

    return Promise.resolve('Plant added successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removePlant = async plantId => {
  try {
    const existingPlants =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_PLANTS)) || [];

    const updatedPlants = existingPlants.filter(plant => plant.id !== plantId);

    await AsyncStorage.setItem(
      STORAGE_KEY_PLANTS,
      JSON.stringify(updatedPlants),
    );

    return Promise.resolve('Plant removed successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllPlants = async () => {
  try {
    const plants = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_PLANTS));
    return Promise.resolve(plants || []);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllStrains = async () => {
  try {
    const strains = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_STRAINS));
    return Promise.resolve(strains || []);
  } catch (error) {
    return Promise.reject(error);
  }
};
export const removeAllStrains = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_STRAINS);
    return Promise.resolve('All strains removed successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};
export const removeAllPlants = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_PLANTS);
    return Promise.resolve('All plants removed successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};

// Function to calculate the age of a plant based on the createdOn date
const calculatePlantAge = createdOn => {
  const currentDate = new Date();
  const createdDate = new Date(createdOn);
  const timeDifference = currentDate.getTime() - createdDate.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
  return Math.floor(daysDifference);
};

// Function to refresh the ages of all plants in storage
export const refreshPlantAges = async () => {
  try {
    const existingPlants =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_PLANTS)) || [];

    const updatedPlants = existingPlants.map(plant => {
      const age = calculatePlantAge(plant.createdOn);
      return {...plant, age};
    });

    await AsyncStorage.setItem(
      STORAGE_KEY_PLANTS,
      JSON.stringify(updatedPlants),
    );

    return Promise.resolve('Plant ages refreshed successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};
export const updateCuttingsTakenOn = async plantId => {
  try {
    const existingPlants =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_PLANTS)) || [];

    const updatedPlants = existingPlants.map(plant => {
      if (plant.id === plantId) {
        // Update cuttingsTakenOn to the current date
        return {...plant, cuttingsTakenOn: new Date()};
      }
      return plant;
    });

    await AsyncStorage.setItem(
      STORAGE_KEY_PLANTS,
      JSON.stringify(updatedPlants),
    );

    return Promise.resolve('Cuttings taken date updated successfully');
  } catch (error) {
    return Promise.reject(error);
  }
};
export const getPlantsByAttributes = async (strain, size, age) => {
  try {
    const allPlants =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_PLANTS)) || [];

    // Filter plants based on provided attributes
    const filteredPlants = allPlants.filter(plant => {
      return (
        (!strain || plant.strain === strain) &&
        (!size || plant.size === size) &&
        (!age || plant.age === age)
      );
    });

    return Promise.resolve(filteredPlants);
  } catch (error) {
    return Promise.reject(error);
  }
};
export const editPlant = async (plantId, updatedPlantInfo) => {
  try {
    const existingPlants =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_PLANTS)) || [];

    // Find the index of the plant with the given plantId
    const plantIndex = existingPlants.findIndex(plant => plant.id === plantId);

    // If the plant is found, update its information
    if (plantIndex !== -1) {
      existingPlants[plantIndex] = {
        ...existingPlants[plantIndex],
        ...updatedPlantInfo,
      };

      // Save the updated plants array back to AsyncStorage
      await AsyncStorage.setItem(
        STORAGE_KEY_PLANTS,
        JSON.stringify(existingPlants),
      );

      return Promise.resolve('Plant updated successfully');
    } else {
      return Promise.reject('Plant not found');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
export const editStrain = async (strainId, updatedStrainInfo) => {
  try {
    const existingStrains =
      JSON.parse(await AsyncStorage.getItem(STORAGE_KEY_STRAINS)) || [];

    // Find the index of the plant with the given plantId
    const strainIndex = existingStrains.findIndex(
      strain => strain.id === strainId,
    );

    if (strainIndex !== -1) {
      existingStrains[strainIndex] = {
        ...existingStrains[strainIndex],
        ...updatedStrainInfo,
      };

      await AsyncStorage.setItem(
        STORAGE_KEY_STRAINS,
        JSON.stringify(existingStrains),
      );

      return Promise.resolve('Strain updated successfully');
    } else {
      return Promise.reject('Strain not found');
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

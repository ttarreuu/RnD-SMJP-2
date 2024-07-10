import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

const App = () => {
  const [menuData, setMenuData] = useState([]);
  const [filteredMenuData, setFilteredMenuData] = useState([]);

  useEffect(() => {
    fetch('https://6639cbd81ae792804beccbdc.mockapi.io/location/v1/menu')
      .then((response) => response.json())
      .then((menu) => {
        fetch('https://6639cbd81ae792804beccbdc.mockapi.io/location/v1/package')
          .then((response) => response.json())
          .then((packages) => {
            const selectedPackage = packages.find(pkg => pkg.packageID === "1");
            if (selectedPackage) {
              const filteredMenu = menu.filter(menuItem =>
                selectedPackage.menuSelection.includes(menuItem.menuID)
              );
              setFilteredMenuData(filteredMenu);
            }
            setMenuData(menu);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image
        style={styles.image}
        source={{ uri: `data:image/png;base64,${item.pic}` }}
      />
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMenuData}
        renderItem={renderItem}
        keyExtractor={(item) => item.menuID.toString()}
        numColumns={2} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  menuItem: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Background color for the rectangle
    padding: 15, // Padding inside the rectangle
    borderRadius: 10, // Rounded corners
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;

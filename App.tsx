import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button } from 'react-native';
import uuid from 'react-native-uuid';

const App = () => {
  const [menuData, setMenuData] = useState([]);
  const [filteredMenuData, setFilteredMenuData] = useState([]);
  const [generatedUUID, setGeneratedUUID] = useState('');

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

  const generateUUID = () => {
    const newUUID = uuid.v4();
    setGeneratedUUID(newUUID);
  };

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
      <View style={styles.header}>
        <Button title="Generate UUID" onPress={generateUUID} />
        {generatedUUID ? <Text style={styles.uuidText}>{generatedUUID}</Text> : null}
      </View>
      <FlatList
        data={filteredMenuData}
        renderItem={renderItem}
        keyExtractor={(item) => item.menuID}
        numColumns={1}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  uuidText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1, // This ensures the text takes available space
  },
  list: {
    justifyContent: 'center',
  },
  menuItem: {
    flex: 1,
    flexDirection: 'column',
    margin: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 150,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;

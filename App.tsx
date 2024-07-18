import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Button } from 'react-native';
import uuid from 'react-native-uuid';
import { 
  initDatabase, 
  insertLocalDB, 
  getLocalDB 
} from './database';

const App = () => {
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [generatedUUID, setGeneratedUUID] = useState('');

  useEffect(() => {
    initDatabase();
    handleMenu();
  }, []);

  const handleMenu = async () => {
    // inisialisasi id
    const id = "1";

    // inisialisasi listSelectedMenu
    let listSelectedMenu = [];

    // get menuSelection
    try {
      const response = await fetch(`https://6639cbd81ae792804beccbdc.mockapi.io/location/v1/package/${id}`, {
        method: 'GET',
      });
      const data = await response.json();
      listSelectedMenu = data.menuSelection;
    } catch (err) {
      console.log(err);
      return; 
    }

    try {
      const response = await fetch('https://6639cbd81ae792804beccbdc.mockapi.io/location/v1/menu', {
        method: 'GET',
      });
      const allMenus = await response.json();

      const listMenu = allMenus.filter(menu => listSelectedMenu.includes(menu.menuID));

      try {
        for (const menu of listMenu) {
          await insertLocalDB(menu);
        }

        const localData = await getLocalDB();
        setSelectedMenu(localData);
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
      return; 
    }
  };

  const generateUUID = () => {
    const newUUID = uuid.v4();
    setGeneratedUUID(newUUID);
  };

  const renderItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image style={styles.image} source={{ uri: `data:image/png;base64,${item.pic}` }} />
      <Text style={styles.name}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Generate UUID" onPress={generateUUID} />
        {generatedUUID ? 
        <Text style={styles.uuidText}>{generatedUUID}</Text> : null}
      
      <FlatList
        data={selectedMenu}
        renderItem={renderItem}
        keyExtractor={(item) => item.menuID.toString()}
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
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  uuidText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
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

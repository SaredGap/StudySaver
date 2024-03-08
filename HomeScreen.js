import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, IconButton, Card, Title, Button as PaperButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const data = [
    { key: 'Flashcards', title: 'Card Estudio' },
    { key: 'Gastos', title: 'Gastos Diarios' },
    { key: 'Gatos', title: 'Gatos del dia' },
  ];

  const renderItem = ({ item }) => (
    <PaperButton
      mode="contained"
      onPress={() => navigation.navigate(item.key)}
      style={styles.button}
    >
      {item.title}
    </PaperButton>
  );

  const handleLogout = async () => {

    await AsyncStorage.removeItem('usuario');

    navigation.popToTop();
    navigation.navigate('Inicio');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="FelineStudyHub!" titleStyle={styles.title} />
        <IconButton icon="exit-to-app" color="#fff" onPress={handleLogout} />
      </Appbar.Header>

      <View style={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>¡Bienvenido a la aplicación de FelineStudyHub!</Title>
          </Card.Content>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.buttonContainer}
          />
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  appbar: {
    backgroundColor: '#2e3a4f',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -15,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
    paddingBottom: 16,
  },
  button: {
    borderRadius: 10,
    marginVertical: 8,
  },
});

export default HomeScreen;

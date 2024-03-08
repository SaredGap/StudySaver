import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button as PaperButton, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class GastosApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gastos: [],
      nuevoGasto: '',
      descripcionGasto: '',
      totalGastos: 0,
    };
  }

  async componentDidMount() {
    try {
      const gastos = await AsyncStorage.getItem('gastos');
      if (gastos) {
        this.setState({ gastos: JSON.parse(gastos) });
        this.calcularTotalGastos(JSON.parse(gastos));
      }
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    }
  }

  calcularTotalGastos(gastos) {
    const total = gastos.reduce((total, gasto) => total + parseFloat(gasto.gasto), 0);
    this.setState({ totalGastos: total });
  }

  agregarGasto = async () => {
    const { gastos, nuevoGasto, descripcionGasto } = this.state;

    if (!isNaN(parseFloat(nuevoGasto)) && isFinite(nuevoGasto)) {
      if (nuevoGasto) {
        const nuevoRegistro = {
          gasto: nuevoGasto,
          descripcion: descripcionGasto,
        };
        this.setState({
          gastos: [nuevoRegistro, ...gastos],
          nuevoGasto: '',
          descripcionGasto: '',
        });
        this.calcularTotalGastos([nuevoRegistro, ...gastos]);
        try {
          await AsyncStorage.setItem('gastos', JSON.stringify([nuevoRegistro, ...gastos]));
        } catch (error) {
          console.error('Error al guardar gastos:', error);
        }
      }
    } else {
      console.error('El valor ingresado no es numérico.');
    }
  }

  limpiarGastos = async () => {
    try {
      await AsyncStorage.removeItem('gastos');
      this.setState({ gastos: [], totalGastos: 0 });
    } catch (error) {
      console.error('Error al limpiar gastos:', error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Title style={styles.title}>Registro de Gastos Diarios</Title>
        <Paragraph style={styles.totalText}>Total de Gastos: ${this.state.totalGastos.toFixed(2)}</Paragraph>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el gasto"
            value={this.state.nuevoGasto}
            onChangeText={(text) => this.setState({ nuevoGasto: text })}
            keyboardType="numeric"  
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción del gasto"
            value={this.state.descripcionGasto}
            onChangeText={(text) => this.setState({ descripcionGasto: text })}
          />
        </View>
        <PaperButton mode="contained" onPress={this.agregarGasto} style={styles.button}>
          Agregar Gasto
        </PaperButton>
        <PaperButton mode="outlined" onPress={this.limpiarGastos} style={styles.button}>
          Limpiar
        </PaperButton>
        <Title style={styles.subtitle}>Lista de Gastos:</Title>
        {this.state.gastos.map((item, index) => (
          <Card key={index} style={styles.gastoCard}>
            <Card.Content>
              <Paragraph style={styles.descripcionText}>Descripción: {item.descripcion}</Paragraph>
              <Text style={styles.gastoText}>Gasto: ${item.gasto}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 5,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  gastoCard: {
    marginBottom: 10,
  },
  gastoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descripcionText: {
    fontSize: 16,
  },
};

export default GastosApp;

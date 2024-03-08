import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { Button as PaperButton, Card, Title, TextInput as PaperTextInput, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FlashcardApp extends Component {
  state = {
    cards: [],
    question: '',
    answer: '',
    currentPage: 1,
  };

  componentDidMount() {
    this.loadQuestionsFromStorage();
  }

  handleQuestionChange = (text) => {
    this.setState({ question: text });
  };

  handleAnswerChange = (text) => {
    this.setState({ answer: text });
  };

  addCard = () => {
    const { question, answer, cards } = this.state;
    if (question && answer) {
      const newCard = { question, answer };
      this.setState({ cards: [...cards, newCard], question: '', answer: '' });
      this.saveQuestionToStorage(newCard);
      if (cards.length + 1 >= 5) {
        this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
      }
    }
  };

  deleteCard = async (index) => {
    const { cards } = this.state;
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    this.setState({ cards: updatedCards });
    await this.saveQuestionsToStorage(updatedCards);
  };

  async saveQuestionToStorage(newCard) {
    try {
      const existingQuestions = await AsyncStorage.getItem('questions');
      let questions = existingQuestions ? JSON.parse(existingQuestions) : [];
      questions.push(newCard);
      await AsyncStorage.setItem('questions', JSON.stringify(questions));
      console.log('Pregunta guardada en el almacenamiento local');
    } catch (error) {
      console.error('Error al guardar la pregunta en el almacenamiento local', error);
    }
  }

  async saveQuestionsToStorage(cards) {
    try {
      await AsyncStorage.setItem('questions', JSON.stringify(cards));
      console.log('Preguntas guardadas en el almacenamiento local');
    } catch (error) {
      console.error('Error al guardar las preguntas en el almacenamiento local', error);
    }
  }

  async loadQuestionsFromStorage() {
    try {
      const questions = await AsyncStorage.getItem('questions');
      if (questions) {
        this.setState({ cards: JSON.parse(questions) });
        console.log('Preguntas cargadas desde el almacenamiento local');
      }
    } catch (error) {
      console.error('Error al cargar las preguntas desde el almacenamiento local', error);
    }
  }

  showNextPage = () => {
    this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
  };

  showPreviousPage = () => {
    this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }));
  };

  render() {
    const { cards, question, answer, currentPage } = this.state;
    const cardsPerPage = 5;

    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const visibleCards = cards.slice(startIndex, endIndex);

    return (
      <View style={styles.container}>
        <ScrollView style={styles.cardList}>
          {visibleCards.map((card, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.questionText}>{card.question}</Title>
                <Title style={styles.answerText}>{card.answer}</Title>
                <IconButton
                  icon="delete"
                  color="red"
                  size={20}
                  onPress={() => this.deleteCard(index)}
                  style={styles.deleteButton}
                />
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
        <View style={styles.navigationButtons}>
          <PaperButton
            mode="contained"
            onPress={this.showPreviousPage}
            disabled={currentPage === 1}
            style={styles.button}
          >
            Anterior
          </PaperButton>
          <PaperButton
            mode="contained"
            onPress={this.showNextPage}
            disabled={endIndex >= cards.length}
            style={[styles.button, styles.addButton]}
          >
            Siguiente
          </PaperButton>
        </View>
        <PaperTextInput
          label="Pregunta"
          value={question}
          onChangeText={this.handleQuestionChange}
          style={styles.input}
        />
        <PaperTextInput
          label="Respuesta"
          value={answer}
          onChangeText={this.handleAnswerChange}
          style={styles.input}
        />
        <PaperButton mode="contained" onPress={this.addCard} style={[styles.button, styles.addButton]}>
          Agregar Tarjeta
        </PaperButton>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  cardList: {
    flex: 1,
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
  },
  cardContent: {
    alignItems: 'center', 
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  answerText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'justify', 
  },
  
  input: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    borderRadius: 5,
    marginTop: 10,
  },
  addButton: {
    height: 40, 
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
};

export default FlashcardApp;

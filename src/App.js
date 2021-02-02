import React, {Component} from "react";
import './App.css';
import Card from './Card/card';
import CRUDButton from './drawbutton/CRUDButton';
import firebase from 'firebase/app';
import 'firebase/database';

import { DB_CONFIG } from './config/Firebase/db_config';


class App extends Component{
  constructor(props){
    super(props);

    if(!firebase.apps.length){
      firebase.initializeApp(DB_CONFIG);
    }

   this.database = firebase.database().ref().child('cards');

    this.state = {
      cards: [],
      cardId: '',
      currentCard:{ id: '', question: 'Please click the draw button', answer: '', source: ''},
      update: false,
      create: false,
    }
  }

  componentDidMount(){
 
    this.dataPull();

  }

  dataPull () {
    let currentCards = this.state.cards;

    this.database.on('child_added', snap => {
      currentCards.push({
        id: snap.key,
        question: snap.val().question,
        answer: snap.val().answer,
        source: snap.val().source,
      })
    });

    this.setState({
      cards: currentCards,
      // currentCard: this.getRandomCard(currentCards) <-this causes problems upon initialization
    });
  }

  getRandomCard(currentCards){
    let card = currentCards[Math.floor(Math.random() * currentCards.length)];

    if(card === this.state.currentCard && this.state.cards.length > 1){
      return card = this.getRandomCard(this.state.cards);
    }

    const cardId = card.id;
    const array = [cardId, card];

    return array;
  }

  updateData(){
    let currentCard = this.getRandomCard(this.state.cards);

    this.setState(() => ({
      cardId: currentCard[0],
      currentCard: currentCard[1]
     })
    );
  }

  submitUpdate = () => {
    let id = '';

    if(this.state.create) {
      let idArray = [];

      this.state.cards.forEach(i => {
        idArray.push(i.id);
      });
    
      id = idArray.reduce((a, b) => {
        return Math.max(a, b);
      }) + 1;
    } else if (this.state.update) {
        id = this.state.currentCard.id;
    }

    const currentCard = this.state.currentCard

    let card = firebase.database().ref('cards/' + id)
    
    if(this.state.update) {
      card.update({
        id: currentCard.id, 
        question: currentCard.question, 
        answer: currentCard.answer,
        source: currentCard.source
      });
    } else if (this.state.create) {
      card.set({
        id: id,
        question: currentCard.question, 
        answer: currentCard.answer,
        source: currentCard.source
      })
    }

    this.dataPull();
  }

  onChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.getAttribute("name");

    if(this.state.update){
      this.setState(prevState => ({
        currentCard: {
          ...prevState.currentCard,
          [name]: value
        }})
      );
    } else if(this.state.create){
        this.setState(prevState => ({
          currentCard:{
            ...prevState.currentCard,
            [name]: value
        }})
      );
    }
  }

  //cardsIndex is for returning to original card when toggling off createCard
  createCard = () => {
    const wipeCurrent = { id: '', question: '', answer: '', source: ''};
    const cardId = this.state.cardId;
    const cardsIndex = this.state.cards.findIndex(i => i.id === cardId);

    if(!this.state.create) {
      this.setState({
        create: true,
        currentCard: wipeCurrent
      });
    } else {
      this.setState({
        create: false,
        currentCard: this.state.cards[cardsIndex]
      });
    }
  }

  updateCard= () => {
    if(!this.state.update) {
      this.setState({
        update: true
      });
    } else {
      this.setState({
        update: false
      });
    }
  }

  deleteCard = () => {
    const id = this.state.currentCard.id;
    const card = firebase.database().ref('cards/' + id)

    card.remove()
      .then(() => this.updateData())
      .catch(() => console.log("remove failed: " + error.message));

    this.dataPull();
  }


  render(){
    const states = [this.state.update, this.state.create];

    return(
      <div className="App">
        <div className="cardRow">             
              <Card question={this.state.currentCard.question} 
                    answer={this.state.currentCard.answer} 
                    source={this.state.currentCard.source}
                    onClick={this.submitUpdate.bind(this)}
                    createCard={this.state.create}
                    recordChange={this.onChange.bind(this)}>{states}</Card>   
        </div>
        <div>
            <CRUDButton drawCard={this.updateData.bind(this)}>Draw</CRUDButton>
            <div style={{display: 'inline'}}>
              { /* initial cardId is always zero. causes problems when creating card right off the bat */}
              {this.state.cardId ? <CRUDButton createCard={this.createCard.bind(this)}>Create</CRUDButton> : ''}
              <CRUDButton updateCard={this.updateCard.bind(this)}>Update</CRUDButton>
              <CRUDButton deleteCard={this.deleteCard.bind(this)}>Delete</CRUDButton>
            </div>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {DataTable,Column} from 'primereact/datatable';
import {Button} from 'primereact/button';
import {Card} from 'primereact/card';

class App extends Component {
  constructor(props){
    super(props);
    this.onBookSelection = this.onBookSelection.bind(this)
    this.goBack = this.goBack.bind(this)
    this.getBookReviews = this.getBookReviews.bind(this)
    this.getAllReviews = this.getAllReviews.bind(this)
    this.state={
      books:[],
      activeBook:{},
      activePage: 'books',
      totalReviews :[],
      activeBookId:0,
      activePageReviews:[]
    }
  }


  //Api Calls

  //get Books
  componentDidMount(){
    axios.get('https://anapioficeandfire.com/api/books',{
      headers: {
        'Access-Control-Allow-Origin': '*',
      }}
      )
    .then((response)=>{
      response.data.forEach(function(ele,i){
        ele.id=i+1;
    })
      this.setState({books:response.data},()=>{
        this.getAllReviews()
      })
    })
    .catch(function (error) {
          console.log(error);
    });   

  }

//getting all reviews
  getAllReviews(){
    axios.get("http://localhost:4000/all")
    .then((response)=> {
    console.log(response);
    let newData = this.state.books.map((book,index)=>{
      let reviewCount= 0;
      response.data.forEach(function(review,i){
        if(book.id === review.id){
          reviewCount++
        }
      })
      book.count = reviewCount;
      book.noOfCharacters = book.characters.length
      return book;
    })
    console.log(newData)
    this.setState({totalReviews:response.data})
    })
  .catch(function (error) {
    console.log(error);
  });
  }

  //get Book Details
  getBookDetails(id){
    axios.get('https://anapioficeandfire.com/api/books/'+id)
    .then((response)=> {
      console.log(response);
  
      this.setState({activeBook:response.data,activePage:'details',activeBookId:id})
    })
    .catch(function (error) {
      console.log(error);
    });
    this.getBookReviews(id)
}

//getBook Reviews 
getBookReviews(id){
  axios.get("http://localhost:4000/fetch?id="+id)
    .then((response)=> {
    console.log(response);
    this.setState({activePageReviews:response.data})
    })
  .catch(function (error) {
    console.log(error);
  });
}
  //Template Rendering
  render() {

    return (
      <div>
        {this.state.activePage==='books'?this.booksComponent():this.detailComponent()}
      </div>
    );
  }


  //Components
  booksComponent=()=>{
    return(
        <div className="App">
        <header className="App-header">
              <h3>Game Of Thrones Books</h3>
        </header>
        <div>
              <DataTable value={this.state.books} selectionMode="single" onSelectionChange={e => this.onBookSelection(e.value.id)}>
                <Column field="id" header="Book No" sortable={true}/>
                <Column field="name" header="Book" sortable={true}/>
                <Column field="numberOfPages" header="No of Pages" sortable={true}/>
                <Column field="noOfCharacters" header="No of Characters" sortable={true}/>
                <Column field="count" header="No of Reviews" sortable={true}/>
            </DataTable>
        </div>
      </div>
      )
  }

  detailComponent=(props)=>{
    return(
        <div className="App">
        <header className="App-header">
        <a onClick={(e)=>this.goBack()} className="linktoback" href="#">Back to list</a>
              <h3>{this.state.activeBookId} - {this.state.activeBook.name}</h3>
        </header>
        <div className="topsection">
        <div className="book-detail-section">
            <h3>No of Pages: {this.state.activeBook.numberOfPages}</h3>
            <h3>Publisher: {this.state.activeBook.publisher}</h3>
            <h3>Country: {this.state.activeBook.country}</h3>
            <h3>Media Type: {this.state.activeBook.mediaType}</h3>
            <h3>Released: {this.state.activeBook.released}</h3>
            <h3>Total Characters: {this.state.activeBook.characters.length}</h3>
        </div>
        <div className="book-review-section">
        <div>Submit Review:</div>
        <textarea className="reviewbox" ref={(ref)=>this.reviewBox = ref}></textarea>
        <Button label="Submit" className="button" onClick={this.onSubmitReview.bind(this)}/>
        </div>
        </div>
        <div className="bottom-section">

        <h2>Reviews:</h2>

            {this.state.activePageReviews.map((review,index)=>{
              return( <Card>
                 {review.review}
            </Card>
              )
            })}
        </div>
    </div>

      )
  }


  //Functions
  onSubmitReview(){
    let reviewData = this.reviewBox.value;
    let activeBookId = this.state.activeBookId
    console.log(reviewData)

    axios.post('http://localhost:4000/submit',{
      id: activeBookId,
      review: reviewData
    }).then((response)=> {
     alert('Submitted')
      this.reviewBox.value = "";
     this.getBookReviews(activeBookId)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  onBookSelection(id){
  this.getBookDetails(id)
  }
  goBack(e){
    this.setState({activePage: 'books'})
  }
}

export default App;

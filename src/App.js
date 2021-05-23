import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'


const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list")) //we store it as a string so we have to parse it
  } else {
    return []
  }
}

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({show: false, message: "", type: ""});

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name) {
      // display alert
      showAlert(true, "danger", "please enter value");

    } else if(name && isEditing) {
      // deal with edit
      setList(list.map((item) => {
        if (item.id === editID) {
          return {...item, title: name}
        }
        return item
      }))
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "value changed")
    } else {
      // show alert
      showAlert(true, "success", "item added to the list")

      const newItem = {id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      setName("");
    }
  }

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list)); // we store it as a string 
  }, [list])
 // I am looking for show, if I don't change it, its default value should be false
  const showAlert = (show=false, type="", message="") => {
    setAlert({show, type, message}); //ES6 für setAlert({show: show, type: type, message: message});
  }
  const clearList = () => {
    showAlert(true, "danger", "emty list");
    setList([]);
  }
  const removeItem = (id) => {
    showAlert(true, "danger", "item removed");
    setList(list.filter((item) => item.id !== id)); // durchsucht das list array. Wenn die item id nicht mit der gesuchten id übereinstimmt, wird sie in das neue gefilterte array hinzugefügt.
  }
  const editItem = (id) => {
    const specificItem= list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }


  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}  
        {/* {...alert} nimmt alle key value Paare aus dem alert state (object) und passes sie weiter als props*/}
        <h3>grocery bud</h3>
        <div className="form-control">

          <input 
            type="text" 
            className="grocery" 
            placeholder="e.g. eggs" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            />

          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
        <List items={list} removeItem={removeItem} editItem={editItem} />
        <button className="clear-btn" onClick={clearList}>clear items</button>
    </div>
      )}
    </section>
  )
}

export default App

// React Icons Package rausschmeißen
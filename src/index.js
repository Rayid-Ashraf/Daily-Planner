
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import { getFirestore, setDoc, doc, collection, getDocs } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyBKwi3rrbs3juRuuYnwupzpKKCNSdXPi9M",
  authDomain: "daily-planner-cd6a4.firebaseapp.com",
  projectId: "daily-planner-cd6a4",
  storageBucket: "daily-planner-cd6a4.appspot.com",
  messagingSenderId: "744356712360",
  appId: "1:744356712360:web:7a3194c995102e1b65979d",
  measurementId: "G-XYM3WPFHM8"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);



// Golobal Variables

let signupBtn = document.getElementById("signup-button")
let loginBtn = document.getElementById("login-button")
let errMsg = document.getElementById("err-msg")
let uid

let planCls = document.getElementsByClassName("plan")
let goalCls = document.getElementsByClassName("goal")
let habitCls = document.getElementsByClassName("habit")
let todoCls = document.getElementsByClassName("todo")
let checkboxCls = document.getElementsByClassName("checkbox")
let data = document.getElementById("data")

let plansDiv = document.getElementById("plans-div")
let goalsDiv = document.getElementById("goals-div")
let habitsDiv = document.getElementById("habits-div")
let todosDiv = document.getElementById("todos-div")

let addPlanBtn = document.getElementById("add-plan")
let addTodoBtn = document.getElementById("add-todo")
let logoutBtn = document.getElementById("logout-btn")

// The state of the user 
const userState = () => {
  onAuthStateChanged(auth, async (user) => {
    console.log("Hi")
    if (user) {
      uid = user.uid;
      const myCollectionRef = collection(db, uid);
      // This will check if the collection exists in firestore or not 
      getDocs(myCollectionRef)
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            retrieveInitialBlocks()
          } else {
            retrieveBlocks()
          }
        })
    } else {
      if (window.location.href == 'https://mydailyplanner.netlify.app/') {
        window.location.href = "https://mydailyplanner.netlify.app/public/auth.html";
      }
    }
  });
}

// Signup 
const signup = (e) => {
  e.preventDefault()
  let email = document.getElementById("email-field").value
  let password = document.getElementById("password-field").value
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      errMsg.innerHTML = ""
      window.location.href = "https://mydailyplanner.netlify.app/";
    })
    .catch((error) => {
      const errorCode = error.code;
      errMsg.innerHTML = errorCode
    })
}

// Login 
const login = (e) => {
  e.preventDefault()
  let email = document.getElementById("email-field").value
  let password = document.getElementById("password-field").value
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      errMsg.innerHTML = ""
      window.location.href = "https://mydailyplanner.netlify.app/";

    })
    .catch((error) => {
      const errorCode = error.code;
      errMsg.innerHTML = errorCode
    });
}

// Log out 
const logout = () => {
  signOut(auth)
    .then(() => {
      window.location.href = "https://mydailyplanner.netlify.app/public/auth.html";
    })
    .catch((error) => {
      console.error(error);
    });
}


// This displays the current date 
const displayDate = () => {
  const today = new Date();

  const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
  const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
  const year = today.getFullYear();

  date.innerHTML = `@${day}/${month}/${year}`
}

// Checkbox 
const handleCheckbox = (event) => {
  let element = event.target
  let parent = element.parentElement
  let text = parent.children[1]
  if (element.checked == true) {
    text.style.color = "gray";
    text.style.textDecoration = "line-through"
  }
  else {
    text.style.color = "var(--black)";
    text.style.textDecoration = "none"
  }
  retrieveDomElements()
}

// Add Plan
const addNewPlan = () => {
  let div = document.createElement("div")
  let divClasses = ['border-t', 'border-gray-300', 'flex', 'py-3', 'gap-3', 'items-center', 'group', 'plan']
  div.classList.add(...divClasses)
  let h2 = document.createElement("h2")
  h2.setAttribute("contenteditable", "true")
  h2.classList.add("min-w-[6ch]")
  let h3 = document.createElement("h3")
  h3.setAttribute("contenteditable", "true")
  h3.classList.add("w-full")
  let img = document.createElement("img")
  img.setAttribute("src", "./assets/delete-icon.svg")
  let imgClasses = ["visible", 'opacity-50', 'group-hover:visible', 'lg:invisible', 'lg:opacity-100', 'cursor-pointer', "delete-btn"]
  img.classList.add(...imgClasses)
  div.append(h2, h3, img)
  plansDiv.append(div)
  handleEventListners()
}


// Add todo
const addNewTodo = () => {
  let div = document.createElement("div")
  let divClasses = ['border-t', 'border-gray-300', 'flex', 'py-3', 'gap-3', 'items-center', 'group', "todo"]
  div.classList.add(...divClasses)
  let checkbox = document.createElement("input")
  checkbox.setAttribute("type", "checkbox")
  let checkboxClasses = ["w-6", "h-6"]
  checkbox.classList.add(...checkboxClasses)
  let h3 = document.createElement("h3")
  h3.classList.add("w-full")
  h3.setAttribute("contenteditable", "true")
  let img = document.createElement("img")
  img.setAttribute("src", "./assets/delete-icon.svg")
  let imgClasses = ["visible", 'opacity-50', 'group-hover:visible', 'lg:invisible', 'lg:opacity-100', 'cursor-pointer', "delete-btn"]
  img.classList.add(...imgClasses)
  div.append(checkbox, h3, img)
  todosDiv.append(div)
  handleEventListners()
}





// This will retrieve all the contenteditable elements from the document 
const retrieveDomElements = () => {
  let plansArr = []
  for (let index = 0; index < planCls.length; index++) {
    let planObj = { 'time': planCls[index].children[0].innerHTML, 'activity': planCls[index].children[1].innerHTML }
    plansArr.push(planObj)
  }
  let goalsArr = []
  for (let index = 0; index < goalCls.length; index++) {
    let goalObj = { "goal": goalCls[index].children[1].innerHTML }
    goalsArr.push(goalObj)
  }
  let habitsArr = []
  for (let index = 0; index < habitCls.length; index++) {
    let habitObj = { habit: habitCls[index].children[1].innerHTML }
    habitsArr.push(habitObj)
  }
  let todosArr = []
  for (let index = 0; index < todoCls.length; index++) {
    let isTrue = todoCls[index].children[0].checked ? true : false;
    let todoObj = { 'isChecked': isTrue, "task": todoCls[index].children[1].innerHTML }
    todosArr.push(todoObj)
  }
  updateBlocks(plansArr, goalsArr, habitsArr, todosArr)
}

// This will retrieve the initial blocks form the json file 
const retrieveInitialBlocks = () => {
  fetch('https://mydailyplanner.netlify.app/public/blocks.json')
    .then(response => response.json())
    .then(data => {
      updateBlocks(data[0].plans, data[0].goals, data[0].habits, data[0].todos)
      retrieveBlocks()
    })
    .catch(error => console.error(error));
}


// This will update the feilds in firestore 
const updateBlocks = async (plansArr, goalsArr, habitsArr, todosArr) => {
  await setDoc(doc(db, uid, "blocks"), {
    plans: plansArr,
    goals: goalsArr,
    habits: habitsArr,
    todos: todosArr
  });
}

// Delete Items
const deleteItem = (event) => {
  let parent = event.target.parentElement
  parent.remove()
  retrieveDomElements()
}



// This will retrive all the data from firestore 
const retrieveBlocks = async () => {
  let data = []

  const querySnapshot = await getDocs(collection(db, uid));
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });
  displayBlocks(data[0].plans, data[0].goals, data[0].habits, data[0].todos)
};



// This will display blocks in DOM 
const displayBlocks = (plans, goals, habits, todos) => {
  for (let index = 0; index < plans.length; index++) {
    addNewPlan()
    planCls[index].children[0].innerHTML = plans[index].time
    planCls[index].children[1].innerHTML = plans[index].activity
  }
  for (let index = 0; index < goals.length; index++) {
    goalCls[index].children[1].innerHTML = goals[index].goal
  }
  for (let index = 0; index < habits.length; index++) {
    habitCls[index].children[1].innerHTML = habits[index].habit
  }
  for (let index = 0; index < todos.length; index++) {
    addNewTodo()
    todoCls[index].children[1].innerHTML = todos[index].task
    todoCls[index].children[0].checked = todos[index].isChecked
  }
}

// Live HTML Collection 
const handleEventListners = () => {
  let deleteBtn = document.querySelectorAll(".delete-btn")
  let checkbox = document.querySelectorAll(".todo")
  const editableElements = document.querySelectorAll('[contenteditable]');
  const trueEditableElems = Array.from(editableElements).filter(elem => elem.contentEditable === 'true');

  deleteBtn.forEach((button) => {
    button.addEventListener("click", deleteItem)
  })
  checkbox.forEach(checkbox => {
    checkbox.children[0].addEventListener("click", handleCheckbox)
  });
  trueEditableElems.forEach(elem => {
    elem.addEventListener('input', retrieveDomElements)
})}

userState()

if (signupBtn && loginBtn) {
  signupBtn.addEventListener("click", signup)
  loginBtn.addEventListener("click", login)
} else {
  addPlanBtn.addEventListener("click", addNewPlan)
  addTodoBtn.addEventListener("click", addNewTodo)
  logoutBtn.addEventListener("click", logout)
  handleEventListners()
  displayDate()
}

console.log("Hello")
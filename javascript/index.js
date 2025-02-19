import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://playground-bb58b-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const itemNameInput = document.querySelector("#item-name-input");
const addItemButton = document.querySelector("#add-item-button");
const shoppingList = document.querySelector("#shopping-list");

getShoppingList();

addItemButton.addEventListener("click", () => {
  addItemToList();
});

itemNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addItemToList();
  }
});

function addItemToList() {
  const itemName = itemNameInput.value;

  if (itemName.trim()) {
    appendItem(itemName);
    push(shoppingListInDB, itemName);
    clearInput(itemNameInput);
  }
}

function getShoppingList() {
  onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
      const itemsArray = Object.entries(snapshot.val());

      clearShoppingList();

      itemsArray.forEach(function (currentItem) {
        appendItem(currentItem);
      });
    } else {
      shoppingList.innerHTML = "There are no items in your shopping list...";
    }
  });
}

function clearShoppingList() {
  shoppingList.innerHTML = "";
}

function appendItem(currentItem) {
  let itemId = currentItem[0];
  let itemName = currentItem[1];

  const item = document.createElement("li");
  item.classList.add("item");
  item.textContent = itemName;
  shoppingList.prepend(item);

  item.addEventListener("dblclick", () => {
    const itemLocationInDatabase = ref(database, `shoppingList/${itemId}`);

    remove(itemLocationInDatabase);
  });
}

function clearInput(inputField) {
  inputField.value = "";
}

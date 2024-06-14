1. Explain event delegation and why it’s useful in web development with an example code snippet using vanilla JS

Event delegation is a technique in web development where instead of adding an event listener to each individual element, you attach a single event listener to a parent element. This listener then manages all of the events that bubble up from its child elements due to event propagation. This approach is particularly useful for handling events on multiple elements that share the same functionality, improving performance and memory usage, especially in dynamic applications where elements are frequently added or removed.

#### Benefits of Event Delegation

Memory Efficiency: Attaches fewer event handlers, reducing memory usage.
Simpler Management: Easier to manage and update event handlers as you work with fewer of them and they are centralized.
Dynamic Elements Handling: Automatically handles events from future elements (those added dynamically to the DOM)

#### Example Code Snippet

```html
<div id="itemList">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

```javascript
document.getElementById("itemList").addEventListener("click", function (event) {
  // Check if the clicked element is an item
  if (event.target.classList.contains("item")) {
    console.log("Clicked item:", event.target.textContent);
  }
});
```

In this example, instead of attaching an event listener to each item element, a single listener is attached to the parent #itemList. The listener checks if the clicked target has the class item (indicating it's one of the child items) and then logs its content. This setup means any dynamically added items under #itemList will also have the click functionality without needing to attach new event listeners.

2. Explain pass by value and pass by reference in JS with an example code snippet for each.

#### Pass by Value

In JavaScript, primitive data types (like numbers, strings, booleans, etc.) are passed by value. This means that when you pass a variable to a function, a copy of the value is made. Changes to the variable inside the function do not affect the original value outside the function.

```javascript
function modifyValue(num) {
  num = num + 10;
  console.log("Inside function:", num); // Output will be the original value + 10
}

let a = 5;
modifyValue(a);
console.log("Outside function:", a); // Output will still be 5
```

In this example, `a` is a number (a primitive type), so it is passed by value. The function `modifyValue` receives a copy of `a`, and modifications inside the function do not affect the original value of `a`.

#### Pass by Reference

Non-primitive data types (like objects and arrays) are passed by reference. This means that when you pass an object or an array to a function, you are actually passing a reference to the original memory location of that object. Therefore, changes to the object inside the function can affect the original object.

```javascript
function modifyObject(obj) {
  obj.key = "modified";
  console.log("Inside function:", obj); // Output will show the modified object
}

let myObj = { key: "original" };
modifyObject(myObj);
console.log("Outside function:", myObj); // Output will also show the modified object
```

Here, `myObj` is an object, so it is passed by reference. The function `modifyObject` modifies the `key` property of the object, and because it's passed by reference, the change is reflected outside the function as well.

3.  What are the core components of NgRx? Describe each briefly.

NgRx is a framework for building reactive applications in Angular. It follows the Redux pattern using RxJS observables and provides a robust environment for managing state in a predictable way across Angular applications. The core components of NgRx include:

1. Store

The Store is a centralized and immutable data structure that holds the state of your application. It is essentially a single source of truth for your application's state, accessible to any part of your app. The store is an observable of state and an observer of actions.

2. Actions

Actions are one of the main building blocks in NgRx. They express unique events that are dispatched from components and services. Actions carry a type identifier and an optional payload with data. They are the only source of information for the store and are processed by reducers before the state is updated.

3.Reducers

Reducers are pure functions that take the current state of the app and an action, and return a new state. They handle the state transitions by determining how the state should change and return new state values based on the received action type. Reducers are responsible for handling transitions in an immutable manner.

4. Effects

Effects are another key part of NgRx. They listen for actions dispatched from Store, perform some operations (usually side effects like data fetching), and then dispatch new Actions to the Store or navigate to different routes. Effects are an ideal place to interact with external resources or services.

5.Selectors

Selectors are pure functions used for obtaining slices of store state. NgRx selectors can compute derived data, allowing Angular components to only render when the data actually changes. They help in optimizing the performance by preventing unnecessary renders and decoupling the store structure from the UI.

6, Entity

NgRx Entity is a library for managing collections of entities. It provides a set of utility functions that ease the manipulation and querying of entity collections, making it easier to manage normalized data in the store.

7.  Router Store

Router Store is an optional module that connects the Angular Router with the NgRx store. It synchronizes router state with the store and allows for the router state to be accessed like any other piece of state within NgRx.

#### Example

Below is a simple example demonstrating the core components of NgRx in an Angular application. This example will include a basic store setup, actions, reducers, and selectors for managing a list of items.

1. Action - First, define the actions for adding and removing items.

```js

import { createAction, props } from '@ngrx/store'; export const addItem =
createAction('[Item List] Add Item', props<{ item: string }>()); export const
removeItem = createAction('[Item List] Remove Item', props<{ id: number }>());

```

2. Reducer - Next, create a reducer to handle these actions.

```js
import { createReducer, on } from "@ngrx/store";
import { addItem, removeItem } from "./item.actions";

export interface State {
  items: string[];
}

export const initialState: State = {
  items: [],
};

export const itemReducer = createReducer(
  initialState,
  on(addItem, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
  })),
  on(removeItem, (state, { id }) => ({
    ...state,
    items: state.items.filter((_, index) => index !== id),
  }))
);
```

3.Selectors - Define selectors to access the items from the store.

```js
import { createSelector, createFeatureSelector } from "@ngrx/store";
import { State } from "./item.reducer";

export const selectItemsFeature = createFeatureSelector < State > "items";

export const selectItems = createSelector(
  selectItemsFeature,
  (state: State) => state.items
);
```

Store Module -
Set up the NgRx Store module in your app module.

```js
import { StoreModule } from "@ngrx/store";
import { itemReducer } from "./store/item.reducer";

@NgModule({
  declarations: [
    // your components here
  ],
  imports: [
    StoreModule.forRoot({ items: itemReducer }),
    // other imports here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

5. Component -
   Use the store in a component to dispatch actions and select data.

```js
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItem, removeItem } from './store/item.actions';
import { selectItems } from './store/item.selectors';

@Component({
  selector: 'app-root',
  template: `
    <input #itemInput type="text">
    <button (click)="onAdd(itemInput.value)">Add Item</button>
    <ul>
      <li *ngFor="let item of items$ | async; let i = index">
        {{ item }} <button (click)="onRemove(i)">Remove</button>
      </li>
    </ul>
  `
})
export class AppComponent {
  items$ = this.store.select(selectItems);

  constructor(private store: Store) {}

  onAdd(item: string) {
    this.store.dispatch(addItem({ item }));
  }

  onRemove(id: number) {
    this.store.dispatch(removeItem({ id }));
  }
}
```

4. Consider the following piece of code that uses both an IIFE and setTimeout. There might be a bug hidden within this implementation. Explain what the bug is, if any and how you would fix it.

```js
for (var i = 0; i < 5; i++) {
(function () {
setTimeout(function () {
console.log("Index:", i);
}, Math.random() _ 1000);
})();
}

```

The bug in the provided code snippet arises from the combination of using var to declare the loop variable i and the asynchronous nature of setTimeout. Since var has function scope (or global if not in a function), by the time the setTimeout function executes, the loop has already completed and the value of i has settled at 5. This results in each setTimeout callback logging "Index: 5" instead of the intended indices 0 through 4.

Explanation:

- The for loop increments i from 0 to 4.
- Each iteration creates an IIFE (Immediately Invoked Function Expression) which schedules a setTimeout.
- However, because var is used and it has function scope, there's only one binding of i for all iterations.
- By the time any setTimeout callback is executed, the loop has finished and i is 5.

Solution:
To fix this issue, you can use let instead of var for the loop variable. let has block scope, which means a new i is created for each iteration of the loop, and each setTimeout callback will capture its respective i.
Here's the corrected code:

```js
for (let i = 0; i < 5; i++) {
  (function () {
    setTimeout(function () {
      console.log("Index:", i);
    }, Math.random() * 1000);
  })();
}
```

With this change, each iteration of the loop has its own `i`, and the `setTimeout` function will correctly log indices 0 through 4 as expected. The IIFE is actually redundant in this corrected version since `let` already provides the necessary scoping. The code can be further simplified to:

```js
for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log("Index:", i);
  }, Math.random() * 1000);
}
```

5. Create a function that takes a multi-dimensional array of unknown depth containing unknown data types and returns a single-dimensional array.

BDD

Scenario 1: Flattening a deeply nested array

- Given a multi-dimensional array
- When the flattenArray function is called with this array
- Then it should return a single-dimensional array containing all elements from the multi-dimensional array

Example

- Given the array [[[1, 2], [3]], [4, [5, [6]]]]
- When the function is called
- Then the output should be [1, 2, 3, 4, 5, 6]

Scenario 2: Flattening an array containing different data types

- Given a multi-dimensional array containing integers, strings, and nested arrays
- When the flattenArray function is called with this array
- Then it should return a single-dimensional array with all elements, preserving their types

Example:

- Given the array [["hello", [true, [false]], 42]]
- When the function is called
-
- **Then** the output should be `["hello", true, false, 42]`

Scenario 3: Flattening an empty array

- Given an empty array
- When the flattenArray function is called with this array
- Then it should return an empty array

### Example

- Given the array []
- When the function is called
- Then the output should be []

Pseudocode

Function flattenArray(arr)
Initialize result as an empty list

```
    Function flatten(element)
        If element is an array
            For each subelement in element
                Call flatten(subelement)
        Else
            Append element to result

    For each item in arr
        Call flatten(item)

    Return result

End Function

```

Solution

// Define a function to flatten any multi-dimensional array into a single-dimensional array.
function flattenArray(arr) {
// Initialize an empty array to hold the flattened results.
let result = [];

// Define a helper function that will be used to process each element of the array.
function flatten(element) {
// Check if the current element is an array.
if (Array.isArray(element)) {
// If the element is an array, recursively call the flatten function on each item in this array.
element.forEach(flatten);
} else {
// If the element is not an array (i.e., it is a primitive value), add it to the result array.
result.push(element);
}
}

// Start the flattening process by applying the flatten function to each element in the initial array.
arr.forEach(flatten);

// After processing all elements, return the single-dimensional result array.
return result;
}

// Example of a multi-dimensional array to be flattened.
const multi_dimension_arr = [
[
[
[0, 2],
[4, 5],
],
[
[7, 8],
[9, 3],
],
],
[
[
[10, 12],
[14, 15],
],
[
[17, 18],
[19, 13],
],
],
];

// Call the flattenArray function with the multi-dimensional array and log the output to the console.
console.log(flattenArray(multi_dimension_arr));

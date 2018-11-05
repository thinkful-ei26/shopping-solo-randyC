'use strict';

/*eslint-env jquery*/

// Implement the following features which will require a more complex store object:

//** User can press a switch/checkbox to toggle between displaying all
// items or displaying only items that are unchecked

//** User can type in a search term and the displayed list will be filtered
// by item names only containing that search term

// User can edit the title of an item
 
 
 
const STORE = {
  items:[
    {name: 'item_0', checked: false},
    {name: 'item_1', checked: false}
  ],
  hideItemsState: 0,
  showOnlySearchedState: 0,
  searchName: ''
};

//Correlate the STORE to the itemIndex...
let tracker = 0;

//itemIndex needs to refer to a specific object

function generateItemElement(item, itemIndex) {
   

  //template for edit item name view


  //template for normal item view
  console.log(`this --> `);

  //re-name version
  if(item.name === ' ' || item.name === '' || item.name === undefined){
   
  return `
    
  <li class="js-item-index-element" data-item-index="${itemIndex}">
  <span class="shopping-item js-shopping-item">${item.name}</span>
    <div class="shopping-item-controls">
        <input type="text" name="shopping-list-entry" class="js-rename-item-entry" placeholder="New name">
        <button class="shopping-item-rename-finalize js-item-rename-finalize">
        <span class="button-label">commit changes</span>
        </button>
    </div>
    <br>
    </li>
    `;

  }


  //regular version
  if(item.name !== '' && item.name !== ' '){
   
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">${item.checked ? 'uncheck item' : 'check item'}</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete item</span>
        </button>
        <button class="shopping-item-rename js-item-rename">
            <span class="button-label">rename item</span>
        </button>
      </div>
    </li>`;
  }

  
}

 

function generateShoppingItemsString(shoppingList,hideItemSwitch,showOnlySearchedSwitch) {

  console.log('Generating shopping list element');
    
  console.log('search name -->>> ' + STORE.searchName);

  //FILTER for search term item  STORE.searchName  
  if(showOnlySearchedSwitch === 1){ 

    const myThing = STORE.searchName;
        
    const searchedShoppingList = shoppingList.filter(shoppingList => shoppingList.name === myThing);

    const items = searchedShoppingList.map((item, index) => generateItemElement(item, index));
    
    console.log('the list: ' + searchedShoppingList);

    return items.join('');
  } 

  //FILTER for hide checked items state 
  else if(showOnlySearchedSwitch === 0 && hideItemSwitch === 1){ 
         
    const filteredShoppingList = shoppingList.filter(shoppingList => shoppingList.checked === false);

    const items = filteredShoppingList.map((item, index) => generateItemElement(item, index));

    return items.join('');
  } 

  //NO FILTER ...
  else if(showOnlySearchedSwitch === 0 && hideItemSwitch === 0){  
         
    const items = shoppingList.map((item, index) => generateItemElement(item, index));

    return items.join('');
  }   

    
   
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
 

  const shoppingListItemsString = generateShoppingItemsString(
    STORE.items,
    STORE.hideItemsState,
    STORE.showOnlySearchedState);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);

}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}


function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

 

  /*
  $('#js-rename-form').submit(function(event) {
    event.preventDefault();
 
    console.log('`handleItemNameChangeSubmit` ran');

    
    //GET current item index
    const itemIndex = getItemIndexFromElement(event.currentTarget);

    const itemNameChanged = $('.js-shopping-list-rename-entry').val();

    console.log('>>>>>> ',itemNameChanged);

    const currentList = STORE.items;
   
    if(STORE.hideItemsState === 0){
         
      const currentItemName = currentList[itemIndex];
      const currentItemIndex = itemIndex;
      
      currentList[itemIndex].name = itemNameChanged;
        
      renderShoppingList();
  
    }
 
  });*/



//}
 
 


function handleSearchItemSubmit() {
  $('#js-shopping-list-search-form').submit(function(event) {

    event.preventDefault();

    //console.log('`handleSearchItemSubmit` ran');

    const searchItemName = $('.js-shopping-list-search-entry').val();

    //console.log('handleSearchItemSubmit--> search item name: ' + searchItemName);
 
    const testResults = searchTheList(searchItemName);
 
    if(testResults !== undefined){

      STORE.searchName = searchItemName;

      STORE.showOnlySearchedState = 1;//SHOW ONLY SEARCH MATCHED

    }
    else{
        
      STORE.showOnlySearchedState = 0;//RESET

      $('.js-shopping-list-search-entry').val();

      $('.js-shopping-list-search-entry').val('No Results Found');
 
    }

    //itemIndex needs to be adjusted?


     
    renderShoppingList();

  });
}




//sets view based on searchItemName
function searchTheList(searchForThis){

  //search through STORE object names
   
  const searchCheck = STORE.items.find(item => item.name === searchForThis);  
  
  if(searchCheck !== undefined){
 
    return searchCheck;

  }
  else{ 

    return;

  }

}


function toggleCheckedForListItem(itemIndex) {
  console.log('>>>>>>>>>. Toggling checked property for item at index >>>> itemIndex = ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

//this gets itemIndex
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

//item check button clicked
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    
    console.log('handleItemCheckClicked` ran');

    //change text on button to say clcik to uncheck

    const itemIndex = getItemIndexFromElement(event.currentTarget);

    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

//item rename button clicked
function handleItemRenameClicked() {
  $('.js-shopping-list').on('click', '.js-item-rename', event => {
    
    console.log('`**** handleItemRenameClicked` ran');
    
    //GET current item index
    const itemIndex = getItemIndexFromElement(event.currentTarget);

    const currentList = STORE.items;
  
    //console.log('HEY Object Values---->>>>',currentList[itemIndex].name);
 
    //if STORE.hideItemsState === 0 then the itemIndex is a direct corrrelation to object posiiton
    if(STORE.hideItemsState === 0){
         
      const currentItemName = currentList[itemIndex];
      const currentItemIndex = itemIndex;
      
      currentList[itemIndex].name = '';
        
      renderShoppingList();
  
    }
 
    //HIDDEN STATE compensation 
    //make an array that has just the stuff that is visible
    //const lookAtShoppingList = currentList.filter(currentList => currentList.checked === false && STORE.hideItemsState === 1);
    if(STORE.hideItemsState === 1000){

      const currentList = STORE.items;

      //make filtered array
      const filteredStore = currentList.filter(currentList => currentList.checked === false);
 
      const currentItemName = currentList[itemIndex];
       
      
      filteredStore[itemIndex] = "";

      renderShoppingList();
  
    }
 
  
  });
}

//item rename finalize
function handleItemRenameFinalizeClicked() {
  $('.js-shopping-list').on('click', '.js-item-rename-finalize', event => {
    
    console.log('`**** handleItemRenameFINALIZE-Clicked` ran');
    
        //GET current item index
        const itemIndex = getItemIndexFromElement(event.currentTarget);

        const itemNameChanged = $('.js-rename-item-entry').val();
    
        console.log('>>>>>> ',$('.js-rename-item-entry').val());
    
        const currentList = STORE.items;
       
        if(STORE.hideItemsState === 0){
           
          const currentItemName = currentList[itemIndex];
          const currentItemIndex = itemIndex;
            
          currentList[itemIndex].name = itemNameChanged;
            
          renderShoppingList();
      
        }  
 
  
  });
}




//compensates for hidden state
function getItemIndexConversion(value){

  

}


// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}


 
function handleItemCheckHideClicked() { 
 
  $('input[type="checkbox"]').change(function(event){

    console.log($(this). prop('checked'));

    if($(this). prop('checked') === true){
      //alert("Checkbox is checked." );

      STORE.hideItemsState = 1;//HIDE THE CHECKED ONES
 
    }
    else{
      //alert("Checkbox is unchecked." );

      STORE.hideItemsState = 0;//SHOW EVERYTHING
                
    }
     
    renderShoppingList();

  });
 

}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {

  renderShoppingList();
  handleNewItemSubmit();
  handleSearchItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleItemCheckHideClicked();
  handleItemRenameClicked();
  handleItemRenameFinalizeClicked();
 
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
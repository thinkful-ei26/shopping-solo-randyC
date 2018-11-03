'use strict';

// Implement the following features which will require a more complex store object:

//** User can press a switch/checkbox to toggle between displaying all
// items or displaying only items that are unchecked

//** User can type in a search term and the displayed list will be filtered
// by item names only containing that search term

// User can edit the title of an item
 
 
 
const STORE = {
  items:[
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: false},
    {name: 'bread', checked: false}],
  hideItemsState: 0,
  showOnlySearchedState: 0,
  searchName: 'pickles'
};


function generateItemElement(item, itemIndex, template) {
    
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList,hideItemSwitch,showOnlySearchedSwitch) {

  console.log('Generating shopping list element');
    
  console.log('search name -->>> ' + STORE.searchName);

  //filter for search term item  STORE.searchName
    
  if(showOnlySearchedSwitch === 1){ 

    const myThing = STORE.searchName;
        
    const searchedShoppingList = shoppingList.filter(shoppingList => shoppingList.name === myThing);

    const items = searchedShoppingList.map((item, index) => generateItemElement(item, index));
    
    console.log('the list: ' + searchedShoppingList);

    return items.join('');
  } 
    

  //filter for hide checked items
  else if(showOnlySearchedSwitch === 0 && hideItemSwitch === 1){ 
         
    const filteredShoppingList = shoppingList.filter(shoppingList => shoppingList.checked === false);

    const items = filteredShoppingList.map((item, index) => generateItemElement(item, index));

    return items.join('');
  } 

  //NO filter
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


function handleSearchItemSubmit() {
  $('#js-shopping-list-search-form').submit(function(event) {

    event.preventDefault();

    console.log('`handleSearchItemSubmit` ran');

    const searchItemName = $('.js-shopping-list-search-entry').val();

    console.log('handleSearchItemSubmit--> search item name: ' + searchItemName);
 
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
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
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
 
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
const StorageCtrl=(function(){

    return{
        storeItem:function(item){
            console.log('enter');
            let items;
            if(localStorage.getItem('items')===null){
                items=[];
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }else{
                 items=JSON.parse(localStorage.getItem('items'));   
                 items.push(item);
                 localStorage.setItem('items',JSON.stringify(items));
            }
        },
        getIemsFromStorage:function(){
            let items=[];
            if(localStorage.getItem('items')===null){
                items=[];
            }else{
                items=JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage:function(updateditem){
            let items=JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(updateditem.id===item.id){
                    items.splice(index,1,updateditem);
                }
            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        deletefromstorage:function(Id){
            let items=JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(item.id===Id){
                    items.splice(index,1);
                }
            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearfromlocalstorage:function(){
            localStorage.removeItem('items');
        }
    }
})();


const ItemCtrl=(function(){
const Item=function(id,name,calories){
    this.id=id;
    this.name=name;
    this.calories=calories;
}

const data={
    items:StorageCtrl.getIemsFromStorage(),
    currentItem:null,
    totalcal:0
}
return {
    getItems:function(){
        return data.items;
    },
    addItem:function(name,cal){
        
    let Id;
    if(data.items.length>0){
        Id=data.items[data.items.length-1].id+1;
    }else{
        Id=0;
    }
        const calories=parseInt(cal);

        //create new item
        newItem=new Item(Id,name,calories);
        
        //push to data.items array
        data.items.push(newItem);

        return newItem;
    },
getItemById:function(id){
    let found=null;
    //looping through items
    data.items.forEach(item=>{
        if(item.id===id){
            found=item;
        }
    });
        return found;
},

getupdateItem:function(name,calories){
    calories=parseInt(calories);
    let found=null;
    data.items.forEach(item=>{
        if(item.id===data.currentItem.id){
            item.name=name;
            item.calories=calories;
            found=item;
        }
    });
    return found;
},
deleteItem:function(id){
    //get the ids
    ids=data.items.map(function(item){
        return item.id;
    });
    const index=ids.indexOf(id);
    data.items.splice(index,1);
    // console.log(data.items);
},
clearallitems:function(){
    data.items=[];
},

setcurrentItem:function(item){
data.currentItem=item;
},
getCurrentitem:function(){
    return data.currentItem;
},
    getTotalcalories:function(){
        let total=0;
        data.items.forEach(item=>{
            total+=item.calories;
        });
        data.totalcal=total;
        return data.totalcal;
    },
    logdata:function(){
        return data;
    }
}

})();

const UIctrl=(function(){
const UIselector={
    itemlist:'#item-list',
    addBtn:'.add-btn',
    itemName:'#item-name',
    itemCalories:'#item-calories',
    totalcal:'.total-calories',
    updateBtn:'.update-btn',
    backBtn:'.back-btn',
    deleteBtn:'.delete-btn',
    listitem:'#item-list li',
    clearall:'.clear-btn'
}

    return {
        populateItems:function(items){
            // console.log(items,"begin");
            let html='';
            items.forEach(item => {
                html+=`<li id="item-${item.id}" class="collection-item">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`;
            });
           //inserting into ul
           document.querySelector(UIselector.itemlist).innerHTML=html; 
        },

        getItemInput:function(){
            tmpname=document.querySelector(UIselector.itemName);
            tmpcal=document.querySelector(UIselector.itemCalories);
            return {
                name:tmpname.value,
                calories:tmpcal.value
            }
        },
        addListItem:function(item){
            const li=document.createElement('li');
            li.className='collection-item';
            li.id=`item-${item.id}`;

            li.innerHTML=`
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a> `;

            //insert item
            document.querySelector(UIselector.itemlist).insertAdjacentElement('beforeend',li);
        },
        updateListItem:function(items){
            // console.log(item);
            let listitem=document.querySelectorAll(UIselector.listitem);
            //convert node list to array
            listitem=Array.from(listitem);

            listitem.forEach(item=>{
                const Id=item.getAttribute('id');
            
                if(Id===`item-${items.id}`){
                 
                    document.querySelector(`#${Id}`).innerHTML=`
                    <strong>${items.name}: </strong> <em>${items.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a> `;
                }
            })
        },
        deletelistitem:function(id){
            const Id=`#item-${id}`;
            const item=document.querySelector(Id);
            item.remove();
            
        },
        getSelector:function(){
            return UIselector;
        },
        showTotalCalories:function(total){
            document.querySelector(UIselector.totalcal).textContent=total;
        },
        clearEditstate:function(){
            UIctrl.clearfields();

            //hide buttons
            document.querySelector(UIselector.addBtn).style.display='inline';
            document.querySelector(UIselector.updateBtn).style.display='none';
            document.querySelector(UIselector.deleteBtn).style.display='none';
            document.querySelector(UIselector.backBtn).style.display='none';
        },
        clearfields(){
        document.querySelector(UIselector.itemName).value='';
        document.querySelector(UIselector.itemCalories).value='';
        },
        additemtoform(){
            document.querySelector(UIselector.itemName).value=ItemCtrl.getCurrentitem().name;
        document.querySelector(UIselector.itemCalories).value=ItemCtrl.getCurrentitem().calories;
            UIctrl.showEditState();
    },
    showEditState(){
        document.querySelector(UIselector.updateBtn).style.display='inline';
            document.querySelector(UIselector.deleteBtn).style.display='inline';
            document.querySelector(UIselector.addBtn).style.display='none';
            document.querySelector(UIselector.backBtn).style.display='inline';
    },
    removeItems(){
        let listItems=document.querySelectorAll(UIselector.listitem);
        listItems=Array.from(listItems);
        listItems.forEach(item=>{
            item.remove();
        })
    }}
})();
// console.log(ItemCtrl.getItems());

const app=(function(ItemCtrl,UICtrl,StorageCtr){

const loadeventListeners=function(){
    const UIselector=UICtrl.getSelector();
    
    document.querySelector(UIselector.addBtn).addEventListener('click',itemAdded)

    //disabling enter to submit the form
    document.addEventListener('keypress',function(e){
        if(e.keyCode===13||e.which===13){
            e.preventDefault();
            return false;
        }
    })
    //icon click event
    document.querySelector(UIselector.itemlist).addEventListener('click',itemupdateClick);

    //updating event
   
    document.querySelector(UIselector.updateBtn).addEventListener('click',ItemUpdateSubmit);
    //back event
    document.querySelector(UIselector.backBtn).addEventListener('click',UIctrl.clearEditstate);
    //delete event
    document.querySelector(UIselector.deleteBtn).addEventListener('click',ItemDeleteSubmit);
    //clear all event
    document.querySelector(UIselector.clearall).addEventListener('click',Clearallclick);

}


    const itemAdded=function(e){
        
        //get input from UIcontroller
        const input=UICtrl.getItemInput();

    if(input.name!==''&&input.calories!==''){
        const newItem=ItemCtrl.addItem(input.name,input.calories);

        const totalcalories=ItemCtrl.getTotalcalories();
    //add total calories to ui
        UIctrl.showTotalCalories(totalcalories);

        UIctrl.addListItem(newItem);

        StorageCtrl.storeItem(newItem);

        UIctrl.clearfields();
    }
    

    e.preventDefault();
}
//update item load to
const itemupdateClick=function(e){
    if(e.target.classList.contains('edit-item')){
        //get the clicked item id
        const listid=e.target.parentNode.parentNode.id;
        //break the id to number
        const id=parseInt(listid.split('-')[1]);
        // console.log(id);\
        const itemToEdit=ItemCtrl.getItemById(id);
        // console.log(itemToEdit);
        //set the item to current item

        ItemCtrl.setcurrentItem(itemToEdit);
        //add to form
        UIctrl.additemtoform();
    }
e.preventDefault();
}

//update items
const ItemUpdateSubmit=function(e){
    const input=UIctrl.getItemInput();
    const updateItem=ItemCtrl.getupdateItem(input.name,input.calories);
    console.log(updateItem);
    //update in UI
    UIctrl.updateListItem(updateItem);

    const totalcalories=ItemCtrl.getTotalcalories();
    //add total calories to ui
        UIctrl.showTotalCalories(totalcalories);

        StorageCtrl.updateItemStorage(updateItem);
        UIctrl.clearEditstate();
    e.preventDefault();
}

const ItemDeleteSubmit=function(e){
    e.preventDefault();
    console.log('enter detele');
//get current item
    const currentItem=ItemCtrl.getCurrentitem();
//delete from datastructure
ItemCtrl.deleteItem(currentItem.id);
//delete from UI
UIctrl.deletelistitem(currentItem.id);

const totalcalories=ItemCtrl.getTotalcalories();
    //add total calories to ui
        UIctrl.showTotalCalories(totalcalories);

    //delete from local storage
    StorageCtrl.deletefromstorage(currentItem.id);
        //clear form
        UIctrl.clearEditstate();
}

const Clearallclick=function(){
    //delete all items 
    ItemCtrl.clearallitems();
    //clear from UI
    UIctrl.removeItems();
    const totalcalories=ItemCtrl.getTotalcalories();
    //add total calories to ui
     UIctrl.showTotalCalories(totalcalories);
     StorageCtrl.clearfromlocalstorage();
}

    return{
        init:function(){
            //set initial state
            UIctrl.clearEditstate();
            console.log("Initializing App.....");
            // console.log(ItemCtrl.getItems());
            const items=ItemCtrl.getItems();
            UIctrl.populateItems(items);


            loadeventListeners();

        }
    }
})(ItemCtrl,UIctrl,StorageCtrl);
app.init();
// app.loadeventListeners();


// console.log(ItemCtrl.logdata());
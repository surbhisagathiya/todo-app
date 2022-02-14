const form = document.querySelector("#itemForm");
const inputItem = document.querySelector("#itemInput");
const itemsList = document.querySelector("#itemsList");
const filter = document.querySelectorAll(".nav-item");
const alertDiv = document.querySelector("#message");

// create empty item list 
let todoItems = [];
const alertMessage = function (message, className) {
    alertDiv.innerHTML = message;
    alertDiv.classList.add(className, "show");
    alertDiv.classList.remove("hide");
    setTimeout(() => {
        alertDiv.classList.add("hide");
        alertDiv.classList.remove("show");
    }, 3000);
    return;
}

// update item 
const updateItem = function (currentItemIndex, value) {
    const newItem = todoItems[currentItemIndex];
    newItem.name = value;
    todoItems.splice(currentItemIndex, 1, newItem);
    setLocalStorage(todoItems)
}

// delete item 
const removeItem = function (item) {
    const removeIndex = todoItems.indexOf(item);
    todoItems.splice(removeIndex, 1);
}

// filter item 
const getItemsFilter = function (type) {
    let filterItem = [];
    switch (type) {
        case "todo":
            filterItem = todoItems.filter((item) => !item.isDone);
            break;
        case "done":
            filterItem = todoItems.filter((item) => item.isDone);
            break;
        default:
            filterItem = todoItems;
    }
    getList(filterItem);
}

// handle event  action button 
const hadleItem = function (itemData) {
    const items = document.querySelectorAll(".list-group-item");
    items.forEach((item) => {
        if (item.querySelector(".title").getAttribute('data-time') == itemData.addedAt) {
            // done 
            item.querySelector("[data-done]").addEventListener("click", function (e) {
                e.preventDefault();
                const itemIndex = todoItems.indexOf(itemData);
                const currentItem = todoItems[itemIndex];
                const currentClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";

                currentItem.isDone = currentItem.isDone ? false : true;
                todoItems.splice(itemIndex, 1, currentItem);
                setLocalStorage(todoItems);
                const iconClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
                this.firstElementChild.classList.replace(currentClass, iconClass);
                const filterType = document.querySelector("#tabValue").value;
                getItemsFilter(filterType);
            });
            // edit 
            item.querySelector("[data-edit]").addEventListener('click', function (e) {
                e.preventDefault();
                inputItem.value = itemData.name;
                document.querySelector('#objIndex').value = todoItems.indexOf(itemData);
            });

            // delete 
            item.querySelector("[data-delete]").addEventListener('click', function (e) {
                e.preventDefault();
                if (confirm("Are you sure want to delete this item?")) {
                    itemsList.removeChild(item);
                    removeItem(item);
                    setLocalStorage(todoItems);
                    alertMessage("task has been deleted", "alert-success");
                    return todoItems.filter((item) => item != itemData);
                }
            });

        }
    });
}

const getList = function (todoItems) {
    itemsList.innerHTML = "";
    if (todoItems.length > 0) {
        todoItems.forEach((item) => {
            const iconClass = item.isDone ? "bi-check-circle-fill" : "bi bi-check-circle";
            itemsList.insertAdjacentHTML("beforeend",
                `<li class="list-group-item d-flex justify-content-between align-item-center">
            <span class="title" data-time="${item.addedAt}">${item.name}</span>
            <span>
                <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
                <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
                <a href="#" data-delete><i class="bi bi-trash red"></i></a>
            </span>
        </li>`);
            hadleItem(item);
        });
    } else {
        itemsList.insertAdjacentHTML("beforeend",
            `<li class="list-group-item d-flex justify-content-between align-item-center">
            <span>No Record Found</span>
            </li>`
        );
    }
};

// local storage in set 
const setLocalStorage = function (todoItems) {
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}
// show task 
const getLocalStorage = function () {
    const todoStorage = localStorage.getItem("todoItems");
    if (todoStorage === "undefined" || todoStorage === null) {
        todoItems = [];
    } else {
        todoItems = JSON.parse(todoStorage);
    }
    console.log('items', todoItems);
    getList(todoItems);
}

//add task
document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = inputItem.value.trim();
        if (itemName.length === 0) {
            alertMessage("Please Enter Task", "alert-danger");
        } else {

            const currentItemIndex = document.querySelector('#objIndex').value;
            if (currentItemIndex) {
                // update 
                updateItem(currentItemIndex, itemName);
                document.querySelector("#objIndex").value = "";
                alertMessage("Task has been updated", "alert-success");
            } else {
                const itemObj = {
                    name: itemName,
                    isDone: false,
                    addedAt: new Date().getTime()
                };
                todoItems.push(itemObj);
                setLocalStorage(todoItems);
                alertMessage("New task has been added", "alert-success");
            }
            // refresh item
            getList(todoItems)
        }
        inputItem.value = "";
    });

    // filter tabs 
    filter.forEach((tab) => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const tabType = this.getAttribute("data-type");
            document.querySelectorAll('.nav-link').forEach(nav => {
                nav.classList.remove("active");
            });
            this.firstElementChild.classList.add("active");
            getItemsFilter(tabType);
            document.querySelector("#tabValue").value = tabType;
        });
    });

    // search item 
    let searchtextbox = document.getElementById("searchtextbox");
    searchtextbox.addEventListener("input", function () {
        let lilist = document.querySelectorAll(".list-group-item");
        //element to create array
        Array.from(lilist).forEach(function (item) {
            let searchedtext = item.getElementsByTagName("span")[0].innerText;
            // console.log("item - > ",searchedtext);
            let searchtextboxval = searchtextbox.value;
            // console.log(searchtextboxval)
            let re = new RegExp(searchtextboxval, 'gi');
            // console.log(re);
            if (searchedtext.match(re)) {
                item.style.display = "block";
                // getList(item);
                console.log(item);
            }
            else {
                item.style.display = "none";
                // console.log(item);
            }
        })
    })

    // load item list 
    getLocalStorage();
});



var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function(type) {
    sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    deleteItem:function(type,id){
      var ids,index;
      ids=data.allItems[type].map(function(current){
        return current.id;
      }
      );
      index=ids.indexOf(id);
      if(index!==-1){
        data.allitems[type].splice(index,1);
      }

    },
    calculateBudget: function() {
      calculateTotal("inc");
      calculateTotal("exp");
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
    }
  };
})();

var UIcontroller = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputbtn: ".add__btn",
    incList: ".income__list",
    expList: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentLabel: ".budget__expenses--percentage",
    container:".container"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, element;
      if (type === "inc") {
        element = DOMstrings.incList;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = DOMstrings.expList;
        html =
          '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%<div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      newHtml = html;
      newHtml = newHtml.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: function() {
      var fields;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(curr, index, array) {
        curr.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentLabel).textContent = "---";
      }
    },
    getDOM: function() {
      return DOMstrings;
    }
  };
})();

var controller = (function(budgetCtrl, UIctrl) {
  var updateBudget = function() {
    budgetCtrl.calculateBudget();
    var Budget = budgetCtrl.getBudget();
    UIctrl.displayBudget(Budget);
  };
  var ctrlAddIitem = function() {
    var input = UIctrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      var newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );
      UIctrl.addListItem(newItem, input.type);
      UIctrl.clearFields();
      updateBudget();
    }
  
  };
  var ctrlDeleteItem=function(event){
    var itemId,splitId,type,ID;
    itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemId){
      splitId=itemId.split('-');
      type=splitId[0];
      ID=parseInt(splitId[1]);
    }
    budgetCtrl.deleteItem(type,ID);


    

  }
  var setUpEventListeners = function() {
    var DOM = UIctrl.getDOM();
    document
      .querySelector(DOM.inputbtn)
      .addEventListener("click", ctrlAddIitem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode == 13) {
        ctrlAddIitem();
      }
    });
    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem)
  };
  return {
    init: function() {
      setUpEventListeners();
      UIctrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
    }
  };
})(budgetController, UIcontroller);
controller.init();

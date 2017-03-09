/*----- model manipulation -----*/

var finances = {
    
    totalIncome : 0,
    totalExpenses : 0,
    availableBudget : 0,
    setAvailableBudget : function(){
                            this.availableBudget = this.totalIncome - this.totalExpenses;
                        }
};

var Income = function(description, val){
    this.id = -1;
    this.description = description;
    this.val = val;
}

Income.prototype.setID = function(id){
    this.id = id;
};

Income.prototype.isEqualTo = function(income){
    if(this.id === income.id){
        return true;
    }
    return false;
};


var Expense = function(description, val){
    this.id = -1;
    this.description = description;
    this.val = val;
}

Expense.prototype.setID = function(id){
    this.id = id;
};

Expense.prototype.isEqualTo = function(expense){
    if(this.id === expense.id){
        return true;
    }
    return false;
};

var incomeList = [];
var expenseList = [];

function setTotalIncome(){
    
    var total = 0;
    for(var i = 0; i < incomeList.length; i++){
        total += incomeList[i].val;
    }
    finances.totalIncome = total;
    finances.setAvailableBudget();
}

function setTotalExpenses(){
    
    var total = 0;
    for(var i = 0; i < expenseList.length; i++){
        total += expenseList[i].val;
    }
    finances.totalExpenses = total;
    finances.setAvailableBudget();

}

function addIncome(income){
    incomeList.push(income);
    var index = 0;
    for(var i=0; i < incomeList.length-1; i++){
        if(i > index)
            break;
        for(var j = 0; j < incomeList.length-1; j++){
            if( incomeList[j].id === i){
                index++;
                break;
            }
        }
    }
    income.setID(index);
    //console.log('adding '+index);
    finances.totalIncome += income.val;
    finances.setAvailableBudget();

}

function addExpense(expense){
    expenseList.push(expense);
    var index = 0;
    for(var i=0; i < expenseList.length; i++){
        if(i > index)
            break;
        for(var j = 0; j < expenseList.length; j++){
            if( expenseList[j].id === i){
                index++;
                break;
            }
        }
    }
    expense.setID(index);
    finances.totalExpenses += expense.val;
    finances.setAvailableBudget();

}

function removeIncome(income){
    
    for(var i = 0; i < incomeList.length; i++){
        if(income.isEqualTo(incomeList[i]))
            break;
    }
    if (i < incomeList.length) {
        incomeList.splice(i, 1);
    }
    finances.totalIncome -= income.val;
    finances.setAvailableBudget();

}

function removeExpense(expense){
    for(var i = 0; i < expenseList.length; i++){
        if(expense.isEqualTo(expenseList[i]))
            break;
    }
    if (i < expenseList.length) {
        expenseList.splice(i, 1);
    }
    finances.totalExpenses -= expense.val;
    finances.setAvailableBudget();

}

/*----- UI manipulation -----*/

var addItemButton = document.querySelector('.add__btn');

addItemButton.addEventListener('click', function(){
    
    var entry;
    var descriptionField = document.querySelector('.add__description');
    
    if(descriptionField.value == null){
        //ask to enter description
        return;
    }
    var valueField = document.querySelector('.add__value');
    if(valueField.value == null){
        //ask to enter value
        return;
    }
    var addType = document.querySelector('.add__type');
    if(addType.options[addType.selectedIndex].value === 'inc'){
        entry = new Income(descriptionField.value, valueField.value);
        addIncome(entry);
        addIncomeToUI(entry);
    }
    if(addType.options[addType.selectedIndex].value === 'exp'){
        entry = new Expense(descriptionField.value, valueField.value);
        addExpense(entry);
        addExpenseToUI(entry);
    }
    
});


function addIncomeToUI(income){
    
    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn" onclick="onDeleteClickedIncomeElement(%id%)"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    newHtml = html.replaceAll('%id%', income.id);
    newHtml = newHtml.replace('%description%', income.description);
    newHtml = newHtml.replace('%value%', income.val);
    document.querySelector('.income__list').insertAdjacentHTML('beforeend', newHtml);
    
}

function addExpenseToUI(expense){
    
    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn" onclick="onDeleteClickedExpenseElement(%id%)"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    newHtml = html.replaceAll('%id%', expense.id);
    newHtml = newHtml.replace('%description%', expense.description);
    newHtml = newHtml.replace('%value%', expense.val);
    document.querySelector('.expenses__list').insertAdjacentHTML('beforeend', newHtml);
    
}

function onDeleteClickedIncomeElement(id){
    
    var income;
    for(var i = 0; i < incomeList.length; i++){
        if(incomeList[i].id === id){
            income = incomeList[i];
            break;
        }
    }
    //console.log('removing '+income.id);
    removeIncome(income);
    removeIncomeFromUI(income);
}

function onDeleteClickedExpenseElement(id){
    
    var expense;
    for(var i = 0; i < expenseList.length; i++){
        if(expenseList[i].id === id){
            expense = expenseList[i];
            break;
        }
    }
    removeExpense(expense);
    removeExpenseFromUI(expense);
}

function removeIncomeFromUI(income){
    
    var parentDOM = document.querySelector('.income__list').getElementsByClassName('item clearfix');
    for(var i = 0; i < parentDOM.length; i++){
        var stringID = parentDOM[i].getAttribute('id');
        if(stringID.localeCompare('inc-'+income.id.toString()) === 0){
            document.querySelector('.income__list').removeChild(parentDOM[i]);
            break;
        }
    }

}

function removeExpenseFromUI(expense){
    
    var parentDOM = document.querySelector('.expenses__list').getElementsByClassName('item clearfix');
    for(var i = 0; i < parentDOM.length; i++){
        var stringID = parentDOM[i].getAttribute('id');
        if(stringID.localeCompare('exp-'+expense.id.toString()) === 0){
            document.querySelector('.expense__list').removeChild(parentDOM[i]);
            break;
        }
    }
}


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};



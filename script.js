'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
              <div class="movements__row">
              <div class="movements__type movements__type--${type}">${i} ${type}</div>
              <div class="movements__value">${mov}€</div>
            </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (accs) {
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${accs.balance} €`;
  return accs.balance;
};

//Dsiplay Summary
const calcDisplaySummary = function (accs) {
  const incomes = accs.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;
  const outIncome = accs.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(outIncome)}€`;
  const insterst = accs.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * accs.interestRate) / 100;
    })
    .filter(function (int, i, arrInst) {
      console.log(arrInst);
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `${insterst}€`;
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);
console.log(accounts);

const updateUi = function (acc) {
  //Display Movment
  displayMovements(currentAccount.movements);

  //Display Blance
  calcDisplayBalance(currentAccount);

  //Display Summary
  calcDisplaySummary(currentAccount);
};

//Login

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //Prevant form from sumbitting
  console.log('done=>Login');
  // Retive an fime userName
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input focus
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUi(currentAccount);

    console.log('Success Login');
  } else {
    console.log('Pin is incorrect ');
  }
});

// Btn transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(
    `The amount money = ${amount} and account is ${receiverAcc.username}`
  );
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log('Transfer is valid');
    // updateUI
    updateUi(currentAccount);
  }
});

// Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov => amount * 0.1)) {
    // Add movment
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

//Close button

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // Delete current account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputTransferAmount.value = inputTransferTo = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////
//Lecture
// //Slice
// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice());
// console.log(arr.slice(1));
// console.log(arr.slice(1, 3));
// //Splice
// console.log(arr.splice(2));
// console.log(arr);
// //Reverse
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'j'];
// console.log(arr2.reverse());
// console.log(arr2);
// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);
// //AT METHOD
// const arr3 = [23, 11, 4];
// console.log(arr3[0]);
// console.log(arr3.at(1));
// //FOR EACH METHOD
// const movementss = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const [i, movment] of movementss.entries()) {
//   if (movment > 0) {
//     console.log(` Movement ${i + 1} You deposited ${movment}`);
//   } else {
//     console.log(` Movement ${i + 1} You withdraw ${movment}`);
//   }
// }
// console.log('------FOR EACH-----');
// movementss.forEach(function (movment) {
//   if (movment > 0) {
//     console.log(`You deposited ${movment}`);
//   } else {
//     console.log(`You withdraw ${movment}`);
//   }
// });
//Coding Challenge #1
// const juliaData = [3, 5, 2, 12, 7];
// const KateDate = [4, 1, 15, 8, 3];

// function checkDogs(arr1, arr2) {
//   const newArray = arr1.splice();
//   newArray.splice(0, 1);
//   newArray.splice(-2);
//   console.log(newArray);
// }

// checkDogs(juliaData, KateDate);
console.log('///////////////////////////////////////');

console.log('----MAP----');
// const movementsExp = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;
//Regular Function
// const movmentUSD = movementsExp.map(function (movExp) {
//   return movExp * euroToUsd;
// });

//Arrow Function
// const movmentUSD = movementsExp.map(movExp => movExp * euroToUsd);
// console.log(movementsExp);
// console.log(movmentUSD);
// //MAP WITH FOR LOOP
// const momvmentExpFor = [];
// for (const mov of movementsExp) {
//   momvmentExpFor.push(mov * euroToUsd);
// }
// console.log(momvmentExpFor);

//

console.log('--------Filter--------');
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposit = movements.filter(function (mov, index, arrw) {
//   console.log(` index : ${index + 1}`);
//   console.log(` array =>${arrw}`);

//   return mov > 0;
// });
// console.log(movements);
// console.log(deposit);
// const depositFor = [];
// for (const mov of movements)
//   if (mov > 0) {
//     depositFor.push(mov);
//   }
// console.log(`New Array ${depositFor}`);
console.log('------for Of WithDrawels-----');
// const withdrawlsFor = [];
// for (const mov of movements) if (mov < 0) withdrawlsFor.push(mov);

// console.log(withdrawlsFor);
// console.log('------Filter WithDrawels With Arrow Function -----');
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);
console.log('--------Reduce--------');
console.log('--------Elzero Example Reduce--------');
// let nums = [10, 20, 15, 30];
// let add = nums.reduce(function (acc, current, index, array) {
//   console.log(`Acc =>${acc}`);
//   console.log(`current =>${current}`);
//   console.log(`index =>${index}`);
//   console.log(`array =>${array}`);
//   console.log(acc + current);
//   return acc + current;
// }, 5);
// console.log('--------Jonas Example Reduce--------');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);
console.log('--------Jonas Example Reduce 2 For loob--------');
// let blance2 = 0;
// for (const mov of movements) blance2 += mov;
// console.log(blance2);
console.log('Coding Challing');
//1-

const Calc = function calcAverageHumanAge(ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAge.filter(age => age >= 18);

  //Reduce Arrow Function
  const avgHumanAgeArrow =
    adults.reduce((acc, age) => acc + age, 0) / adults.length;
  console.log(humanAge);
  console.log(avgHumanAgeArrow);

  //Reduce Regular Function

  const avgHumanAgeRegular = adults.reduce(function (acc, age) {
    return acc + age / adults.length;
  }, 0);
  return avgHumanAgeRegular;
};
const avg1 = Calc([5, 2, 4, 1, 15, 8, 3]);
const avg2 = Calc([16, 6, 10, 5, 6, 1, 4]);
console.log(`avg1 => ${avg1} , avg2 => ${avg2}`);

// const deposit = movements.filter(function (mov, index, arrw) {
//   console.log(` index : ${index + 1}`);
//   console.log(` array =>${arrw}`);

//   return mov > 0;
// });

//AnotherWay
// const humanAge = 0;
// const calcTwo = function calcAverageHumanAge2(ages) {
//   if (ages <= 2) {
//     ages.map(function (age) {
//       return age * 2;
//     });
//   } else {
//     ages.map(function (age) {
//       return 16 + age * 4;
//     });
//   }
// };
// console.log(calcTwo([5, 2, 4, 1, 15, 8, 3]));
console.log('------Find Method------');
//Find Method = > its make loop and get first value based on condition
console.log('Example-One');
const firstWithdrawl = movements.find(mov => mov < 0);
console.log(movements);
console.log(`firstWithdrawl => ${firstWithdrawl}`);
console.log('Example-Two');
const account = accounts.find(function (acc) {
  return acc.owner === 'Jessica Davis';
});
console.log(account);
console.log('------some Method------ upon condition');
const anyDeposits = movements.some(mov => mov > 5000);
console.log(anyDeposits);
//Every
console.log('Every');
console.log(movements.every(mov => mov > 0));

const exp = movements.every(function (mov) {
  return mov > 0;
});
console.log(exp);
console.log('Sorting');
const owners = ['jonas', 'zach', 'adam', 'martha'];
console.log(owners.sort());
console.log(movements);
movements.sort();

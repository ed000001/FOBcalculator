'use strict'

let auctionList = document.getElementById("auction-list")
let optionForAuction = document.createElement("option")
let optionForBid = document.querySelector('.bid-amount')
let optionForPortJapan = document.createElement("option")
let btnCalculate = document.getElementById('btn-calculate')
let selectType = document.querySelector('.selectType')
let selectCurrency = document.querySelector('.selectCurrency')
let totalSumElement = document.getElementById('total-sum')
let displayFob = document.getElementById("display-fob")
let displayContainerPrice = document.getElementById("display-container-price")
let displayInfo = document.getElementById('display-info')
let displayFee = document.getElementById('display-additional-fee')
let arr1 = []
let JPY;

fetch('https://spreadsheets.google.com/feeds/cells/1Zxx_Js8KAt9ZkJvlG71tXlMaLvU-AtBrpAZsNM9q3Jk/1/public/full?alt=json')
.then (data => data.json())
.then(data => getData(data.feed.entry))

fetch('https://api.exchangeratesapi.io/latest?base=USD')
//fetch('http://data.fixer.io/api/latest?379b06ec79cabdc681902f53a0841ea3')
.then(data => data.json())
.then(data => JPY = data.rates.JPY)

function getData(arr) {
    arr1 = []
    for (let i=0; i<arr.length; i++){
        if(arr[i]){
            arr1.push(arr[i].gs$cell)
        }
    } 
    let filteredArrforAuctionList = arr1.filter(i => i.col == 1 && i.row > 1 && i.row < 126).map(i => i.inputValue)

    for (let i=0 ; i < filteredArrforAuctionList.length; i++){
        let textNode = document.createTextNode(filteredArrforAuctionList[i]);
        optionForAuction.appendChild(textNode) 
        auctionList.appendChild(optionForAuction)
        optionForAuction = document.createElement("option")
    }
}

btnCalculate.onclick = btnOnClickCaculation

function btnOnClickCaculation(){
    let containerPrice;
    let fob;
    let bidYen;
    let bidDollar;
    let serviceFee
   
    if(selectCurrency.value == 'Dollar'){
        bidDollar = optionForBid.value;
        bidYen = (optionForBid.value * JPY).toFixed(2)
    } else {
        bidYen = optionForBid.value 
        bidDollar = (optionForBid.value / JPY).toFixed(0)
    }

    console.log(bidDollar)

   let filteredCarType =  arr1.filter(i => i.col >= 4 && i.col <=5 )
   let filteredAuctionList = arr1.filter(i => i.col >= 7 && i.col <=10 )
   let filteredServiceFee = arr1.filter(i => i.col >=13 && i.col <=14)


   
   if(bidYen <= 1000000){
    serviceFee = filteredServiceFee[2].inputValue 
    displayFee.innerHTML = `$ ${serviceFee}`
   } else if(bidYen <= 1500000) {
    serviceFee = filteredServiceFee[4].inputValue
    displayFee.innerHTML = `$ ${serviceFee}`
   } else if(bidYen <= 2000000) {
       serviceFee = filteredServiceFee[6].inputValue 
    displayFee.innerHTML = `$ ${serviceFee}`
   } else  {
    serviceFee = filteredServiceFee[8].inputValue
    displayFee.innerHTML = `$ ${serviceFee}`
   }

    if(selectType.value) {
        for (let i = 0; i < filteredCarType.length; i++){
            if(filteredCarType[i].inputValue == selectType.value){
                containerPrice = filteredCarType[i+1].inputValue
                break
            }
        }
    } 

    if(auctionList.value){
        if(selectType.value == 'Minivan, Big SUV' || selectType.value == 'Small SUV' ){
        for (let i = 0; i < filteredAuctionList.length; i++){
            if(filteredAuctionList[i].inputValue == auctionList.value){
                fob = +filteredAuctionList[i+2].inputValue
                break
            }
        }
    } else {
        for (let i = 0; i < filteredAuctionList.length; i++){
            if(filteredAuctionList[i].inputValue == auctionList.value){
                fob = +filteredAuctionList[i+3].inputValue
                break
            }
        }
    }
}

    if(!isNaN(fob)){
        displayFob.innerHTML =  `$  ${+fob}`
    }else if(auctionList.value) {
        displayFob.innerHTML = '-';
        displayInfo.innerHTML = "Please contact us for more information"
    }
    if(!isNaN(containerPrice)){
        displayContainerPrice.innerHTML = `$  ${+containerPrice}`
    }else {
        displayContainerPrice.innerHTML = '-'
    }

    let totalSum = fob + +containerPrice

    if(totalSum && auctionList.value && selectType.value){
        totalSumElement.innerHTML = `$ ${(fob + +containerPrice + +bidDollar + +serviceFee)}`;
        displayInfo.innerHTML = null;
    } else {
        displayFee.innerHTML = '-'
        totalSumElement.innerHTML = '-'
    }
}
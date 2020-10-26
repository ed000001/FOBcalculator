'use strict'

let auctionList = document.getElementById("auction-list")
let optionForAuction = document.createElement("option")
let optionForBid = document.querySelector('.bid-amount')
let optionForPortJapan = document.createElement("option")
let btnCalculate = document.getElementById('btn-calculate')
let selectType = document.querySelector('.selectType')
let totalSumElement = document.getElementById('total-sum')
let displayFob = document.getElementById("display-fob")
let displayContainerPrice = document.getElementById("display-container-price")
let displayInfo = document.getElementById('display-info')
let displayFee = document.getElementById('display-additional-fee')
let arr1 = []

fetch('https://spreadsheets.google.com/feeds/cells/1Zxx_Js8KAt9ZkJvlG71tXlMaLvU-AtBrpAZsNM9q3Jk/1/public/full?alt=json')
.then (data => data.json())
.then(data => getData(data.feed.entry))


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
   

   let filteredCarType =  arr1.filter(i => i.col >= 4 && i.col <=5 )
   let filteredAuctionList = arr1.filter(i => i.col >= 7 && i.col <=10 )
   let filteredServiceFee = arr1.filter(i => i.col >=13 && i.col <=14)

   console.log(optionForBid.value)

   
   if(optionForBid.value < 10000){
    displayFee.innerHTML = filteredServiceFee[2].inputValue
   } else if(optionForBid.value < 14300) {
    displayFee.innerHTML = filteredServiceFee[4].inputValue
   } else if(optionForBid.value < 19000) {
    displayFee.innerHTML = filteredServiceFee[6].inputValue
   } else  {
    displayFee.innerHTML = filteredServiceFee[8].inputValue
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
        displayFob.innerHTML = +fob
    }else if(auctionList.value) {
        displayFob.innerHTML = '-';
        displayInfo.innerHTML = "Please contact us for more information"
    }
    if(!isNaN(containerPrice)){
        displayContainerPrice.innerHTML = +containerPrice
    }else {
        displayContainerPrice.innerHTML = '-'
    }

    let totalSum = fob + +containerPrice

    if(totalSum && auctionList.value && selectType.value){
        totalSumElement.innerHTML = `$ ${fob + +containerPrice + +optionForBid.value}`;
        displayInfo.innerHTML = null;
    } else {
        displayFee.innerHTML = '-'
        totalSumElement.innerHTML = '-'
    }
}
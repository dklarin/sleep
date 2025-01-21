Dodavanje novog radnog naloga

<pre>
mutation {
  addWorkOrder(woId: 3, clientName: "Neki klijent", device: "Uređaj") {
    woId
    clientName
    clientEmail
    device
    spentTime
    carBool
    parkingBool
    totalAmount
    dueDate
  }
}
</pre>

yarn install
yarn run serve

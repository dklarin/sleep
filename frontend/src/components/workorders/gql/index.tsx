import gql from "graphql-tag";

export const ADDWORKORDER = gql`
  mutation(
    $woId: Int
    $dateBegin: Date
    $dateEnd: Date
    $clientName: String
    $clientEmail: String
    $device: String
    $status: String
    $description: String
    $timeBegin: String
    $timeEnd: String
    $spentTime: String
    $carBool: String
    $parkingBool: String
    $interrupter: Boolean
    $part1: String
    $part2: String
    $part3: String
    $price1: String
    $price2: String
    $price3: String
    $totalAmount: String
  ) {
    addWorkOrder(
      woId: $woId
      dateBegin: $dateBegin
      dateEnd: $dateEnd
      clientName: $clientName
      clientEmail: $clientEmail
      device: $device
      status: $status
      description: $description
      timeBegin: $timeBegin
      timeEnd: $timeEnd
      spentTime: $spentTime
      carBool: $carBool
      parkingBool: $parkingBool
      interrupter: $interrupter
      part1: $part1
      part2: $part2
      part3: $part3
      price1: $price1
      price2: $price2
      price3: $price3
      totalAmount: $totalAmount
    ) {
      woId
      clientName
    }
  }
`;

export const UPDATEWORKORDER = gql`
  mutation(
    $woId: Int
    $dateBegin: Date
    $dateEnd: Date
    $clientName: String
    $clientEmail: String
    $device: String
    $status: String
    $description: String
    $timeBegin: String
    $timeEnd: String
    $spentTime: String
    $carBool: String
    $parkingBool: String
    $interrupter: Boolean
    $part1: String
    $part2: String
    $part3: String
    $price1: String
    $price2: String
    $price3: String
    $totalAmount: String
  ) {
    updateWorkOrder(
      woId: $woId
      dateBegin: $dateBegin
      dateEnd: $dateEnd
      clientName: $clientName
      clientEmail: $clientEmail
      device: $device
      status: $status
      description: $description
      timeBegin: $timeBegin
      timeEnd: $timeEnd
      spentTime: $spentTime
      carBool: $carBool
      parkingBool: $parkingBool
      interrupter: $interrupter
      part1: $part1
      part2: $part2
      part3: $part3
      price1: $price1
      price2: $price2
      price3: $price3
      totalAmount: $totalAmount
    ) {
      woId
      clientName
    }
  }
`;

export const GETWORKORDER = gql`
  query(
    $woId: Int
    $dateBegin: Date
    $clientName: String
    $status: String
    $description: String
    $dueDate1: Date
  ) {
    getWorkOrder(
      woId: $woId
      dateBegin: $dateBegin
      clientName: $clientName
      status: $status
      description: $description
      dueDate1: $dueDate1
    ) {
      woId
      dateBegin
      dateEnd
      clientName
      clientEmail
      device
      status
      description
      timeBegin
      timeEnd
      spentTime
      carBool
      parkingBool
      interrupter
      part1
      part2
      part3
      price1
      price2
      price3
      totalAmount
    }
  }
`;

export const REMOVEWORKORDER = gql`
  mutation($woId: Int) {
    removeWorkOrder(woId: $woId) {
      woId
    }
  }
`;

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Formik } from "formik";
import Select from "react-select";
import moment from "moment";
import {
  Wrapper,
  GridContainer,
  LeftGridContainer,
  RightGridContainer,
  MainHeader,
  FlexRow,
  FlexColumn,
  ButtonContainer,
  Label,
} from "../../style/global-style";
import { StyledTimePicker } from "./style/workorderchange";
import { Button } from "../../ui/button";
import DatePicker from "../../ui/datePicker";
import { TextInput } from "../../ui/textInput";
import { TextArea } from "../../ui/textArea";

import { GETWORKORDER, UPDATEWORKORDER } from "./gql";
import { formatDate, pastFutureDates, viewDate } from "./functions";
import { yesNoOptions, statusOptions } from "./options";
import { colorPalette } from "../../style/theme";
import styled from "styled-components";

import { TextInputPart } from "../../ui/textInputPart/index";
import { ToggleSwitch } from "../../ui";

export const WorkOrderChange = (props) => {
  const user = localStorage.getItem("username");

  const [state, setState] = useState({ itemArray: [] });
  const [count, setCount] = useState(1);

  let numOfParts = 1;

  let { id } = useParams();

  const initialQueryVariables = {
    woId: null,
    dateBegin: pastFutureDates(-1095),
    dueDate1: pastFutureDates(1),
  };

  const [queryVariables] = useState(initialQueryVariables);
  const { data } = useQuery(GETWORKORDER, {
    variables: queryVariables,
  });
  const [change] = useMutation(UPDATEWORKORDER);

  let item;
  let clientName = "";
  let clientEmail = "";
  let dateBegin = null;
  let dateEnd = null;
  let carSelect = "";
  let parkingBool = "";
  let description = "";
  let timeBegin = null;
  let timeEnd = null;
  let interrupter = false;
  let part = {
    part1: "",
    part2: "",
    part3: "",
  };
  let part1 = "";
  let part2 = "";
  let part3 = "";
  let price = {
    price1: "",
    price2: "",
    price3: "",
  };

  let statusSelect = "";
  let device = "";

  if (data && data.getWorkOrder) {
    item = data.getWorkOrder[id - 1];
    clientName = item.clientName;
    clientEmail = item.clientEmail;
    dateBegin = new Date(viewDate(item.dateBegin));
    dateEnd = new Date(viewDate(item.dateEnd));
    carSelect = item.carBool;
    parkingBool = item.parkingBool;
    description = item.description;
    timeBegin = moment(item.timeBegin);
    timeEnd = moment(item.timeEnd);

    interrupter = item.interrupter;
    //setNotice(item.interrupter);

    part = {
      part1: item.part1,
      part2: item.part2,
      part3: item.part3,
    };
    part1 = item.part1;
    part2 = item.part2;
    part3 = item.part3;

    price = {
      price1: item.price1,
      price2: item.price2,
      price3: item.price3,
    };

    statusSelect = item.status;
    device = item.device;
  }

  const [notice, setNotice] = useState(interrupter);

  let carBase;
  carSelect === "Da"
    ? (carBase = yesNoOptions[0])
    : (carBase = yesNoOptions[1]);

  let statusBase;
  if (statusSelect === "Otvoren") {
    statusBase = statusOptions[0];
  } else if (statusSelect === "Dodijeljen") {
    statusBase = statusOptions[1];
  } else if (statusSelect === "U radu") {
    statusBase = statusOptions[2];
  } else {
    statusBase = statusOptions[3];
  }

  const [car, setCar] = useState(carBase);
  const [status, setStatus] = useState(statusBase);

  /**
   * calculates time * price
   * @param {*} spentTime
   */
  const handleMoney = (spentTime) => {
    let workPrice;
    if (clientName === "Algebra " || clientName === "MCPA ") {
      workPrice = 50 / 60;
    } else {
      workPrice = 100 / 60;
    }
    let timePrice = parseInt(spentTime) * workPrice;
    return timePrice;
  };

  /**
   * function that handles spent time in work order
   */
  const handleTime = (item) => {
    let start = new Date(item.timeBegin);
    let end = new Date(item.timeEnd);
    let totalTime = new Date(end - start);
    let spentTime = (totalTime.getHours() - 1) * 60 + totalTime.getMinutes();
    return spentTime;
  };

  /**
   * function that handles if car is used or not
   * @param {*} item
   */
  const handleCar = (item) => {
    if (item != null) {
      setCar(item);
    }
  };

  /**
   * handles status and passes arg to function for e-mail notification (if e-mail is known)
   * @param {*} item
   */
  const handleStatus = (item) => {
    if (item != null) {
      setStatus(item);
    }
  };

  const createTextInput = () => {
    numOfParts++;

    let title = "";
    let titlePrice = "";
    if (numOfParts === 4) {
      title = "part" + 3;
      titlePrice = "price" + 3;
    } else if (count < 4 && numOfParts !== 4) {
      title = "part" + count;
      titlePrice = "price" + count;
    }

    if (count < 4 && numOfParts < 4) {
      const item = state.itemArray;

      const text = "";
      const textPrice = "";
      item.push({ title, text, titlePrice, textPrice });
      setState({ itemArray: item });
      setCount(count + 1);
    } else if (count === 2 && numOfParts === 4) {
      const item = state.itemArray;

      const text = "";
      const textPrice = "";
      item.push({ title, text, titlePrice, textPrice });
      setState({ itemArray: item });
      setCount(count + 1);
    }
  };

  const handleNotification = () => {
    setNotice(!notice);
  };
  /*const createTextInputOnLoad = useCallback(
    (sika) => {
      const create = (sika) => {
        if (count < 2) {
          const item = state.itemArray;
          const title = "part" + numOfParts;
          const text = typeof sika === "string" ? sika : "";
          item.push({ title, text });
          setState({ itemArray: item });
          setCount(count + 1);
        }
      };

      if (sika.part1 !== "") {
        create(sika.part1);
        numOfParts++;
      }
      if (sika.part2 !== "") {
        create(sika.part2);
        numOfParts++;
      }
      if (sika.part3 !== "") {
        create(sika.part3);
        numOfParts++;
      }
    },
    [numOfParts, count, state.itemArray]
  );*/

  const createTextInputOnLoad = useCallback(
    (sika, otok) => {
      const create = (sika, otok) => {
        if (count < 2) {
          const item = state.itemArray;
          const title = "part" + numOfParts;
          const text = typeof sika === "string" ? sika : "";
          const titlePrice = "price" + numOfParts;
          const textPrice = otok;
          item.push({ title, text, titlePrice, textPrice });
          setState({ itemArray: item });
          setCount(count + 1);
        }
      };

      if (sika.part1 !== "") {
        create(sika.part1, otok.price1);
        numOfParts++;
      }
      if (sika.part2 !== "") {
        create(sika.part2, otok.price2);
        numOfParts++;
      }
      if (sika.part3 !== "") {
        create(sika.part3, otok.price3);
        numOfParts++;
      }
    },
    [numOfParts, count, state.itemArray]
  );

  useEffect(() => {
    if (part1 !== "") {
      createTextInputOnLoad(part, price);
    }
  }, [part, part1, price, createTextInputOnLoad]);

  return data && data.getWorkOrder ? (
    <div>
      <Formik
        initialValues={{
          jobId: id,
          startDate: dateBegin,
          endDate: dateEnd,
          jobUser: clientName,
          clientEmail: clientEmail,
          device: device,
          description: description,
          timeBegin: timeBegin,
          timeEnd: timeEnd,
          jobParking: parkingBool,
          part1: part1,
          part2: part2,
          part3: part3,
          price1: price.price1,
          price2: price.price2,
          price3: price.price3,
        }}
        onSubmit={(values, { setSubmitting }) => {
          let total = 0;
          let carCost = 0;
          let parkingCost = 0;

          if (car.value === "Da") {
            carCost = 28;
          }

          if (values.jobParking !== "") {
            parkingCost = parseInt(values.jobParking);
          }

          let spentTime = handleTime(values);
          let moneyValue = handleMoney(spentTime);
          total = carCost + parkingCost + moneyValue;

          const content = {
            woId: parseInt(values.jobId),
            dateBegin: values.startDate,
            dateEnd: values.endDate,
            clientName: values.jobUser,
            clientEmail: values.clientEmail,
            device: values.device,
            status: status.value,
            description: values.description,
            timeBegin: values.timeBegin,
            timeEnd: values.timeEnd,
            spentTime: spentTime.toString(),
            carBool: car.value,
            parkingBool: values.jobParking,
            interrupter: notice,
            part1: values.part1,
            part2: values.part2,
            part3: values.part3,
            price1: values.price1,
            price2: values.price2,
            price3: values.price3,
            totalAmount: Math.round(total).toString(),
          };

          console.log("kdkfksdf" + notice);

          console.log(values);

          setSubmitting(false);

          change({ variables: content });
          props.history.push("/workorders");
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Wrapper>
              <GridContainer>
                <LeftGridContainer></LeftGridContainer>
                <RightGridContainer>
                  <MainHeader style={{ marginTop: "5px" }}>
                    <FlexRow>
                      <FlexColumn>IZMJENA NALOGA</FlexColumn>
                      <FlexRow>
                        <FlexColumn>{user}</FlexColumn>
                      </FlexRow>
                    </FlexRow>
                  </MainHeader>
                  <WrapperRight>
                    <GridContainerRight>
                      <Divljak>
                        <FlexColumn>
                          <FlexRow>
                            <FlexColumn>
                              <Label>Redni broj</Label>
                              <TextInput
                                type="text"
                                name="jobId"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.jobId}
                                style={{ width: 60 }}
                                disabled={true}
                              />
                            </FlexColumn>
                            <FlexColumn>
                              <Label>Datum početka</Label>{" "}
                              <div style={{ width: "120px" }}>
                                <DatePicker
                                  value={new Date(values.startDate)}
                                  onChange={(date) =>
                                    setFieldValue("startDate", date)
                                  }
                                  date={formatDate(new Date())}
                                />
                              </div>
                            </FlexColumn>
                          </FlexRow>

                          <FlexColumn>
                            <Label>IME I PREZIME</Label>
                            <TextInput
                              style={{ width: "90%" }}
                              type="text"
                              name="jobUser"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.jobUser}
                            />
                            <Label>E-MAIL</Label>
                            <TextInput
                              style={{ width: "90%" }}
                              type="text"
                              name="clientEmail"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.clientEmail}
                            />
                            <TextInput
                              style={{ width: "90%", marginTop: "20px" }}
                              type="text"
                              name="device"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.device}
                            />
                            <Label>STATUS</Label>
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              defaultValue={status}
                              isDisabled={false}
                              isLoading={false}
                              isClearable={false}
                              name="status"
                              options={statusOptions}
                              onChange={handleStatus}
                              styles={statusStyles}
                              theme={(theme) => ({
                                ...theme,
                                borderRadius: 4,
                                border: "1px solid",
                                colors: {
                                  ...theme.colors,
                                  primary25: colorPalette.primary55,
                                  primary: colorPalette.primary100,
                                },
                              })}
                            />
                            <Label>OPIS PROBLEMA</Label>
                            <TextArea
                              type="text"
                              name="description"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.description}
                              style={{ width: "90%", resize: "none" }}
                              rows={5}
                            />
                            {errors.description &&
                              touched.description &&
                              errors.description}
                          </FlexColumn>
                        </FlexColumn>
                      </Divljak>
                      {/**** Desni dio ****/}
                      <Divljak>
                        <FlexColumn>
                          <FlexRow>
                            <FlexColumn style={{ marginLeft: "20px" }}>
                              {" "}
                              <Label>POČETAK</Label>
                              <StyledTimePicker
                                style={{ width: 120 }}
                                showSecond={false}
                                className="form-control"
                                name="timeBegin"
                                defaultValue={values.timeBegin}
                                onChange={(tajm) =>
                                  setFieldValue("timeBegin", tajm)
                                }
                              />
                            </FlexColumn>
                            <FlexColumn>
                              <Label>KRAJ</Label>

                              <StyledTimePicker
                                style={{ width: 120 }}
                                showSecond={false}
                                className="form-control"
                                name="timeEnd"
                                defaultValue={values.timeEnd}
                                onChange={(tajm) =>
                                  setFieldValue("timeEnd", tajm)
                                }
                              />
                            </FlexColumn>
                            <FlexColumn>
                              <Label>Datum kraj</Label>{" "}
                              <div style={{ width: "140px" }}>
                                <DatePicker
                                  value={new Date(values.endDate)}
                                  onChange={(date) =>
                                    setFieldValue("endDate", date)
                                  }
                                  date={formatDate(new Date())}
                                />
                              </div>
                            </FlexColumn>
                          </FlexRow>
                          <FlexRow style={{ marginTop: "-15px" }}>
                            <FlexColumn style={{ marginLeft: "20px" }}>
                              <Label>Automobil</Label>
                              <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={carBase}
                                isDisabled={false}
                                isLoading={false}
                                isClearable={false}
                                name="jobCar"
                                options={yesNoOptions}
                                onChange={handleCar}
                                styles={customStyles}
                                theme={(theme) => ({
                                  ...theme,
                                  borderRadius: 4,
                                  border: "1px solid",
                                  colors: {
                                    ...theme.colors,
                                    primary25: colorPalette.primary55,
                                    primary: colorPalette.primary100,
                                  },
                                })}
                              />
                            </FlexColumn>
                            <FlexColumn>
                              {" "}
                              <Label>Parkiranje</Label>
                              <TextInput
                                type="text"
                                name="jobParking"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.jobParking}
                                style={{ width: 105 }}
                              />
                            </FlexColumn>
                          </FlexRow>
                          <FlexRow style={{ marginLeft: "21px" }}>
                            <Button type="button" onClick={createTextInput}>
                              Dodaj materijal
                            </Button>
                            <div
                              style={{ marginLeft: "21px", marginTop: "10px" }}
                            >
                              <ToggleSwitch
                                value={notice}
                                onChange={handleNotification}
                              />
                            </div>
                          </FlexRow>
                          <div style={{ marginLeft: "26px" }}>
                            {state.itemArray.map((item, index) => {
                              return notice ? (
                                <div
                                  className="box"
                                  key={index}
                                  style={{ marginTop: "23px" }}
                                >
                                  <TextInput
                                    type="text"
                                    name={item.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue={item.text}
                                    value={values.part}
                                    style={{ width: "92%" }}
                                  />
                                </div>
                              ) : (
                                <FlexRow key={index}>
                                  <TextInputPart
                                    name={item.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    defaultValue={item.text}
                                    value={values.part}
                                    width={"300px"}
                                  />
                                  <div style={{ marginLeft: "10px" }}>
                                    <TextInputPart
                                      name={item.titlePrice}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      defaultValue={item.textPrice}
                                      value={values.price}
                                      width={"50px"}
                                    />
                                  </div>
                                </FlexRow>
                              );
                            })}
                          </div>
                        </FlexColumn>
                      </Divljak>
                    </GridContainerRight>
                  </WrapperRight>
                  <ButtonContainer>
                    <FlexRow>
                      <Button type="submit" disabled={isSubmitting}>
                        Ažuriraj
                      </Button>
                      <Button
                        type="button"
                        onClick={() => props.history.push("/workorders")}
                      >
                        Odustani
                      </Button>
                    </FlexRow>
                    <div style={{ height: "50px" }}></div>
                  </ButtonContainer>
                </RightGridContainer>
              </GridContainer>
            </Wrapper>
          </form>
        )}
      </Formik>
    </div>
  ) : null;
};

export const WrapperRight = styled.div`
  margin-top: 0em;
  margin-left: 0em;
  width: 100%;
`;

export const GridContainerRight = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
`;

export const Divljak = styled.div`
  border: 0px solid;
  width: 100%;
`;

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    width: 120,

    boxShadow: state.isFocused ? `0 0 5px ${colorPalette.primary100}` : null,
    borderColor: state.isFocused ? colorPalette.primary100 : null,
  }),
  control: (base) => ({
    ...base,

    "&:hover": {
      //borderColor: colorPalette.primary100,
      border: `1px solid ${colorPalette.primary100}`,
    },
  }),
};

const statusStyles = {
  container: (provided, state) => ({
    ...provided,
    width: "94%",
    boxShadow: state.isFocused ? `0 0 10px ${colorPalette.primary100}` : null,
    borderColor: state.isFocused ? colorPalette.primary100 : null,
  }),
  control: (base) => ({
    ...base,

    "&:hover": {
      //borderColor: colorPalette.primary100,
      border: `1px solid ${colorPalette.primary100}`,
    },
  }),
};

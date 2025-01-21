import React, { useState, useEffect } from "react";
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
import { GETWORKORDER, ADDWORKORDER } from "./gql";
import { GETCLIENTS } from "./popups/gql";
import { formatDate, pastFutureDates, dynamicSort } from "./functions";
import { yesNoOptions, statusOptions } from "./options";
import { colorPalette } from "../../style/theme";
import { WorkOrderNewValidation } from "./validation";
import { PopupClientNew, PopupClientDelete } from "./popups";
import styled from "styled-components";

import { TextInputPart } from "../../ui/textInputPart/index";
import { ToggleSwitch } from "../../ui";

export const WorkOrderNew = (props) => {
  const user = localStorage.getItem("username");

  let drugiPrekidac = false;

  const [state, setState] = useState({ itemArray: [] });
  const [count, setCount] = useState(1);
  const [notice, setNotice] = useState(false);

  const initialQueryVariables = {
    woId: null,
    dateBegin: pastFutureDates(-1095),
    dueDate1: pastFutureDates(1),
  };

  const [queryVariables] = useState(initialQueryVariables);
  const { data } = useQuery(GETWORKORDER, {
    variables: queryVariables,
  });
  const { data: clients, refetch } = useQuery(GETCLIENTS);
  const [change] = useMutation(ADDWORKORDER);

  const [id, setId] = useState();
  const [mail, setMail] = useState("");

  const [car, setCar] = useState(yesNoOptions[0].value);
  const [status, setStatus] = useState(statusOptions[0].value);
  const [clientName, setClientName] = useState("");
  const [popupNew, setPopupNew] = useState(false);
  const [popupDelete, setPopupDelete] = useState(false);
  var clientOptions = [];

  useEffect(() => {
    if (data && data.getWorkOrder) {
      setId(data.getWorkOrder.length + 1);
    }
  }, [data]);

  if (clients && clients.getClients) {
    for (let i = 0; i < clients.getClients.length; i++) {
      clientOptions.push({
        value: clients.getClients[i].clientId,
        label:
          clients.getClients[i].firstName +
          " " +
          clients.getClients[i].lastName,
      });
      clientOptions.sort(dynamicSort("label"));
    }
  }

  const togglePopup = () => {
    setPopupNew(true);
  };

  const togglePopupDelete = () => {
    setPopupDelete(true);
  };

  const togglePopupClose = () => {
    refetch(GETCLIENTS);
    setPopupNew(false);
  };

  const togglePopupDeleteClose = () => {
    setPopupDelete(false);
  };

  /**
   * handles if car is used or not
   * @param {*} item
   */
  const handleCar = (item) => {
    if (item != null) {
      setCar(item.value);
    }
  };

  /**
   * handles status of work order
   * @param {*} item
   */
  const handleStatus = (item) => {
    if (item != null) {
      setStatus(item.value);
    }
  };

  /**
   * puts clients name (and e-mail) on work order
   * @param {*} item
   */
  const handleClient = (item) => {
    let user = clients.getClients[item.value - 1];

    console.log("Korisnik: " + user.firstName);
    if (item != null) {
      setClientName(user.firstName + " " + user.lastName);
      setMail(user.clientEmail);
    }
  };

  /*const createTextInput = () => {
    if (count < 4) {
      const item = state.itemArray;
      const title = "part" + count;
      const text = "";
      item.push({ title, text });
      setState({ itemArray: item });
      setCount(count + 1);
    }
  };*/

  const createTextInput = () => {
    if (count < 4) {
      const item = state.itemArray;
      const title = "part" + count;
      const text = "";
      const titlePrice = "price" + count;
      const textPrice = "";
      item.push({ title, text, titlePrice, textPrice });
      setState({ itemArray: item });
      setCount(count + 1);
    }
  };

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
    let start = new Date(item.timeStart);
    let end = new Date(item.timeEnd);
    let totalTime = new Date(end - start);
    let spentTime = (totalTime.getHours() - 1) * 60 + totalTime.getMinutes();
    return spentTime;
  };

  const handleNotification = () => {
    setNotice(!notice);
  };

  return (
    <div>
      <Formik
        initialValues={{
          jobId: id,
          startDate: new Date(),
          endDate: new Date(),
          jobUser: "",
          clientEmail: "",
          device: "",
          description: "",
          timeStart: moment(),
          timeEnd: moment(),
          jobCar: "",
          jobParking: "",
          part1: "",
        }}
        validationSchema={WorkOrderNewValidation}
        onSubmit={(values, { setSubmitting }) => {
          let total = 0;
          let carCost = 0;
          let parkingCost = 0;

          setMail(values.clientEmail);

          if (car === "Da") {
            carCost = 28;
          }

          if (values.jobParking !== "") {
            parkingCost = parseInt(values.jobParking);
          }

          let spentTime = handleTime(values);
          let moneyValue = handleMoney(spentTime);
          total =
            carCost +
            parkingCost +
            moneyValue +
            parseInt(values.price1) +
            parseInt(values.price2) +
            parseInt(values.price1);

          console.log("Notice: " + notice);

          const content = {
            woId: id,
            dateBegin: values.startDate,
            dateEnd: values.endDate,
            clientName: clientName,
            clientEmail: mail,
            device: values.device,
            status: status,
            description: values.description,
            timeBegin: values.timeStart,
            timeEnd: values.timeEnd,
            spentTime: spentTime.toString(),
            carBool: car,
            parkingBool: values.jobParking,
            interrupter: notice,
            part1: values.part1,
            part2: values.part2 !== undefined ? values.part2 : "",
            part3: values.part3 !== undefined ? values.part3 : "",
            price1: values.price1,
            price2: values.price2,
            price3: values.price3,
            totalAmount: total.toString(),
          };

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
        }) => (
          <form onSubmit={handleSubmit}>
            <Wrapper>
              <GridContainer>
                <LeftGridContainer />
                <RightGridContainer>
                  <MainHeader style={{ marginTop: "5px" }}>
                    <FlexRow>
                      <FlexColumn>NOVI NALOG</FlexColumn>
                      <FlexRow>
                        <FlexColumn>{user}</FlexColumn>
                      </FlexRow>
                    </FlexRow>
                  </MainHeader>
                  <WrapperRight>
                    <GridContainerRight>
                      <Divljak>
                        <FlexColumn>
                          {/**** Redni broj i Datum zaprimanja ****/}
                          <FlexRow>
                            <FlexColumn>
                              <Label>Redni broj</Label>
                              <TextInput
                                type="text"
                                name="jobId"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={id || ""}
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
                          {/**** Klijent ****/}
                          <FlexRow>
                            <FlexColumn>
                              <Label>Odabir klijenta</Label>
                              <Select
                                className="basic-single"
                                classNamePrefix="select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={false}
                                name="client"
                                options={clientOptions}
                                onChange={(client) =>
                                  setFieldValue("client", client.label) &&
                                  handleClient(client)
                                }
                                styles={clientStyles}
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
                            <FlexColumn
                              style={{
                                alignItems: "flex-end",
                              }}
                            >
                              <FlexRow
                                style={{
                                  marginTop: "18px",
                                  marginLeft: "-70px",
                                }}
                              >
                                <Button
                                  type="button"
                                  onClick={() => togglePopup()}
                                >
                                  Novi klijent
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => togglePopupDelete()}
                                >
                                  Obriši klijenta
                                </Button>
                              </FlexRow>
                            </FlexColumn>
                          </FlexRow>
                          <FlexColumn style={{ marginLeft: "0px" }}>
                            <div style={{ marginTop: "0px" }}>
                              {/*<Label>IME I PREZIME</Label>*/}
                              <TextInput
                                style={{ width: "90%" }}
                                type="text"
                                name="jobUser"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={clientName}
                              />
                            </div>
                            {/*<Label>E-MAIL</Label>*/}
                            <div style={{ marginTop: "20px" }}>
                              <TextInput
                                style={{ width: "90%" }}
                                type="text"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={mail}
                              />
                            </div>
                            <div style={{ marginTop: "20px" }}>
                              <TextInput
                                style={{ width: "90%" }}
                                type="text"
                                name="device"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.device}
                              />
                            </div>
                            <Label>STATUS</Label>
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              defaultValue={statusOptions[0]}
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
                            <FlexRow>
                              <TextArea
                                type="text"
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                                style={{
                                  width: "90%",
                                  resize: "none",
                                }}
                                rows={6}
                              />
                              {errors.description ? (
                                <div
                                  style={{
                                    marginLeft: "5px",
                                    backgroundColor: "orange",
                                    height: "38px",
                                    width: "210px",
                                    borderRadius: "25px",
                                  }}
                                >
                                  <div
                                    style={{
                                      marginTop: "8px",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    {errors.description}
                                  </div>
                                </div>
                              ) : null}
                            </FlexRow>
                          </FlexColumn>
                        </FlexColumn>
                      </Divljak>
                      <Divljak>
                        <FlexColumn>
                          <FlexRow>
                            <FlexColumn style={{ marginLeft: "20px" }}>
                              <Label>POČETAK</Label>

                              <StyledTimePicker
                                style={{ width: 120 }}
                                showSecond={false}
                                className="form-control"
                                name="timeStart"
                                defaultValue={values.timeStart}
                                onChange={(tajm) =>
                                  setFieldValue("timeStart", tajm)
                                }
                                //disabled={true}
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
                                //disabled={true}
                              />
                            </FlexColumn>
                            <FlexColumn>
                              <Label>Datum kraj</Label>
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
                                defaultValue={yesNoOptions[0]}
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
                              <Label>PARKING</Label>
                              <TextInput
                                type="text"
                                name="jobParking"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.jobParking}
                                style={{ width: 105 }}
                                //disabled={true}
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
                                    value={values.part}
                                    width={"92%"}
                                  />
                                </div>
                              ) : drugiPrekidac ? (
                                <TextInputPart
                                  key={index}
                                  name={item.title}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.part}
                                  width={"92%"}
                                />
                              ) : (
                                <FlexRow key={index}>
                                  <TextInputPart
                                    name={item.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.part}
                                    width={"300px"}
                                  />
                                  <div style={{ marginLeft: "10px" }}>
                                    <TextInputPart
                                      name={item.titlePrice}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
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
                        Dodaj
                      </Button>
                      <Button
                        type="button"
                        onClick={() => props.history.push("/workorders")}
                      >
                        Odustani
                      </Button>
                    </FlexRow>
                  </ButtonContainer>
                </RightGridContainer>
              </GridContainer>
            </Wrapper>
          </form>
        )}
      </Formik>
      {popupNew ? <PopupClientNew closePopup={togglePopupClose} /> : null}
      {popupDelete ? (
        <PopupClientDelete closePopup={togglePopupDeleteClose} />
      ) : null}
    </div>
  );
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
      border: `1px solid ${colorPalette.primary100}`,
    },
  }),
};

const statusStyles = {
  container: (provided, state) => ({
    ...provided,
    width: "94%",
    boxShadow: state.isFocused ? `0 0 5px ${colorPalette.primary100}` : null,
    borderColor: state.isFocused ? colorPalette.primary100 : null,
  }),
  control: (base) => ({
    ...base,
    "&:hover": {
      border: `1px solid ${colorPalette.primary100}`,
    },
  }),
};

const clientStyles = {
  container: (provided, state) => ({
    ...provided,
    width: 165,
    boxShadow: state.isFocused ? `0 0 5px ${colorPalette.primary100}` : null,
    borderColor: state.isFocused ? colorPalette.primary100 : null,
  }),
  control: (base) => ({
    ...base,
    "&:hover": {
      border: `1px solid ${colorPalette.primary100}`,
    },
  }),
};

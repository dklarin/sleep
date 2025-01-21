import React, { useState, useLayoutEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

import styled from "styled-components";

import { Link } from "react-router-dom";
import { AUTH_TOKEN } from "../../utils/constants";

const StyledProSidebar = styled(ProSidebar)`
  position: fixed;
`;

export const Sidebar = () => {
  const role = localStorage.getItem("role");

  let collapsed = false;
  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
  }

  function ShowWindowDimensions() {
    const [width] = useWindowSize();

    if (width < 1128) {
      collapsed = true;
    }
  }

  ShowWindowDimensions();

  return (
    <StyledProSidebar collapsed={collapsed}>
      <Menu iconShape="square">
        <SubMenu title="Radni nalozi" defaultOpen>
          <MenuItem>
            Lista radnih naloga
            <Link to="/workorders" />
          </MenuItem>
          <MenuItem>
            Novi nalog <Link to="/newworkorder" />
          </MenuItem>
        </SubMenu>
        {role === "admin" ? (
          <SubMenu title="Administracija" defaultOpen={true}>
            <MenuItem>
              Lista korisnika
              <Link to="/users" />
            </MenuItem>

            <MenuItem>
              Novi korisnik
              <Link to="/newuser" />
            </MenuItem>
          </SubMenu>
        ) : (
          <div />
        )}
        <MenuItem>
          Logout
          <Link
            to="/"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              localStorage.clear();
            }}
          />
        </MenuItem>
      </Menu>
    </StyledProSidebar>
  );
};

export default Sidebar;

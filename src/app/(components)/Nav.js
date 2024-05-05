//Nav.js
"use client";
import * as React from "react";
import Dashboard from "../dashboard/page";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import CoffeeMakerIcon from "@mui/icons-material/CoffeeMaker";
import AddCardIcon from "@mui/icons-material/AddCard";

const drawerWidth = 265;

import Link from "next/link";

const Nav = () => {
  return (
    // <div className="my-4 flex gap-4 justify-center border-gray-500 border-2 p-2">
    //   <Link href="/" className="bg-blue-400 p-2">
    //     Home
    //   </Link>
    //   <Link href="/createIssue" className="bg-blue-400 p-2">
    //     Issue Machine
    //   </Link>
    //   <Link href="/inuse" className="bg-blue-400 p-2">
    //     Inuse
    //   </Link>
    // </div>
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem key={"MAKERSPACE"} disablePadding>
            <Link href="https://www.iiti.ac.in/public/storage/BoG/48th_BoG.pdf">
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon className="text-indigo-600 text-5xl" />
                </ListItemIcon>
                <div className="flex flex-col">
                  <Typography
                    variant="h6"
                    className="text-xl font-serif font-bold"
                  >
                    MAKERSPACE
                  </Typography>
                  <div className="flex-grow flex justify-center text-justify">
                    <Typography className="font-serif font-bold">
                      IIT Indore
                    </Typography>
                  </div>
                </div>
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={"Dashboard"} disablePadding>
            <Link href="/dashboard">
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                {/* <ListItemText primary={"Dashboard"} /> */}
                <Typography variant="h7" className="text-lg font-semibold">
                  Dashboard
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key={"Persons"} disablePadding>
            <Link href="/showPerson">
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                {/* <ListItemText primary={"Persons"} /> */}
                <Typography variant="h7" className="text-lg font-semibold">
                  Persons
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key={"Machines"} disablePadding>
            <Link href="/showMachine">
              <ListItemButton>
                <ListItemIcon>
                  <CoffeeMakerIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                {/* <ListItemText primary={"Machines"} /> */}
                <Typography variant="h7" className="text-lg font-semibold">
                  Machines
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key={"Issue Machine"} disablePadding>
            <Link href="/showInventory">
              <ListItemButton>
                <ListItemIcon>
                  <AddCardIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                <Typography variant="h7" className="text-lg font-semibold">
                  Inventory
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem key={"Add Person"} disablePadding>
            <Link href="/createPerson">
              <ListItemButton>
                <ListItemIcon>
                  <PersonAddIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                {/* <ListItemText primary={"Add Peson"} /> */}
                <Typography variant="h7" className="text-lg font-semibold">
                  Add Person
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key={"Add Machine"} disablePadding>
            <Link href="/addMachine">
              <ListItemButton>
                <ListItemIcon>
                  <CoffeeMakerIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                {/* <ListItemText primary={"Add Machine"} /> */}
                <Typography variant="h7" className="text-lg font-semibold">
                  Add Machine
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key={"Issue Machine"} disablePadding>
            <Link href="/createIssue">
              <ListItemButton>
                <ListItemIcon>
                  <AddCardIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                <Typography variant="h7" className="text-lg font-semibold">
                  Issue Machine
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key={"Issue Item"} disablePadding>
            <Link href="/createIssueInventory">
              <ListItemButton>
                <ListItemIcon>
                  <AddCardIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                <Typography variant="h7" className="text-lg font-semibold">
                  Issue Item
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key={"Issue Machine"} disablePadding>
            <Link href="/addInventory">
              <ListItemButton>
                <ListItemIcon>
                  <AddCardIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                <Typography variant="h7" className="text-lg font-semibold">
                  Add Inventory
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
          <Divider />
          <ListItem key={"Issue Machine"} disablePadding>
            <Link href="/pdf">
              <ListItemButton>
                <ListItemIcon>
                  <AddCardIcon className="text-indigo-500 text-2xl" />
                </ListItemIcon>
                <Typography variant="h7" className="text-lg font-semibold">
                  Get Report
                </Typography>
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Nav;

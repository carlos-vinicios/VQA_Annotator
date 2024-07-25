"use client";

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { signOut } from "@/services/auth";
import { useRouter } from "next/navigation";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FindInPageIcon from "@mui/icons-material/FindInPage";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideMenu({ matchers }) {
  const { mobileMatches, tabletMatches, computerMatches } = matchers;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const router = useRouter()

  const goToAnnotation = () => {
    //caso tenha mais de um página no futuro, colocar o controle aqui
    router.push("/evaluation");
    return;
  };

  const goToVisualization = () => {
    //caso tenha mais de um página no futuro, colocar o controle aqui
    router.push("/visualization");
    return;
  };

  const handleSingOut = () => {
    //remove os cookies de sessão e redireciona para o login
    signOut({ callbackUrl: "/login", redirect: true });
  };

  const options = [
    { text: "Anotação", icon: <EditNoteIcon />, action: goToAnnotation },
    {
      text: "Visulização",
      icon: <FindInPageIcon />,
      action: goToVisualization,
    },
    { text: "Sair", icon: <LogoutIcon />, action: handleSingOut },
  ];

  const handleChangeDrawerState = () => {
    setOpen(!open);
  };

  const drawerButton = () => {
    if (theme.direction === "rtl") {
      if (open) return <ChevronRightIcon />;
      return <ChevronLeftIcon />;
    } else {
      if (open) return <ChevronLeftIcon />;
      return <ChevronRightIcon />;
    }
  };

  const drawerVariant = () => {
    if ((mobileMatches || tabletMatches) && !computerMatches) {
      return open ? "permanent" : "temporary";
    }

    return "permanent";
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleChangeDrawerState}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Co-Annotation Tool
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant={drawerVariant()} open={open}>
        <DrawerHeader>
          <IconButton onClick={handleChangeDrawerState}>
            {drawerButton()}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {options.map((element) => (
            <ListItem
              key={element.text}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={element.action}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {element.icon}
                </ListItemIcon>
                <ListItemText
                  primary={element.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
